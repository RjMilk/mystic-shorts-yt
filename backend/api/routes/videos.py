"""
API роуты для управления видео
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database.database import get_db
from database.models import Video, VideoType, UploadStatus
from services.video_service import VideoService
from services.youtube_service import YouTubeService
from services.telegram_service import TelegramService

router = APIRouter()

class VideoCreate(BaseModel):
    """Модель для создания видео"""
    title: str
    description: Optional[str] = None
    video_type: str = VideoType.SHORT
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    privacy_status: str = "private"
    account_id: int

class VideoResponse(BaseModel):
    """Модель ответа для видео"""
    id: int
    title: str
    description: Optional[str]
    video_type: str
    duration: Optional[int]
    status: str
    youtube_video_id: Optional[str]
    youtube_url: Optional[str]
    upload_progress: int
    tags: Optional[List[str]]
    category: Optional[str]
    privacy_status: str
    account_id: int
    created_at: datetime
    uploaded_at: Optional[datetime]
    
    class Config:
        from_attributes = True

@router.post("/upload", response_model=VideoResponse)
async def upload_video(
    file: UploadFile = File(...),
    title: str = None,
    description: str = None,
    video_type: str = VideoType.SHORT,
    tags: str = None,
    category: str = None,
    privacy_status: str = "private",
    account_id: int = None,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Загрузить видео на YouTube"""
    try:
        video_service = VideoService(db)
        youtube_service = YouTubeService()
        
        # Создание записи о видео
        video_data = VideoCreate(
            title=title,
            description=description,
            video_type=video_type,
            tags=tags.split(",") if tags else None,
            category=category,
            privacy_status=privacy_status,
            account_id=account_id
        )
        
        video = await video_service.create_video(video_data, file)
        
        # Запуск загрузки в фоне
        background_tasks.add_task(
            youtube_service.upload_video,
            video.id,
            file.file,
            video_data
        )
        
        return video
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[VideoResponse])
async def get_videos(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    video_type: Optional[str] = None,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Получить список видео"""
    video_service = VideoService(db)
    return await video_service.get_videos(skip, limit, status, video_type, account_id)

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    """Получить видео по ID"""
    video_service = VideoService(db)
    video = await video_service.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    return video

@router.put("/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    tags: Optional[List[str]] = None,
    category: Optional[str] = None,
    privacy_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Обновить видео"""
    video_service = VideoService(db)
    video = await video_service.update_video(
        video_id, title, description, tags, category, privacy_status
    )
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    return video

@router.delete("/{video_id}")
async def delete_video(video_id: int, db: Session = Depends(get_db)):
    """Удалить видео"""
    video_service = VideoService(db)
    success = await video_service.delete_video(video_id)
    if not success:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    return {"message": "Видео успешно удалено"}

@router.post("/{video_id}/retry-upload")
async def retry_upload(
    video_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Повторить загрузку видео"""
    video_service = VideoService(db)
    youtube_service = YouTubeService()
    
    video = await video_service.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    
    # Запуск повторной загрузки в фоне
    background_tasks.add_task(
        youtube_service.upload_video,
        video.id,
        None,
        None
    )
    
    return {"message": "Повторная загрузка запущена"}

@router.post("/{video_id}/publish")
async def publish_video(
    video_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Опубликовать видео"""
    video_service = VideoService(db)
    youtube_service = YouTubeService()
    
    success = await youtube_service.publish_video(video_id)
    if not success:
        raise HTTPException(status_code=400, detail="Ошибка публикации видео")
    
    # Отправка уведомления в Telegram
    telegram_service = TelegramService()
    background_tasks.add_task(
        telegram_service.send_notification,
        f"Видео {video_id} успешно опубликовано"
    )
    
    return {"message": "Видео успешно опубликовано"}

@router.get("/{video_id}/status")
async def get_upload_status(video_id: int, db: Session = Depends(get_db)):
    """Получить статус загрузки видео"""
    video_service = VideoService(db)
    video = await video_service.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Видео не найдено")
    
    return {
        "status": video.status,
        "progress": video.upload_progress,
        "youtube_url": video.youtube_url
    }

@router.post("/bulk-upload")
async def bulk_upload_videos(
    files: List[UploadFile] = File(...),
    account_id: int = None,
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Массовая загрузка видео"""
    video_service = VideoService(db)
    youtube_service = YouTubeService()
    
    results = []
    for file in files:
        try:
            video_data = VideoCreate(
                title=file.filename,
                video_type=VideoType.SHORT,
                account_id=account_id
            )
            
            video = await video_service.create_video(video_data, file)
            results.append(video.id)
            
            # Запуск загрузки в фоне
            background_tasks.add_task(
                youtube_service.upload_video,
                video.id,
                file.file,
                video_data
            )
        except Exception as e:
            results.append({"error": str(e)})
    
    return {"uploaded": len(results), "results": results}
