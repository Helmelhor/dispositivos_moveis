from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.config import get_settings
from app.database import engine, Base

# Importar TODOS os modelos para que SQLAlchemy os registre
from app.models.user import User
from app.models.volunteer import Volunteer
from app.models.learner import Learner
from app.models.subject import Subject
from app.models.lesson import Lesson
from app.models.published_lesson import PublishedLesson
from app.models.course import Course, CourseMaterial, CourseProgress
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.gamification import Badge, UserBadge, PointsTransaction
from app.models.partner import PartnerLocation
from app.models.news import News
from app.models.communication import Message, ForumTopic, ForumReply

from app.api.subjects import router as subjects_router
from app.api.profiles import router as profiles_router
from app.api.lessons import router as lessons_router
from app.api.published_lessons import router as published_lessons_router
from app.api.news import router as news_router
from app.api.partners import router as partners_router
from app.api.users import router as users_router
from app.api.forum import router as forum_router
from app.websocket.endpoint import websocket_endpoint

settings = get_settings()

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API Backend - Plataforma de Voluntariado Educacional"
)

# Configurar CORS
origins = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir arquivos estáticos de mídia
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
if (uploads_dir / "media").exists():
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir rotas da API
app.include_router(users_router)
app.include_router(subjects_router)
app.include_router(profiles_router)
app.include_router(lessons_router)
app.include_router(published_lessons_router)
app.include_router(news_router)
app.include_router(partners_router)
app.include_router(forum_router)

# Rota WebSocket
@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)


# Rota raiz
@app.get("/")
def read_root():
    return {
        "message": f"Bem-vindo à {settings.app_name}",
        "version": settings.app_version,
        "description": "Plataforma de Voluntariado Educacional",
        "docs": "/docs",
        "endpoints": {
            "subjects": "/subjects",
            "volunteers": "/profiles/volunteers",
            "learners": "/profiles/learners",
            "lessons": "/lessons",
            "published_lessons": "/published-lessons",
            "news": "/news",
            "partners": "/partners",
            "websocket": "/ws"
        }
    }


# Rota de health check
@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload
    )
