"""
Script para popular o banco de dados com dados de exemplo
Execute: python seed_database.py
"""
from app.database import SessionLocal, engine, Base

# Importar TODOS os modelos para que SQLAlchemy os registre
from app.models.user import User
from app.models.volunteer import Volunteer
from app.models.learner import Learner
from app.models.subject import Subject
from app.models.lesson import Lesson
from app.models.course import Course, CourseMaterial, CourseProgress
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.gamification import Badge, UserBadge, PointsTransaction
from app.models.partner import PartnerLocation
from app.models.news import News
from app.models.communication import Message, ForumTopic, ForumReply

from datetime import datetime, timedelta

# Criar tabelas
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Limpar dados existentes (opcional)
    print("Limpando dados antigos...")
    db.query(Subject).delete()
    db.query(PartnerLocation).delete()
    db.query(News).delete()
    
    # ==================== DISCIPLINAS ====================
    print("\n📚 Criando disciplinas...")
    subjects = [
        Subject(name="Matemática", description="Álgebra, geometria, cálculo", category="Exatas", icon="calculator"),
        Subject(name="Português", description="Gramática, literatura, redação", category="Linguagens", icon="book"),
        Subject(name="Programação", description="Python, JavaScript, algoritmos", category="Tecnologia", icon="code"),
        Subject(name="Inglês", description="Conversação, gramática, vocabulário", category="Linguagens", icon="globe"),
        Subject(name="Física", description="Mecânica, termodinâmica, eletricidade", category="Exatas", icon="atom"),
        Subject(name="Química", description="Orgânica, inorgânica, físico-química", category="Exatas", icon="flask"),
        Subject(name="História", description="História do Brasil e mundial", category="Humanas", icon="history"),
        Subject(name="Geografia", description="Geografia física e humana", category="Humanas", icon="map"),
        Subject(name="Biologia", description="Genética, ecologia, anatomia", category="Biológicas", icon="leaf"),
        Subject(name="Informática Básica", description="Windows, Office, Internet", category="Tecnologia", icon="computer"),
    ]
    
    db.bulk_save_objects(subjects)
    db.commit()
    print(f"✅ {len(subjects)} disciplinas criadas!")
    
    # ==================== LOCAIS PARCEIROS ====================
    print("\n🗺️ Criando locais parceiros...")
    partners = [
        PartnerLocation(
            name="ONG Educação para Todos",
            partner_type="ong",
            description="ONG dedicada à educação de jovens e adultos",
            address="Rua das Flores, 123",
            city="São Paulo",
            state="SP",
            phone="(11) 1234-5678",
            email="contato@educacaoparatodos.org.br",
            is_active=True
        ),
        PartnerLocation(
            name="Biblioteca Municipal Central",
            partner_type="library",
            description="Espaço público com salas de estudo e computadores",
            address="Av. Paulista, 1000",
            city="São Paulo",
            state="SP",
            phone="(11) 9876-5432",
            email="biblioteca@sp.gov.br",
            is_active=True
        ),
        PartnerLocation(
            name="Escola Estadual Dom Pedro II",
            partner_type="school",
            description="Escola pública que apoia projetos educacionais",
            address="Rua do Ensino, 456",
            city="Rio de Janeiro",
            state="RJ",
            phone="(21) 2345-6789",
            email="escola.pedro@rj.gov.br",
            is_active=True
        ),
        PartnerLocation(
            name="Centro Comunitário Vila Nova",
            partner_type="community_center",
            description="Centro com salas para aulas e atividades",
            address="Rua da Comunidade, 789",
            city="Belo Horizonte",
            state="MG",
            phone="(31) 3456-7890",
            email="centro@vilanova.org.br",
            is_active=True
        ),
        PartnerLocation(
            name="ONG Jovens Programadores",
            partner_type="ong",
            description="Ensina programação para jovens de comunidades",
            address="Av. Tecnologia, 321",
            city="Curitiba",
            state="PR",
            phone="(41) 4567-8901",
            email="contato@jovensprogramadores.org",
            is_active=True
        ),
    ]
    
    db.bulk_save_objects(partners)
    db.commit()
    print(f"✅ {len(partners)} locais parceiros criados!")
    
    # ==================== NOTÍCIAS E EVENTOS ====================
    print("\n📰 Criando notícias, eventos e campanhas...")
    news_items = [
        News(
            title="Bem-vindo à Plataforma de Voluntariado Educacional!",
            content="Estamos felizes em lançar nossa plataforma que conecta voluntários e aprendizes. Juntos, podemos transformar vidas através da educação!",
            news_type="news",
            author="Equipe da Plataforma",
            is_featured=True,
            is_active=True,
            published_at=datetime.now()
        ),
        News(
            title="Oficina de Programação para Iniciantes",
            content="Aprenda Python do zero com nossos voluntários! A oficina será online e totalmente gratuita. Inscrições abertas!",
            news_type="event",
            author="ONG Jovens Programadores",
            event_date=datetime.now() + timedelta(days=15),
            event_location="Online",
            event_link="https://meet.google.com/abc-defg-hij",
            is_featured=True,
            is_active=True,
            published_at=datetime.now()
        ),
        News(
            title="Campanha de Arrecadação de Material Escolar",
            content="Estamos arrecadando cadernos, canetas, lápis e outros materiais escolares para distribuir aos nossos aprendizes. Você pode doar na Biblioteca Municipal Central.",
            news_type="campaign",
            author="Biblioteca Municipal",
            campaign_goal="Arrecadar 500 cadernos e 1000 canetas",
            campaign_end_date=datetime.now() + timedelta(days=30),
            campaign_contact="biblioteca@sp.gov.br",
            is_featured=True,
            is_active=True,
            published_at=datetime.now()
        ),
        News(
            title="Aula Aberta de Matemática - Geometria",
            content="Voluntários especializados darão uma aula aberta sobre geometria básica. Todos são bem-vindos!",
            news_type="event",
            event_date=datetime.now() + timedelta(days=7),
            event_location="Centro Comunitário Vila Nova - BH",
            is_active=True,
            published_at=datetime.now()
        ),
        News(
            title="Novos Cursos Disponíveis na Plataforma",
            content="Adicionamos novos cursos de Inglês, História e Biologia! Acesse o módulo educativo e comece a aprender hoje mesmo.",
            news_type="announcement",
            is_active=True,
            published_at=datetime.now() - timedelta(days=2)
        ),
    ]
    
    db.bulk_save_objects(news_items)
    db.commit()
    print(f"✅ {len(news_items)} notícias/eventos criados!")
    
    print("\n" + "="*50)
    print("✨ Banco de dados populado com sucesso!")
    print("="*50)
    print("\n📊 Resumo:")
    print(f"  • {len(subjects)} disciplinas")
    print(f"  • {len(partners)} locais parceiros")
    print(f"  • {len(news_items)} notícias/eventos/campanhas")
    print("\n🚀 Inicie o servidor e acesse http://localhost:8000/docs")
    print("="*50)

except Exception as e:
    print(f"\n❌ Erro ao popular banco de dados: {e}")
    db.rollback()
finally:
    db.close()
