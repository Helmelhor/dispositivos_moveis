# 📋 TODO - EducaConecta Frontend

## 🔐 Autenticação

- [ ] **Login real com API**
  - Criar endpoint `POST /users/login` no backend
  - Implementar JWT ou sessão
  - Teste de login válido/inválido
  - Persistência de token com AsyncStorage

- [ ] **Signup completo**
  - Validação de email em tempo real
  - Confirmar email antes de criar conta
  - CAPTCHA para evitar spam
  - Termos de serviço e política de privacidade

- [ ] **Recuperação de senha**
  - Email com link de reset
  - Tela de novo password
  - Validação de token de reset

- [ ] **Autenticação social**
  - Google Sign-In
  - Facebook Login
  - GitHub (opcional)

## 📊 Telas Faltantes

### Cadastro de Voluntário (BecomeVolunteerScreen)
- [ ] Perfil completo de voluntário
- [ ] Seleção múltipla de disciplinas
- [ ] Upload de documentos de comprovação
- [ ] Disponibilidade de horários
- [ ] Preferência online/presencial
- [ ] Bio e descrição
- [ ] Foto de perfil
- [ ] Verificação de documentos (admin)

### Detalhe de Notícia (NewsDetailScreen)
- [ ] Exibição completa do conteúdo
- [ ] Imagens/vídeos
- [ ] Autor e data
- [ ] Inscrição em eventos
- [ ] Mapa de localização
- [ ] Botão de compartilhamento
- [ ] Comentários e discussão
- [ ] Rating/like

### Detalhe de Disciplina (SubjectDetailScreen)
- [ ] Descrição completa
- [ ] Voluntários disponíveis com rating
- [ ] Próximas aulas/cursos
- [ ] Quiz de teste
- [ ] Recursos (apostilas, vídeos)
- [ ] Comentários de alunos
- [ ] Progresso do usuário

### Agendamento de Aulas (ScheduleLessonScreen)
- [ ] Calendário interativo
- [ ] Seleção de data/hora
- [ ] Tipo de aula (online/presencial)
- [ ] Link do Google Meet/Zoom
- [ ] Confirmação de presença
- [ ] Lembretes/notificações
- [ ] Avaliação pós-aula

### Chat/Mensagens (ChatScreen)
- [ ] WebSocket para mensagens em tempo real
- [ ] Histórico de conversas
- [ ] Notificações de novo mensagens
- [ ] Digitando... indicator
- [ ] Emojis e anexos
- [ ] Bloqueio de usuários
- [ ] Grupo de chat (para turmas)

### Gamificação (GamificationScreen)
- [ ] Saldo de pontos
- [ ] Histórico de transações
- [ ] Badges conquistados
- [ ] Ranking global/local
- [ ] Desafios disponíveis
- [ ] Trocar pontos por prêmios
- [ ] Certificados

### Fórum de Dúvidas (ForumScreen)
- [ ] Lista de tópicos por disciplina
- [ ] Criar novo tópico
- [ ] Respostas e votação
- [ ] Marcar melhor resposta
- [ ] Busca no fórum
- [ ] Notificações de resposta
- [ ] Reputação de usuários

### Mapa de Parceiros (PartnersMapScreen)
- [ ] Integração com Google Maps
- [ ] Marcadores de ONGs, escolas, bibliotecas
- [ ] Filtro por tipo
- [ ] Informações de contato
- [ ] Rota até o local
- [ ] Horários de funcionamento
- [ ] Programas oferecidos

### Central de Notificações (NotificationsScreen)
- [ ] Notificações de aulas
- [ ] Mensagens
- [ ] Eventos próximos
- [ ] Badges conquistados
- [ ] Respostas no fórum
- [ ] Limpador de notificações antigas
- [ ] Configuração de preferências

### Edição de Perfil (EditProfileScreen)
- [ ] Foto de perfil com câmera
- [ ] Bio/descrição
- [ ] Localização
- [ ] Telefone
- [ ] Disponibilidade
- [ ] Disciplinas de interesse/atuação
- [ ] Preferências de notificação
- [ ] Privacidade

## 🔧 Funcionalidades Cross-Cutting

