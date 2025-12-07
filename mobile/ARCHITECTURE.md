// ARQUITETURA DO PROJETO
// 
// Este arquivo documenta a estrutura e organização do frontend EducaConecta
// Última atualização: 6 de dezembro de 2025

/*
==================================================
📁 ESTRUTURA COMPLETA DO PROJETO
==================================================

dispositivos_moveis/mobile/
│
├── 📂 types/
│   └── index.ts
│       └── Definições TypeScript compartilhadas
│           ├── User, Volunteer, Learner
│           ├── Subject, News, PartnerLocation
│           ├── AuthState, LoginRequest, SignupRequest
│           └── TODO: Adicionar mais tipos conforme necessário
│
├── 📂 services/
│   └── api.ts
│       └── Cliente Axios centralizado
│           ├── Configuração base (URL, timeout, headers)
│           ├── Interceptor de autenticação
│           ├── Métodos para cada recurso (users, news, subjects, etc)
│           ├── Tratamento de erros
│           └── TODO: Adicionar mais endpoints
│
├── 📂 contexts/
│   └── AuthContext.tsx
│       └── Gerenciamento de autenticação global com Context API
│           ├── useReducer para state management
│           ├── Métodos: login, signup, logout, restoreToken
│           ├── Persistência com AsyncStorage
│           ├── AuthProvider wrapper
│           └── useAuth() hook customizado
│
├── 📂 components/
│   └── 📂 ui/
│       ├── Button.tsx
│       │   └── Botão reutilizável com 4 variantes
│       │       ├── primary, secondary, outline, danger
│       │       ├── Tamanhos: small, medium, large
│       │       └── Props: loading, disabled
│       │
│       ├── TextInput.tsx
│       │   └── Input customizado
│       │       ├── Label, erro, helper text
│       │       ├── Ícone (MaterialIcons)
│       │       └── Validação integrada
│       │
│       ├── Card.tsx
│       │   └── Container genérico
│       │       ├── Versão simples e elevada
│       │       └── Props customizáveis
│       │
│       ├── Loading.tsx
│       │   └── Spinner de carregamento
│       │       ├── Tamanho customizável
│       │       ├── Modo fullscreen
│       │       └── Cor configurável
│       │
│       └── index.ts
│           └── Exporta todos os componentes UI
│
├── 📂 screens/
│   ├── LoginScreen.tsx
│   │   └── Tela de login
│   │       ├── Validação de email/senha
│   │       ├── Toggle password visibility
│   │       ├── Links para signup e recuperar senha
│   │       └── Integração com AuthContext
│   │
│   ├── SignupScreen.tsx
│   │   └── Tela de cadastro
│   │       ├── Nome, email, senha, confirmar
│   │       ├── Seleção de tipo (Aprendiz/Voluntário)
│   │       ├── Validação completa
│   │       └── Link para login
│   │
│   ├── HomeScreen.tsx
│   │   └── Tela inicial (dashboard)
│   │       ├── Greeting personalizado
│   │       ├── 4 quick actions
│   │       ├── Notícias em destaque
│   │       ├── 6 disciplinas populares
│   │       ├── Call-to-action para voluntariado
│   │       └── Pull-to-refresh
│   │
│   ├── SearchScreen.tsx
│   │   └── Tela de busca
│   │       ├── Barra de busca
│   │       ├── Filtros (Voluntários, Aprendizes, Disciplinas)
│   │       ├── Resultados em tempo real
│   │       └── Empty state
│   │
│   ├── NewsScreen.tsx
│   │   └── Tela de notícias/eventos/campanhas
│   │       ├── Filtros por tipo
│   │       ├── Cards com informações
│   │       ├── Info de evento (data, local)
│   │       ├── Info de campanha (objetivo)
│   │       ├── Badges de destaque
│   │       └── Pull-to-refresh
│   │
│   ├── ProfileScreen.tsx
│   │   └── Tela de perfil do usuário
│   │       ├── Foto e dados pessoais
│   │       ├── Status (Ativo/Pendente)
│   │       ├── Informações de contato
│   │       ├── Estatísticas
│   │       ├── Menu de configurações
│   │       └── Botão de logout
│   │
│   ├── ExampleScreen.tsx
│   │   └── Template para criar novas telas
│   │       ├── Estrutura padrão
│   │       ├── Instruções embutidas
│   │       ├── Checklist de requisitos
│   │       └── Pronto para copiar
│   │
│   └── index.ts
│       └── Exporta todas as telas
│
├── 📂 app/
│   ├── _layout.tsx
│   │   └── Layout raiz da navegação
│   │       ├── ThemeProvider
│   │       └── Stack de navegação
│   │
│   └── 📂 (tabs)/
│       ├── index.tsx
│       │   └── Tela inicial com tabs (SERÁ ATUALIZADO)
│       │
│       └── [outras tabs não implementadas ainda]
│
├── 📂 constants/
│   └── theme.ts
│       └── Cores, tipografia, tamanhos
│
├── 📂 hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── 📂 assets/
│   └── Imagens, ícones, fonts
│
├── 📂 scripts/
│   └── Utilitários de build/setup
│
├── 📄 package.json
│   └── Dependências e scripts
│       ├── dependencies: expo, react, react-native, axios, etc
│       └── scripts: start, android, ios, web, lint
│
├── 📄 tsconfig.json
│   └── Configuração TypeScript
│       └── baseUrl: ".", paths: "@/*": ["./*"]
│
├── 📄 FRONTEND_GUIDE.md 📚
│   └── Guia completo do frontend
│       ├── Estrutura do projeto
│       ├── Telas implementadas
│       ├── Componentes reutilizáveis
│       ├── Autenticação
│       ├── API integration
│       └── Próximas implementações
│
├── 📄 FRONTEND_SUMMARY.md 📚
│   └── Resumo executivo
│       ├── O que foi criado
│       ├── Design system
│       ├── Fluxos implementados
│       ├── Recursos implementados
│       ├── Próximos passos
│       └── Estatísticas
│
├── 📄 TODO.md 📚
│   └── Roadmap e melhorias
│       ├── Autenticação
│       ├── Telas faltantes
│       ├── Funcionalidades
│       ├── Priorização (crítico → baixo)
│       └── 50+ itens de melhoria
│
├── 📄 TESTING_GUIDE.md 📚
│   └── Guia de testes
│       ├── Setup inicial
│       ├── Checklist de testes
│       ├── Debugging
│       ├── Dados de teste
│       ├── Casos de uso completos
│       ├── Testes de responsividade
│       └── Problemas conhecidos
│
└── 📄 ARCHITECTURE.md (Este arquivo)
    └── Documentação da arquitetura
        ├── Estrutura de pastas
        ├── Fluxos de dados
        ├── Decisões de design
        └── Padrões utilizados

==================================================
🔄 FLUXOS DE DADOS
==================================================

1. FLUXO DE AUTENTICAÇÃO
   ┌──────────────┐
   │   App Init   │
   └──────┬───────┘
          │
          ↓
   ┌─────────────────────────────┐
   │ AuthContext.restoreToken()  │
   └──────┬──────────────────────┘
          │
          ↓
   ┌──────────────────────┐
   │ Token em Storage?    │
   └─┬────────────────┬───┘
     │ SIM            │ NÃO
     ↓                ↓
  Homescreen     LoginScreen
     │                │
     └────────┬───────┘
              │
         ┌────┴─────┐
         ↓          ↓
      Login    Signup
         │        │
         └─┬──────┘
           ↓
    Token Gerado
         │
         ↓
    Salvar Storage
         │
         ↓
    Atualizar Auth
         │
         ↓
    Navegar para Home

2. FLUXO DE DADOS (HomeScreen)
   ┌──────────────┐
   │ HomeScreen   │
   └──────┬───────┘
          │
          ├─→ useAuth() → user data
          │
          ├─→ apiService.getNews()
          │      │
          │      ↓
          │   axios GET /news/
          │      │
          │      ↓
          │   Backend retorna
          │      │
          │      ↓
          │   setNews(data)
          │
          ├─→ apiService.getSubjects()
          │      │
          │      ↓
          │   axios GET /subjects/
          │      │
          │      ↓
          │   Backend retorna
          │      │
          │      ↓
          │   setSubjects(data)
          │
          └─→ Render UI com dados

3. FLUXO DE NAVEGAÇÃO
   App Stack
   ├── LoginScreen
   ├── SignupScreen
   └── Tabs (quando autenticado)
       ├── HomeTab
       │   └── HomeScreen
       ├── SearchTab
       │   └── SearchScreen
       ├── NewsTab
       │   └── NewsScreen
       └── ProfileTab
           └── ProfileScreen

==================================================
🎯 PADRÕES E DECISÕES DE DESIGN
==================================================

1. ESTADO GLOBAL
   ✅ Context API + useReducer
   ❌ Redux (overhead para este projeto)
   → Razão: Projeto começa pequeno, pode evoluir

2. AUTENTICAÇÃO
   ✅ JWT/Token salvo em AsyncStorage
   ❌ Cookies (mobile não usa bem)
   → Razão: Padrão mobile moderno

3. COMPONENTES
   ✅ Componentes funcionais + hooks
   ❌ Class components (obsoleto)
   → Razão: React moderna, mais simples

4. VALIDAÇÃO
   ✅ Validação frontend + backend
   ❌ Apenas frontend
   → Razão: Segurança

5. TRATAMENTO DE ERROS
   ✅ Try/catch, error states, user feedback
   ❌ Silent failures
   → Razão: UX importante

6. ESTILO
   ✅ StyleSheet.create() (otimizado para React Native)
   ❌ Inline styles em tudo
   → Razão: Performance

7. TIPAGEM
   ✅ TypeScript completo
   ❌ JavaScript puro
   → Razão: Segurança, autocompletar, refactoring

==================================================
📊 ESTATÍSTICAS
==================================================

Total de Arquivos:     15+
Linhas de Código:      ~3000+
Componentes UI:        4
Telas Completas:       6 + 1 template
Tipos TS:              10+
Endpoints Mock:        6+
Documentação:          4 arquivos

==================================================
🚀 COMO ADICIONAR NOVA TELA
==================================================

1. Crie arquivo em screens/:
   ✅ Copie ExampleScreen.tsx
   ✅ Customize nomes e lógica
   ✅ Use componentes UI reutilizáveis

2. Exporte em screens/index.ts:
   ✅ export { MinhaTela } from './MinhaTela';

3. Adicione ao Navigation:
   ✅ Importe a tela
   ✅ Adicione ao Stack/Navigator
   ✅ Configure options (title, etc)

4. Navegue para ela:
   ✅ navigation?.navigate('MinhaTela');
   ✅ Ou com parâmetros: navigation?.navigate('MinhaTela', { param: value });

5. Teste:
   ✅ Simulador Android
   ✅ Simulador iOS
   ✅ Responsividade
   ✅ Validação
   ✅ Error handling

==================================================
🔌 COMO ADICIONAR NOVO COMPONENTE UI
==================================================

1. Crie em components/ui/:
   ✅ arquivo.tsx
   ✅ Com tipos TypeScript
   ✅ Com styles em StyleSheet.create()

2. Exporte em components/ui/index.ts:
   ✅ export { MeuComponente } from './MeuComponente';

3. Use em qualquer tela:
   ✅ import { MeuComponente } from '@/components/ui';
   ✅ <MeuComponente prop1="valor" />

4. Documente:
   ✅ Comentários JSDoc
   ✅ Props claras
   ✅ Exemplos de uso

==================================================
🛠️ COMO ADICIONAR NOVO ENDPOINT API
==================================================

1. Adicione método em services/api.ts:
   ```
   async meuMetodo(params?: any) {
     try {
       const response = await this.api.get('/seu-endpoint', { params });
       return response.data;
     } catch (error) {
       throw this.handleError(error);
     }
   }
   ```

2. Use em qualquer tela:
   ```
   const dados = await apiService.meuMetodo({ param: valor });
   ```

3. Trate erros:
   ```
   try {
     const dados = await apiService.meuMetodo();
   } catch (error: any) {
     Alert.alert('Erro', error.message);
   }
   ```

==================================================
⚠️ OBSERVAÇÕES IMPORTANTES
==================================================

1. Mock Data
   → Algumas chamadas retornam dados simulados
   → Integrar com API real conforme backend ficar pronto

2. Endpoints Faltantes
   → Veja TODOs em services/api.ts
   → Backend precisa implementar esses endpoints

3. Sem Testes Automatizados
   → Adicionar Jest + React Testing Library
   → E2E tests com Detox

4. Sem i18n
   → Adicionar i18next conforme necessário
   → Tradução para múltiplas linguagens

5. Sem Dark Mode
   → Preparado para adicionar
   → Use context para tema global

==================================================
📚 RECURSOS
==================================================

- Expo Router: https://expo.dev/router
- React Native: https://reactnative.dev
- TypeScript: https://www.typescriptlang.org
- Axios: https://axios-http.com
- Material Icons: https://fonts.google.com/icons

==================================================
*/

// Fim da documentação de arquitetura
