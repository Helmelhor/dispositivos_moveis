# Frontend EducaConecta - Guia Completo

## 📱 Estrutura do Projeto

```
mobile/
├── types/                    # Tipos TypeScript compartilhados
│   └── index.ts             # Definições de User, News, Subject, etc
├── services/                # Serviços de API e lógica de negócios
│   └── api.ts              # Cliente Axios com endpoints
├── contexts/                # Context API para estado global
│   └── AuthContext.tsx     # Gerenciamento de autenticação
├── screens/                 # Telas principais da aplicação
│   ├── LoginScreen.tsx      # Tela de login
│   ├── SignupScreen.tsx     # Tela de cadastro
│   ├── HomeScreen.tsx       # Tela inicial com resumo
│   ├── SearchScreen.tsx     # Busca de disciplinas e voluntários
│   ├── NewsScreen.tsx       # Listagem de notícias e eventos
│   └── ProfileScreen.tsx    # Perfil do usuário
├── components/
│   └── ui/                  # Componentes reutilizáveis
│       ├── Button.tsx       # Botão customizado
│       ├── TextInput.tsx    # Campo de entrada
│       ├── Card.tsx         # Card genérico
│       └── Loading.tsx      # Loading spinner
├── app/                     # Navegação com Expo Router
│   ├── _layout.tsx         # Layout raiz
│   └── (tabs)/             # Abas inferiores
└── constants/               # Cores, temas, etc
```

## 🎯 Telas Implementadas

### 1. **LoginScreen** (`screens/LoginScreen.tsx`)
- ✅ Campos de email e senha
- ✅ Validação de formulário
- ✅ Botão de "Esqueceu a senha?"
- ✅ Link para criar conta
- ✅ Design limpo e profissional

**TODO:**
- Integrar com endpoint `/users/login` (TODO - criar no backend)
- Implementar recuperação de senha
- Adicionar autenticação com redes sociais

### 2. **SignupScreen** (`screens/SignupScreen.tsx`)
- ✅ Cadastro com nome, email, senha
- ✅ Seleção de tipo de conta (Aprendiz/Voluntário)
- ✅ Validação de formulário e senha
- ✅ Link para login

**TODO:**
- Integrar com endpoint `POST /users/`
- Implementar upload de documentos para voluntários
- Validação de email em tempo real
- CAPTCHA para evitar spam

### 3. **HomeScreen** (`screens/HomeScreen.tsx`)
- ✅ Greeting personalizado
- ✅ Quick actions (Buscar, Agendar, Mensagens, Pontos)
- ✅ Seção de notícias/eventos
- ✅ Seção de disciplinas populares
- ✅ Call-to-action para voluntariado
- ✅ Pull-to-refresh

**TODO:**
- Exibir recomendações baseadas em perfil
- Banner com promoções/campanhas
- Atalhos para ações rápidas (agendar aula, buscar voluntário)
- Histórico de atividades recentes

### 4. **SearchScreen** (`screens/SearchScreen.tsx`)
- ✅ Barra de busca
- ✅ Filtros (Voluntários, Aprendizes, Disciplinas)
- ✅ Listagem de resultados
- ✅ Busca em tempo real

**TODO:**
- Implementar busca de voluntários (GET /profiles/volunteers)
- Implementar busca de aprendizes
- Filtros avançados (categoria, localização, disponibilidade, rating)
- Histórico de buscas recentes
- Salvando buscas favoritas

### 5. **NewsScreen** (`screens/NewsScreen.tsx`)
- ✅ Listagem de notícias, eventos e campanhas
- ✅ Filtros por tipo
- ✅ Badges de destaque
- ✅ Informações de data e visualizações
- ✅ Pull-to-refresh

**TODO:**
- Detalhe de notícias (NewsDetailScreen)
- Inscrição em eventos
- Compartilhamento
- Comentários e discussões
- Notificações de eventos próximos

### 6. **ProfileScreen** (`screens/ProfileScreen.tsx`)
- ✅ Exibição de dados do perfil
- ✅ Informações de contato
- ✅ Status do usuário
- ✅ Estatísticas (aulas, pontos, selos)
- ✅ Menu de configurações
- ✅ Botão de logout

**TODO:**
- Tela de edição de perfil
- Upload de foto de perfil
- Bio/descrição
- Certificados conquistados
- Histórico de aulas/transações
- Notificações
- Privacidade e segurança
- Suporte ao cliente

## 🔐 Autenticação (AuthContext)

A aplicação usa **Context API** para gerenciar o estado de autenticação globalmente.

### Uso:

```tsx
import { useAuth } from '@/contexts/AuthContext';

export const MyComponent = () => {
  const { state, login, signup, logout } = useAuth();
  
  if (state.isLoading) return <Loading />;
  
  if (!state.userToken) {
    return <LoginScreen />;
  }
  
  return (
    <Text>Bem-vindo, {state.user?.name}!</Text>
  );
};
```

### Métodos:
- `login(email, password)` - Fazer login
- `signup(email, password, name, role)` - Criar conta
- `logout()` - Sair da conta
- `restoreToken()` - Restaurar token ao iniciar app

