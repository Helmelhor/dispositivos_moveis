# Guia de Publicação de Aulas - Voluntários

## 📋 Descrição

A página **Ministrar Aulas** permite que voluntários cadastrados na plataforma publiquem conteúdo educacional, incluindo:
- 📝 Título e descrição detalhada
- 📚 Categorização por disciplina
- 🎥 Upload de mídia (vídeos, imagens, PDFs)
- 👁️ Visualização de métricas (visualizações, curtidas)

## ✅ Requisitos

- Usuário deve ter o role **"volunteer"** no banco de dados
- Estar autenticado na aplicação
- Ter acesso ao contexto de autenticação

## 🎯 Funcionalidades Principais

### 1. **Publicar Aula**
- Preencher título (máx 100 caracteres)
- Preencher descrição (máx 1000 caracteres)
- Selecionar uma disciplina da lista
- (Opcional) Adicionar arquivo de mídia

**Tipos de mídia suportados:**
- Vídeos: MP4, AVI, MOV, MKV, WebM
- Imagens: JPG, JPEG, PNG, GIF, WebP
- Documentos: PDF

### 2. **Visualizar Aulas Publicadas**
- Listar todas as aulas publicadas pelo voluntário
- Ver estatísticas (visualizações, curtidas)
- Deletar aulas quando desejar

## 🔧 Integração com Backend

### Endpoints utilizados:

#### POST `/published-lessons/`
Publica uma nova aula com suporte a upload de arquivo.

**Parâmetros:**
```
- volunteer_id: number (ID do voluntário)
- subject_id: number (ID da disciplina)
- title: string (Título da aula)
- description: string (Descrição)
- media_file: File (Opcional - arquivo de mídia)
```

**Resposta:**
```json
{
  "id": 1,
  "volunteer_id": 1,
  "subject_id": 2,
  "title": "Aula Prática de Programação",
  "description": "Aula prática sobre funções em JavaScript",
  "media_url": "/uploads/media/filename.mp4",
  "media_type": "video",
  "views_count": 0,
  "likes_count": 0,
  "created_at": "2025-12-13T10:30:00"
}
```

#### GET `/published-lessons/`
Recupera aulas publicadas com filtros.

**Parâmetros (opcionais):**
```
- volunteer_id: number
- subject_id: number
- skip: number (padrão: 0)
- limit: number (padrão: 50)
```

#### DELETE `/published-lessons/{lesson_id}`
Remove uma aula publicada (apenas o voluntário que publicou pode deletar).

**Parâmetros:**
```
- lesson_id: number (ID da aula)
- volunteer_id: number (para verificação de permissão)
```

#### POST `/published-lessons/{lesson_id}/like`
Incrementa o contador de curtidas.

## 📱 Componentes Utilizados

- **TextInput**: Campo de texto customizado
- **Button**: Botão de ação
- **Card**: Contêiner de conteúdo
- **ThemedText/ThemedView**: Componentes com suporte a tema claro/escuro

## 🎨 Design

- Interface de duas abas: "Publicar Aula" e "Minhas Aulas"
- Cards responsivos para visualização de aulas
- Campos com contador de caracteres
- Seleção de disciplina em scroll horizontal
- Feedback visual de ações (sucesso/erro)

## ⚙️ Configuração do Upload de Arquivos

Os arquivos são armazenados em:
```
backend/uploads/media/
```

Estrutura de nomes:
```
{volunteer_id}_{timestamp}_{original_filename}
```

URLs de acesso:
```
http://192.168.224.1:8000/uploads/media/{filename}
```

## 🚨 Tratamento de Erros

Todos os erros são exibidos como alertas ao usuário com mensagens clara:
- "Apenas voluntários podem publicar aulas"
- "Falha ao carregar disciplinas"
- "Tipo de arquivo não permitido"
- Etc.

## 📊 Modelo de Dados

### PublishedLesson
```typescript
{
  id: number;
  volunteer_id: number;
  subject_id: number;
  title: string;
  description?: string;
  media_url?: string;
  media_type?: string; // 'video' | 'image' | 'pdf'
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at?: string;
}
```

## 🔐 Segurança

- ✅ Validação de role (apenas voluntários)
- ✅ Validação de extensão de arquivo
- ✅ Verificação de permissão ao deletar (apenas proprietário)
- ✅ Limite de tamanho de arquivo (controlado pelo servidor)
- ✅ Validação de campos obrigatórios

## 📝 Exemplos de Uso

### Publicar uma aula com imagem:
1. Ir para aba "Publicar Aula"
2. Preencher título: "Fundamentos de Matemática"
3. Preencher descrição: "Uma introdução aos conceitos básicos de álgebra"
4. Selecionar disciplina: "Matemática"
5. Clicar em "📷 Imagem" para adicionar uma imagem
6. Clicar em "Publicar Aula"

### Visualizar minhas aulas:
1. Ir para aba "Minhas Aulas"
2. Listar todas as aulas publicadas
3. Ver número de visualizações e curtidas
4. Deletar uma aula se desejado

## 🆘 Troubleshooting

**Problema**: "Apenas voluntários podem publicar aulas"
- **Solução**: Verifique se sua conta está cadastrada como voluntário no banco de dados

**Problema**: Arquivo não carrega
- **Solução**: Verifique se o tipo de arquivo está na lista de extensões permitidas

**Problema**: Erro de conexão ao publicar
- **Solução**: Verifique se o servidor backend está rodando e se o IP está correto em `api.ts`

## 🔄 Fluxo de Dados

```
Ministrar_aulas.tsx
       ↓
   ApiService (publishLesson)
       ↓
Backend: POST /published-lessons/
       ↓
Salvar em PublishedLesson (DB)
Salvar arquivo em /uploads/media/
       ↓
Retornar resposta com URL
       ↓
Atualizar UI
```
