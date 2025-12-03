# 📖 Guia de Referência Rápida da API

## 🎯 Visão Geral

API REST completa para plataforma de voluntariado educacional com sincronização em tempo real via WebSocket.

**Base URL**: `http://localhost:8000`
**Docs**: `http://localhost:8000/docs`

---

## 📚 DISCIPLINAS

### Listar todas
```http
GET /subjects?category=Tecnologia&skip=0&limit=100
```

### Criar
```json
POST /subjects
{
  "name": "Programação",
  "description": "Python, JavaScript, algoritmos",
  "category": "Tecnologia",
  "icon": "code"
}
```

### Buscar por ID
```http
GET /subjects/1
```

### Atualizar
```json
PUT /subjects/1
{
  "description": "Nova descrição"
}
```

### Deletar
```http
DELETE /subjects/1
```

---

## 👥 PERFIS

### Criar Voluntário
```json
POST /profiles/volunteers
{
  "user_id": 1,
  "volunteer_type": "teacher",  // ou "student"
  "institution": "UFRJ",
  "document_url": "https://example.com/doc.pdf",
  "subject_ids": [1, 2, 3]
}
```

### Buscar Voluntários
```http
GET /profiles/volunteers?subject_id=1&city=São Paulo&verified_only=true
```

### Obter Voluntário por ID
```http
GET /profiles/volunteers/1
```

### Obter Voluntário por User ID
```http
GET /profiles/volunteers/user/1
```

### Atualizar Voluntário
```json
PUT /profiles/volunteers/1
{
  "institution": "USP",
  "subject_ids": [1, 2, 3, 4]
}
```

---

### Criar Aprendiz
```json
POST /profiles/learners
{
  "user_id": 2,
  "interest_ids": [1, 2, 3]
}
```

### Obter Aprendiz
```http
GET /profiles/learners/1
GET /profiles/learners/user/2
```

### Atualizar Aprendiz
```json
PUT /profiles/learners/1
{
  "interest_ids": [1, 2, 3, 4, 5]
}
```

---

## 📅 AULAS

### Solicitar Aula (Aprendiz)
```json
POST /lessons
{
  "learner_id": 1,
  "subject_id": 1,
  "title": "Preciso de ajuda com Álgebra",
  "description": "Equações de 2º grau",
  "lesson_type": "online",  // ou "presencial"
  "scheduled_date": "2025-12-10T14:00:00",
  "duration_minutes": 60,
  "meeting_platform": "google_meet",
  "meeting_link": "https://meet.google.com/abc-defg-hij"
}
```

### Listar Aulas Disponíveis (Voluntário)
```http
GET /lessons/available?city=São Paulo&subject_id=1
```

### Listar Minhas Aulas
```http
GET /lessons?learner_id=1&status_filter=confirmed
GET /lessons?volunteer_id=1&lesson_type=online
```

### Buscar Aula por ID
```http
GET /lessons/1
```

### Atualizar Aula
```json
PUT /lessons/1
{
  "scheduled_date": "2025-12-11T15:00:00",
  "status": "confirmed"
}
```

### Voluntário Aceita Aula
```json
POST /lessons/1/accept
{
  "volunteer_id": 1
}
```

### Confirmar Aula
```http
POST /lessons/1/confirm
```

### Concluir Aula (com avaliação)
```json
POST /lessons/1/complete
{
  "rating": 5,
  "feedback": "Excelente aula! Aprendi muito."
}
```

### Cancelar Aula
```http
DELETE /lessons/1
```

---

## 📰 NOTÍCIAS E EVENTOS

### Listar
```http
GET /news?news_type=event&is_featured=true
```

Tipos: `news`, `event`, `campaign`, `announcement`

### Criar Evento
```json
POST /news
{
  "title": "Oficina de Python",
  "content": "Aprenda Python do zero!",
  "news_type": "event",
  "author": "João Silva",
  "image_url": "https://example.com/image.jpg",
  "event_date": "2025-12-15T14:00:00",
  "event_location": "Online",
  "event_link": "https://meet.google.com/xyz",
  "is_featured": true
}
```

### Criar Campanha
```json
POST /news
{
  "title": "Arrecadação de Cadernos",
  "content": "Doe materiais escolares!",
  "news_type": "campaign",
  "campaign_goal": "Arrecadar 1000 cadernos",
  "campaign_end_date": "2025-12-31T23:59:59",
  "campaign_contact": "contato@ong.org.br"
}
```