### Estado:
```typescript
{
  isLoading: boolean,      // Carregando dados
  isSignout: boolean,      // Logout realizado
  userToken?: string,      // JWT ou token de sessão
  user?: User             // Dados do usuário logado
}
```

## 🎨 Componentes Reutilizáveis

### Button
```tsx
<Button
  title="Clique aqui"
  onPress={() => {}}
  variant="primary"        // primary | secondary | outline | danger
  size="large"             // small | medium | large
  loading={false}
  disabled={false}
/>
```

### TextInput
```tsx
<TextInput
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  icon="mail"
  error={errors.email}
  helperText="Campo obrigatório"
/>
```

### Card
```tsx
<Card elevated>
  <Text>Conteúdo do card</Text>
</Card>
```

### Loading
```tsx
<Loading fullScreen size="large" color="#0A66C2" />
```

## 🌐 Integração com API

Usar `apiService` em qualquer lugar:

```tsx
import apiService from '@/services/api';

// Exemplo
const news = await apiService.getNews({ 
  news_type: 'event', 
  limit: 10 
});

// Configurar token de autenticação
apiService.setToken(token);

// Limpar token ao sair
apiService.clearToken();
```

### Endpoints disponíveis:
- `login(email, password)` ⚠️ TODO
- `signup(data)` ✅
- `getUser(userId)` ✅
- `updateUser(userId, data)` ✅
- `getSubjects()` ✅
- `getNews(params)` ✅
- `getPartners()` ✅
- `healthCheck()` ✅

## 📝 Próximas Implementações

### Telas Faltantes:
1. **BecomeVolunteerScreen** - Cadastro completo para voluntários
   - Seleção de disciplinas de atuação
   - Upload de documentos de comprovação
   - Disponibilidade (online/presencial)
   - Localização e bairros atendidos

2. **NewsDetailScreen** - Detalhe de notícia/evento
   - Conteúdo completo
   - Inscrição em eventos
   - Mapa de localização
   - Compartilhamento
   - Comentários

3. **SubjectDetailScreen** - Detalhe de disciplina
   - Descrição completa
   - Voluntários disponíveis
   - Cursos e aulas
   - Quiz de teste

4. **LessonScreen** - Listagem de aulas
   - Próximas aulas
   - Aulas concluídas
   - Rating e feedback

5. **ScheduleLessonScreen** - Agendamento
   - Seleção de data/hora
   - Tipo de aula (online/presencial)
   - Confirmação

6. **ChatScreen** - Mensagens
   - Conversas com voluntários
   - Notificações de novos mensagens

7. **GamificationScreen** - Pontos e Badges
   - Saldo de pontos
   - Badges conquistados
   - Ranking

8. **ForumScreen** - Fórum de dúvidas
   - Tópicos por disciplina
   - Respostas e votação
   - Melhor resposta

9. **PartnersMapScreen** - Mapa de parceiros
   - Localização de ONGs, bibliotecas, escolas
   - Filtro por tipo
   - Informações de contato

10. **NotificationsScreen** - Central de notificações
    - Notificações de aulas
    - Mensagens
    - Eventos
    - Ranking

### Funcionalidades:
- [ ] WebSocket para chat em tempo real
- [ ] Notificações push
- [ ] Câmera para foto de perfil
- [ ] Mapa interativo
- [ ] Pagamento de taxas (se houver)
- [ ] Dark mode
- [ ] Offline mode
- [ ] Download de certificados
- [ ] Analytics

### Backend (API):
- [ ] Endpoint de login: `POST /login` ou `POST /users/login`
- [ ] Endpoint de perfil: `GET /users/{id}/profile`
- [ ] Endpoint de voluntários: `GET /profiles/volunteers`
- [ ] Endpoint de aprendizes: `GET /profiles/learners`
- [ ] WebSocket para chat: `WS /ws/chat`
- [ ] Upload de arquivos: `POST /upload`
- [ ] Busca avançada: `GET /search`
- [ ] Rating: `POST /lessons/{id}/rate`

## 🚀 Como Usar

1. **Instale as dependências:**
```bash
cd mobile
npm install
```

2. **Configure a URL da API** em `services/api.ts`:
```typescript
const API_BASE_URL = 'http://192.168.1.168:8000'; // Seu IP
```

3. **Inicie o Expo:**
```bash
npx expo start
```

4. **Teste no Simulador/Dispositivo:**
- Android: Pressione `a`
- iOS: Pressione `i`
- Web: Pressione `w`

## 📚 Recursos

- [Expo Router Documentation](https://expo.dev/router)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

## 💬 Observações

- Algumas endpoints ainda não existem no backend, marque como **TODO**
- O AuthContext simula login/signup. Integre com API real quando disponível.
- Use `console.log` para debug. Em produção, use library como `react-native-logger`
- Sempre validar dados no frontend E backend
- Implementar tratamento de erros robusto

---

**Desenvolvido com ❤️ para o EducaConecta**
