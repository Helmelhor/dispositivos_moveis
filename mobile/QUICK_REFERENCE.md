# ⚡ QUICK REFERENCE - Frontend EducaConecta

## 🚀 Começar Rápido

```bash
# 1. Instale
cd mobile && npm install

# 2. Configure URL
# Edite: services/api.ts → API_BASE_URL

# 3. Rode
npx expo start

# 4. Escolha
a = Android, i = iOS, w = Web
```

---

## 📂 Arquivos Principais

| Arquivo | Função | Status |
|---------|--------|--------|
| `types/index.ts` | Tipos TS | ✅ |
| `services/api.ts` | API client | ✅ |
| `contexts/AuthContext.tsx` | Auth state | ✅ |
| `components/ui/*` | Componentes | ✅ |
| `screens/LoginScreen.tsx` | Tela login | ✅ |
| `screens/SignupScreen.tsx` | Tela signup | ✅ |
| `screens/HomeScreen.tsx` | Dashboard | ✅ |
| `screens/SearchScreen.tsx` | Busca | ✅ |
| `screens/NewsScreen.tsx` | Notícias | ✅ |
| `screens/ProfileScreen.tsx` | Perfil | ✅ |

---

## 🎨 Componentes UI

### Button
```tsx
<Button 
  title="Clique"
  onPress={() => {}}
  variant="primary"  // primary|secondary|outline|danger
  size="large"       // small|medium|large
  loading={false}
  disabled={false}
/>
```

### TextInput
```tsx
<TextInput
  label="Email"
  placeholder="user@example.com"
  value={email}
  onChangeText={setEmail}
  icon="mail"
  error={errors.email}
  helperText="Será usado para login"
/>
```

### Card
```tsx
<Card elevated>
  <Text>Conteúdo</Text>
</Card>
```

### Loading
```tsx
<Loading fullScreen size="large" color="#0A66C2" />
```

---

## 🔐 Autenticação

### Login
```tsx
import { useAuth } from '@/contexts/AuthContext';

const { login } = useAuth();

await login('user@example.com', 'senha123');
```

### Signup
```tsx
const { signup } = useAuth();

await signup('user@example.com', 'senha123', 'João Silva', 'learner');
```

### Logout
```tsx
const { logout } = useAuth();

await logout();
```

### Obter usuário
```tsx
const { state } = useAuth();

const user = state.user;
const token = state.userToken;
const isLoading = state.isLoading;
```

---

## 🌐 API

### Importar
```tsx
import apiService from '@/services/api';
```

### Usar
```tsx
// Notícias
const news = await apiService.getNews({ limit: 10 });
const newsItem = await apiService.getNewsItem(1);

// Disciplinas
const subjects = await apiService.getSubjects();
const subject = await apiService.getSubject(1);

// Parceiros
const partners = await apiService.getPartners();

// Health check
await apiService.healthCheck();
```

### Configurar Token
```tsx
apiService.setToken('seu-token-jwt');
apiService.clearToken();
```

---

## 🗺️ Navegação

### Navegar
```tsx
navigation?.navigate('Home');
navigation?.navigate('Search');
navigation?.navigate('News');
navigation?.navigate('Profile');
```

### Com Parâmetros
```tsx
navigation?.navigate('NewsDetail', { newsId: 123 });

// Receber
const { newsId } = route?.params || {};
```

### Voltar
```tsx
navigation?.goBack();
```

---

## 📱 Telas

| Tela | Função | Rota |
|------|--------|------|
| LoginScreen | Login | Login |
| SignupScreen | Cadastro | Signup |
| HomeScreen | Dashboard | Home |
| SearchScreen | Busca | Search |
| NewsScreen | Notícias | News |
| ProfileScreen | Perfil | Profile |

---

## 🎯 Tarefas Comuns

### Adicionar Nova Tela
```tsx
// 1. Criar screens/MinhaScreen.tsx
// 2. Adicionar export em screens/index.ts
// 3. Importar em app/_layout.tsx
// 4. Adicionar ao Stack

<Stack.Screen 
  name="Minha" 
  component={MinhaScreen}
  options={{ title: 'Minha Tela' }}
/>
```

