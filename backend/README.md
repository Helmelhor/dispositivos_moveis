# Backend API - Plataforma de Voluntariado Educacional

API backend para conectar voluntários (professores e estudantes) com aprendizes, facilitando o ensino e aprendizagem de diversas disciplinas através de aulas presenciais ou online.

## 🎯 Funcionalidades

### ✅ Já Implementadas

#### 👥 Gestão de Usuários e Perfis
- **Cadastro de Voluntários**: Professores e estudantes podem se cadastrar enviando documentação para verificação
- **Cadastro de Aprendizes**: Alunos se cadastram com nome, áreas de interesse e localização
- **Perfis distintos**: Volunteer (voluntário) e Learner (aprendiz)
- **Status de aprovação**: Documentos verificados antes de ativar voluntários

#### 📚 Disciplinas
- CRUD completo de disciplinas (matemática, português, programação, etc.)
- Categorização por área (Exatas, Humanas, Tecnologia)
- Voluntários associam suas áreas de atuação
- Aprendizes associam suas áreas de interesse

#### 📅 Agendamento de Aulas
- **Solicitação de aulas** por aprendizes
- **Busca e aceitação** por voluntários
- **Tipos**: Presencial ou Online (Google Meet, Zoom)
- **Status**: Solicitada → Aceita → Confirmada → Concluída
- **Localização**: Endereço para presencial
- **Link de reunião**: Para aulas online
- **Avaliação**: Rating e feedback após conclusão

#### 🗺️ Mapa Comunitário
- Cadastro de locais parceiros (ONGs, escolas, bibliotecas)
- Filtros por tipo, cidade e estado
- Informações completas: endereço, contato, website

#### 📰 Notícias e Campanhas
- **Notícias**: Divulgação de informações relevantes
- **Eventos**: Datas, locais e links para eventos educacionais
- **Campanhas**: Arrecadação de materiais (cadernos, canetas, etc.)
- Contador de visualizações
- Destaques na página principal

#### 🔄 Sincronização em Tempo Real
- **WebSocket** para notificações automáticas
- Atualizações instantâneas entre web e mobile
- Notificações para: aulas solicitadas, aceitas, concluídas, mensagens, etc.

### 🚧 Modelos Criados (Prontos para uso)

#### 📖 Módulo Educativo
- **Cursos**: Conteúdo estruturado por níveis
- **Materiais**: Vídeos, PDFs, artigos
- **Progresso**: Acompanhamento do aluno

#### 🎮 Gamificação
- **Quiz**: Perguntas e respostas com pontuação
- **Badges/Selos**: Conquistas ao completar objetivos
- **Pontos**: Sistema de recompensas
- Histórico de transações de pontos

#### 💬 Comunicação
- **Mensagens diretas**: Chat entre usuários
- **Fórum**: Tópicos de discussão por disciplina
- Respostas aceitas pelo criador
- Sistema de likes

---

## 📋 Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)

## 🚀 Instalação

### 1. Criar ambiente virtual

```powershell
# No diretório backend/
python -m venv venv
```

### 2. Ativar ambiente virtual

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Instalar dependências

```powershell
pip install -r requirements.txt
```

### 4. Configurar variáveis de ambiente

```powershell
Copy-Item .env.example .env
```

### 5. Iniciar o servidor

```powershell
python main.py
```

A API estará disponível em: `http://localhost:8000`

---

## 📚 Documentação da API

Acesse a documentação interativa:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔌 Endpoints Principais

### 📚 Disciplinas (`/subjects`)
- `GET /subjects` - Listar disciplinas
- `POST /subjects` - Criar disciplina
- `GET /subjects/{id}` - Detalhes da disciplina
- `PUT /subjects/{id}` - Atualizar disciplina
- `DELETE /subjects/{id}` - Deletar disciplina

### 👥 Perfis (`/profiles`)

**Voluntários:**
- `POST /profiles/volunteers` - Criar perfil de voluntário
- `GET /profiles/volunteers` - Buscar voluntários (filtros: disciplina, cidade, tipo)
- `GET /profiles/volunteers/{id}` - Detalhes do voluntário
- `GET /profiles/volunteers/user/{user_id}` - Perfil por user_id
- `PUT /profiles/volunteers/{id}` - Atualizar perfil

**Aprendizes:**
- `POST /profiles/learners` - Criar perfil de aprendiz
- `GET /profiles/learners/{id}` - Detalhes do aprendiz
- `GET /profiles/learners/user/{user_id}` - Perfil por user_id
- `PUT /profiles/learners/{id}` - Atualizar perfil