### API
- [ ] Endpoint de login: `POST /users/login` ou `POST /auth/login`
- [ ] Endpoint de refresh token
- [ ] Endpoint de logout
- [ ] Endpoint de perfil: `GET /users/me`
- [ ] Endpoint de voluntários: `GET /profiles/volunteers`
- [ ] Endpoint de aprendizes: `GET /profiles/learners`
- [ ] Busca avançada: `GET /search`
- [ ] Upload de arquivos: `POST /upload`
- [ ] WebSocket para chat: `WS /ws/chat/{conversationId}`
- [ ] Notificações push
- [ ] Rating de aulas: `POST /lessons/{id}/rate`

### Estado Global
- [ ] Redux ou Zustand (opcional, se Context fica muito grande)
- [ ] Persistência de preferências do usuário
- [ ] Cache de dados
- [ ] Sincronização offline

### Validação
- [ ] Validação em tempo real dos formulários
- [ ] Mensagens de erro mais específicas
- [ ] Validação no backend
- [ ] CSRF protection

### Segurança
- [ ] Não armazenar senhas em texto plano
- [ ] Sanitizar inputs
- [ ] HTTPS apenas
- [ ] Rate limiting
- [ ] Proteção contra XSS

### Performance
- [ ] Lazy loading de imagens
- [ ] Paginação em listas longas
- [ ] Memoização de componentes
- [ ] Otimização de renderização
- [ ] Bundle size reduction
- [ ] Offline-first quando possível

### Acessibilidade
- [ ] Suporte a screen readers
- [ ] Contraste de cores WCAG AA
- [ ] Textos legíveis (tamanho mínimo)
- [ ] Sem dependência apenas de cores
- [ ] Keyboard navigation
- [ ] Labels em formulários

### Dark Mode
- [ ] Implementar tema escuro
- [ ] Preferência do sistema operacional
- [ ] Armazenar preferência do usuário

### Internacionalização (i18n)
- [ ] Tradução para múltiplas linguagens
- [ ] Formatação de data/hora por locale
- [ ] Suporte a RTL (árabe, hebraico)

## 📱 Mobile-Específico

- [ ] Câmera para foto de perfil
- [ ] Galeria para upload de documentos
- [ ] Geolocalização
- [ ] Notificações push
- [ ] Deep linking
- [ ] App shortcuts
- [ ] Biometria (face/fingerprint)

## 🧪 Testing

- [ ] Unit tests com Jest
- [ ] Component tests com React Testing Library
- [ ] E2E tests com Detox
- [ ] Testes de performance
- [ ] Cobertura de código > 80%

## 📊 Analytics & Monitoring

- [ ] Google Analytics / Firebase Analytics
- [ ] Crash reporting (Sentry)
- [ ] Performance monitoring
- [ ] User behavior tracking

## 📚 Documentação

- [ ] Storybook para componentes
- [ ] API documentation
- [ ] Architecture decision records (ADRs)
- [ ] Setup guide
- [ ] Deployment guide
- [ ] Troubleshooting guide

## 🎨 Design & UX

- [ ] Design system completo
- [ ] Componentes reutilizáveis review
- [ ] Animations e transições
- [ ] Micro-interactions
- [ ] Feedback visual (toasts, modals)
- [ ] Loading states
- [ ] Empty states
- [ ] Error boundaries

## 🚀 DevOps & Deploy

- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Build optimization
- [ ] Staging environment
- [ ] Production monitoring
- [ ] Rollback strategy

## 📈 Melhorias Futuras

- [ ] Realidade aumentada para visualizar conteúdo
- [ ] Inteligência artificial para recomendações
- [ ] Machine learning para matching voluntário-aprendiz
- [ ] Video tutoriais dentro do app
- [ ] Podcast educacionais
- [ ] Comunidade/social features
- [ ] Gamificação avançada
- [ ] Marketplace de materiais

---

## Prioridade

### 🔴 Crítico (Sprint 1)
- Login/Signup funcional
- Home screen
- Visualizar notícias
- Perfil do usuário
- Logout

### 🟠 Alto (Sprint 2)
- Busca de voluntários
- Agendamento de aulas
- Chat básico
- Edição de perfil

### 🟡 Médio (Sprint 3)
- Gamificação
- Fórum
- Mapa de parceiros
- Notificações push

### 🟢 Baixo (Sprint 4+)
- Dark mode
- i18n
- Features avançadas
- Analytics

---

**Último update:** 6 de dezembro de 2025