### Adicionar Componente UI
```tsx
// 1. Criar components/ui/MeuComponente.tsx
// 2. Adicionar export em components/ui/index.ts
// 3. Usar em qualquer lugar

import { MeuComponente } from '@/components/ui';
<MeuComponente prop1="valor" />
```

### Chamar API
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  apiService.getData()
    .then(setData)
    .catch(err => Alert.alert('Erro', err.message))
    .finally(() => setLoading(false));
}, []);
```

### Validar Formulário
```tsx
const [errors, setErrors] = useState<any>({});

const validate = () => {
  const newErrors: any = {};
  
  if (!email) newErrors.email = 'Campo obrigatório';
  if (!password) newErrors.password = 'Campo obrigatório';
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 🔍 Debug

### Ver Logs
```bash
# Android
adb logcat | grep "ExpoApp"

# iOS
xcrun simctl spawn booted log stream --predicate 'process == "Expo"'
```

### Shaking Device
```
Shake o device/emulator → Debug menu aparece
```

### Verificar State
```tsx
console.log('Auth state:', state);
console.log('User:', state.user);
console.log('Token:', state.userToken);
```

### Testar API
```bash
# Na pasta backend
curl http://localhost:8000/health
curl http://localhost:8000/news/
curl http://localhost:8000/subjects/
```

---

## 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `FRONTEND_GUIDE.md` | Guia completo |
| `FRONTEND_SUMMARY.md` | Resumo executivo |
| `TODO.md` | Roadmap e melhorias |
| `TESTING_GUIDE.md` | Testes |
| `ARCHITECTURE.md` | Arquitetura |
| `CONCLUSAO.md` | Conclusão |

---

## 🎨 Cores & Estilos

```typescript
// Cores padrão
PRIMARY = '#0A66C2'
SUCCESS = '#10B981'
WARNING = '#F59E0B'
ERROR = '#DC2626'
BG = '#F5F8FB'
TEXT = '#1F2937'

// Usando
style={{ color: PRIMARY, fontSize: 16, fontWeight: 'bold' }}
```

---

## 📋 Checklist de Desenvolvimento

- [ ] Leia `FRONTEND_GUIDE.md`
- [ ] Entenda a arquitetura (`ARCHITECTURE.md`)
- [ ] Configure URL da API
- [ ] Teste login/signup
- [ ] Teste todas as telas
- [ ] Valide formulários
- [ ] Trate erros
- [ ] Teste responsividade
- [ ] Sem console.logs
- [ ] TypeScript sem erros
- [ ] Documente suas mudanças

---

## ❌ Erros Comuns

### "Module not found: axios"
```bash
npm install axios
```

### "Cannot find module '@/types'"
Verificar `tsconfig.json` → `baseUrl` e `paths`

### "API retorna 404"
- Backend está rodando?
- URL está correta?
- Endpoint existe?

### "AsyncStorage is undefined"
```bash
npm install @react-native-async-storage/async-storage
```

### "Navigation not working"
Verificar se Screen está registrado no Stack

---

## 🚀 Dicas de Performance

1. Use `useMemo` para cálculos pesados
2. Use `useCallback` para callbacks
3. Lazy load images
4. Não renderize tudo de uma vez
5. Minimize re-renders
6. Use FlatList ao invés de ScrollView + map

---

## 📱 Testar em Device

### Android
```bash
# 1. Instale Expo Go
# 2. Rode: npx expo start
# 3. Aponte câmera no QR code
# 4. App abre
```

### iOS
```bash
# 1. Instale Expo Go
# 2. Rode: npx expo start
# 3. Pressione 'i' ou escaneie QR
# 4. App abre
```

---

## 🔗 Links Úteis

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Docs](https://axios-http.com)

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| App não inicia | `npm install` + verificar erros |
| API 404 | Verificar endpoint e backend |
| Token expira | Implementar refresh token |
| Imagem não carrega | Verificar URL e permissões |
| Sem dados | Backend populado? |

---

**⚡ Pronto para codificar! 🚀**