### 📅 Aulas (`/lessons`)
- `POST /lessons` - Solicitar aula
- `GET /lessons` - Listar aulas (filtros: aluno, voluntário, status, tipo)
- `GET /lessons/available` - Aulas disponíveis para voluntários
- `GET /lessons/{id}` - Detalhes da aula
- `PUT /lessons/{id}` - Atualizar aula
- `POST /lessons/{id}/accept` - Voluntário aceita aula
- `POST /lessons/{id}/confirm` - Confirmar aula
- `POST /lessons/{id}/complete` - Marcar como concluída (com avaliação)
- `DELETE /lessons/{id}` - Cancelar aula

### 📰 Notícias (`/news`)
- `GET /news` - Listar notícias/eventos/campanhas
- `POST /news` - Criar notícia
- `GET /news/{id}` - Detalhes (incrementa visualizações)
- `PUT /news/{id}` - Atualizar notícia
- `DELETE /news/{id}` - Deletar notícia

### 🗺️ Locais Parceiros (`/partners`)
- `GET /partners` - Listar parceiros (filtros: tipo, cidade, estado)
- `POST /partners` - Criar parceiro
- `GET /partners/{id}` - Detalhes do parceiro
- `PUT /partners/{id}` - Atualizar parceiro
- `DELETE /partners/{id}` - Deletar parceiro

### 🔌 WebSocket (`/ws`)
- Conexão para receber atualizações em tempo real

---

## 📡 Mensagens WebSocket

### Tipos de notificações:

```json
{
  "type": "lesson_requested",
  "data": { /* dados da aula */ }
}
```

**Tipos disponíveis:**
- `subject_created`, `subject_updated`, `subject_deleted`
- `volunteer_created`, `volunteer_updated`
- `learner_created`, `learner_updated`
- `lesson_requested`, `lesson_accepted`, `lesson_confirmed`, `lesson_completed`, `lesson_cancelled`
- `news_created`, `news_updated`, `news_deleted`

---

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── api/
│   │   ├── subjects.py       # CRUD de disciplinas
│   │   ├── profiles.py       # Voluntários e Aprendizes
│   │   ├── lessons.py        # Agendamento de aulas
│   │   ├── news.py           # Notícias, eventos, campanhas
│   │   └── partners.py       # Locais parceiros
│   ├── models/
│   │   ├── user.py           # Usuário base
│   │   ├── volunteer.py      # Perfil voluntário
│   │   ├── learner.py        # Perfil aprendiz
│   │   ├── subject.py        # Disciplinas
│   │   ├── lesson.py         # Aulas
│   │   ├── course.py         # Cursos e materiais
│   │   ├── quiz.py           # Quiz e perguntas
│   │   ├── gamification.py   # Pontos e badges
│   │   ├── partner.py        # Locais parceiros
│   │   ├── news.py           # Notícias
│   │   └── communication.py  # Mensagens e fórum
│   ├── schemas/
│   │   ├── user.py
│   │   ├── profiles.py
│   │   ├── lesson.py
│   │   ├── course.py
│   │   ├── quiz.py
│   │   ├── gamification.py
│   │   ├── partner.py
│   │   ├── news.py
│   │   └── communication.py
│   ├── websocket/
│   │   ├── manager.py        # Gerenciador WebSocket
│   │   └── endpoint.py       # Endpoint WebSocket
│   ├── config.py             # Configurações
│   └── database.py           # Conexão BD
├── main.py                   # Aplicação FastAPI
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🗄️ Banco de Dados

Por padrão usa SQLite (`app.db`). Para mudar:

**PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
```

**MySQL:**
```env
DATABASE_URL=mysql://user:password@localhost/dbname
```

---

## 🎯 Próximos Passos

Agora você pode:

1. ✅ **Testar a API** no Swagger UI
2. 📱 **Criar o app Mobile** (React Native)
3. 🌐 **Criar a aplicação Web** (React + React Native Web)
4. 🔐 **Implementar autenticação** (JWT)
5. 📧 **Adicionar notificações** por email/push
6. 📊 **Criar dashboard** de administração

---

## 💡 Dicas de Uso

### Fluxo de uma aula:

1. **Aprendiz** cria solicitação: `POST /lessons`
2. **Voluntário** vê disponíveis: `GET /lessons/available`
3. **Voluntário** aceita: `POST /lessons/{id}/accept`
4. **Ambos** confirmam: `POST /lessons/{id}/confirm`
5. **Após aula**, marca concluída: `POST /lessons/{id}/complete`
6. **Sistema** adiciona pontos ao voluntário automaticamente

### Buscar voluntários por disciplina:

```http
GET /profiles/volunteers?subject_id=1&city=São Paulo&verified_only=true
```

### Criar evento educacional:

```json
POST /news
{
  "title": "Oficina de Programação",
  "content": "Aprenda Python gratuitamente!",
  "news_type": "event",
  "event_date": "2025-12-10T14:00:00",
  "event_location": "Biblioteca Central",
  "event_link": "https://meet.google.com/abc-defg-hij"
}
```