### Visualizar Notícia (incrementa contador)
```http
GET /news/1
```

### Atualizar
```json
PUT /news/1
{
  "is_featured": false,
  "is_active": true
}
```

### Deletar
```http
DELETE /news/1
```

---

## 🗺️ LOCAIS PARCEIROS

### Listar
```http
GET /partners?partner_type=ong&city=São Paulo&state=SP
```

Tipos: `ong`, `school`, `library`, `community_center`, `other`

### Criar
```json
POST /partners
{
  "name": "ONG Educação",
  "partner_type": "ong",
  "description": "ONG dedicada à educação",
  "address": "Rua ABC, 123",
  "city": "São Paulo",
  "state": "SP",
  "latitude": "-23.550520",
  "longitude": "-46.633308",
  "phone": "(11) 1234-5678",
  "email": "contato@ong.org",
  "website": "https://ong.org",
  "image_url": "https://example.com/logo.png"
}
```

### Buscar por ID
```http
GET /partners/1
```

### Atualizar
```json
PUT /partners/1
{
  "phone": "(11) 9999-8888",
  "is_active": true
}
```

### Deletar
```http
DELETE /partners/1
```

---

## 🔌 WEBSOCKET

### Conectar
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Tipo:', message.type);
  console.log('Dados:', message.data);
};
```

### Tipos de Mensagens Recebidas

**Disciplinas:**
- `subject_created`, `subject_updated`, `subject_deleted`

**Perfis:**
- `volunteer_created`, `volunteer_updated`
- `learner_created`, `learner_updated`

**Aulas:**
- `lesson_requested` - Nova aula solicitada
- `lesson_accepted` - Voluntário aceitou
- `lesson_confirmed` - Aula confirmada
- `lesson_completed` - Aula concluída
- `lesson_cancelled` - Aula cancelada
- `lesson_updated` - Aula atualizada

**Notícias:**
- `news_created`, `news_updated`, `news_deleted`

### Exemplo de Mensagem
```json
{
  "type": "lesson_requested",
  "data": {
    "id": 1,
    "learner_id": 1,
    "subject_id": 1,
    "title": "Ajuda com Matemática",
    "lesson_type": "online",
    "scheduled_date": "2025-12-10T14:00:00",
    "status": "requested"
  }
}
```

---

## 📊 MODELOS DE DADOS

### UserRole (Enum)
- `learner` - Aprendiz
- `volunteer` - Voluntário

### UserStatus (Enum)
- `pending` - Aguardando aprovação
- `active` - Ativo
- `inactive` - Inativo
- `rejected` - Rejeitado

### LessonType (Enum)
- `online` - Aula online
- `presencial` - Aula presencial

### LessonStatus (Enum)
- `requested` - Solicitada
- `accepted` - Aceita pelo voluntário
- `confirmed` - Confirmada
- `completed` - Concluída
- `cancelled` - Cancelada

### PartnerType (Enum)
- `ong` - ONG
- `school` - Escola
- `library` - Biblioteca
- `community_center` - Centro Comunitário
- `other` - Outro

### NewsType (Enum)
- `news` - Notícia
- `event` - Evento
- `campaign` - Campanha
- `announcement` - Anúncio

---

## 🚀 Início Rápido

### 1. Instalar e Iniciar
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed_database.py  # Popular com dados de exemplo
python main.py
```

### 2. Testar no Swagger
Abra: http://localhost:8000/docs

### 3. Fluxo de Exemplo

**a) Criar disciplina:**
```
POST /subjects
```

**b) Criar perfil de aprendiz:**
```
POST /profiles/learners
```

**c) Solicitar aula:**
```
POST /lessons
```

**d) Criar perfil de voluntário:**
```
POST /profiles/volunteers
```

**e) Voluntário busca aulas:**
```
GET /lessons/available
```

**f) Voluntário aceita:**
```
POST /lessons/1/accept
```

**g) Confirmar aula:**
```
POST /lessons/1/confirm
```

**h) Após aula, marcar como concluída:**
```
POST /lessons/1/complete
```

---

## 💡 Dicas

- Use `skip` e `limit` para paginação
- Filtros são opcionais, podem ser combinados
- WebSocket notifica automaticamente sobre mudanças
- Documentos de voluntários precisam ser aprovados (`document_verified`)
- Aulas concluídas adicionam pontos aos voluntários automaticamente
- Notícias incrementam `views_count` ao serem visualizadas
