# 🧪 Guia de Testes - EducaConecta Frontend

## 🚀 Como Testar

### 1. Setup Inicial

```bash
# Navegue para a pasta mobile
cd mobile

# Instale dependências
npm install

# Se receber erros, limpe cache
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. Inicie o Expo

```bash
# Terminal 1: Inicie o servidor Expo
npx expo start

# Ou use:
npm start
```

### 3. Abra em Simulator/Device

```bash
# Android Emulator
a

# iOS Simulator (macOS apenas)
i

# Web Browser
w

# Ou escaneie QR code com Expo Go app
```

---

## 📋 Checklist de Testes

### 🔐 Telas de Autenticação

#### LoginScreen
```
✅ E-mail válido + senha → Tela inicial
❌ E-mail inválido → Erro "Email inválido"
❌ Senha vazia → Erro "Senha é obrigatória"
✅ Clique em "Criar conta" → SignupScreen
✅ Clique em "Esqueceu a senha?" → (TODO - não implementado)
✅ Toggle password visibility → Funcionando
✅ Design responsivo → OK
```

**Como testar:**
```
1. Inicie o app
2. Veja a tela de login
3. Tente email inválido: "teste"
4. Tente senha vazia: deixe em branco
5. Use credentials válidas: qualquer email/senha (simulado)
6. Clique em "Criar conta"
```

#### SignupScreen
```
✅ Todos os campos vazios → Erros aparecem
✅ Nome vazio → Erro
❌ Email inválido → Erro
❌ Senhas diferentes → Erro "não correspondem"
❌ Senha < 6 caracteres → Erro
✅ Seleção de tipo conta → Ativa/desativa
✅ Toggle password visibility → Ambas funcionam
✅ Criar conta com dados válidos → HomeScreen
✅ Link "Já tem conta?" → Volta para login
```

**Como testar:**
```
1. Na LoginScreen, clique "Criar conta"
2. Tente campos vazios → Veja erros
3. Complete com dados válidos
4. Selecione "Aprendiz" ou "Voluntário"
5. Clique "Criar Conta"
```

### 🏠 Tela Principal

#### HomeScreen
```
✅ Greeting com nome do usuário
✅ 4 quick actions clicáveis
✅ Notícias carregam (mock data)
✅ Disciplinas mostram 6 itens
✅ Pull-to-refresh funciona
✅ Clique em notícia → (TODO - NewsDetailScreen)
✅ Clique em disciplina → (TODO - SubjectDetailScreen)
✅ Call-to-action "Quero ser voluntário" clicável
```

**Como testar:**
```
1. Faça login (qualquer email/senha)
2. Veja greeting com seu nome
3. Teste quick actions (clique em cada um)
4. Faça pull-down para refresh
5. Clique em notícia e disciplina
```

### 🔍 Tela de Busca

#### SearchScreen
```
✅ Barra de busca funciona
✅ Resultados em tempo real
✅ Filtros mudam resultados (estão preparados)
✅ Cards clicáveis
✅ Empty state quando sem resultados
```

**Como testar:**
```
1. Vá para SearchScreen
2. Digite "Programação" → Vê resultado
3. Limpe e deixe vazio → Vê todas as disciplinas
4. Clique em filtro "Eventos" → (TODO - vai mudar tipo)
5. Clique em um card de resultado
```

### 📰 Tela de Notícias

#### NewsScreen
```
✅ Filtros funcionam (Tudo, Eventos, Campanhas, Notícias)
✅ Lista de notícias exibe
✅ Emojis de tipo aparecem
✅ Badge de "destaque" aparece
✅ Info de evento mostra data e local
✅ Info de campanha mostra objetivo
✅ Pull-to-refresh funciona
✅ Empty state funciona
```

**Como testar:**
```
1. Vá para NewsScreen
2. Veja lista completa
3. Clique em "Eventos" → Filtra eventos
4. Clique em "Campanhas" → Filtra campanhas
5. Volte para "Tudo"
6. Faça pull-to-refresh
```

### 👤 Tela de Perfil

#### ProfileScreen
```
✅ Foto de perfil aparece
✅ Nome e email mostram
✅ Status badge aparece
✅ Informações de contato são editáveis (cards)
✅ Tipo de conta correto
✅ Estatísticas mostram (0 para dados simulados)
✅ Menu de configurações clicável
✅ Botão "Sair" funciona
```

**Como testar:**
```
1. Vá para ProfileScreen
2. Veja seus dados
3. Clique em editar ícones (próxima versão)
4. Clique em menu items
5. Clique "Sair" → Volta para login
```

---

## 🐛 Debugging

### Acessar Console

**Simulador Android:**
```bash
adb logcat | grep "ExpoApp"
```

**Simulador iOS:**
```bash
xcrun simctl spawn booted log stream --predicate 'process == "Expo"'
```

**Usando Expo dev client:**
- Shake device/emulator
- Tap "Debug menu"
- Veja logs em tempo real

### Erros Comuns

#### "Module not found: 'axios'"
```bash
npm install axios
```

#### "Module not found: '@react-native-async-storage/async-storage'"
```bash
npm install @react-native-async-storage/async-storage
```

#### "Cannot find module '@/types'"
- Verifique `tsconfig.json`
- Baseurl deve ser: `"baseUrl": "."`
- Path mapping: `"@/*": ["./*"]`

#### Network errors ao buscar da API
- Verifique IP em `services/api.ts`
- Certifique-se que backend está rodando
- Teste: `curl http://192.168.1.168:8000/health`
- Em emulador, use `http://10.0.2.2:8000` (Android)

#### "You haven't connected a device yet"
- Android: Abra Android Emulator
- iOS: Abra Xcode → Simulator
- Ou use web: `npx expo start` → Pressione `w`

---

## 📊 Dados de Teste

### Login/Signup (Simulado - qualquer valor funciona)
```
Email:    test@example.com (ou qualquer formato válido)
Password: password123 (ou qualquer coisa com 6+ chars)
```

### Notícias (Mock Data)
```
5 notícias são populadas automaticamente:
- "Bem-vindo à Plataforma..."
- "Oficina de Programação..."
- "Campanha de Arrecadação..."
- "Aula Aberta de Matemática..."
- "Novos Cursos Disponíveis..."
```

### Disciplinas (Mock Data)
```
10 disciplinas disponíveis:
- Matemática, Português, Programação
- Inglês, Física, Química
- História, Geografia, Biologia
- Informática Básica
```

### Parceiros (Mock Data)
```
5 parceiros:
- ONG Educação para Todos (SP)
- Biblioteca Municipal Central (SP)
- Escola Estadual Dom Pedro II (RJ)
- Centro Comunitário Vila Nova (MG)
- ONG Jovens Programadores (PR)
```

---

## 🎯 Casos de Uso Completos

### Caso 1: Novo Usuário - Aprendiz

```
1. Abra app
2. Veja tela de login
3. Clique "Criar conta"
4. Preencha dados:
   - Nome: João Silva
   - Email: joao@example.com
   - Senha: senha123
   - Confirmar: senha123
   - Tipo: Aprendiz
5. Clique "Criar Conta"
6. Veja HomeScreen com greeting "Olá, João!"
7. Clique em "Buscar" → SearchScreen
8. Digite "Programação" → Vê resultado
9. Clique em "Notícias" → NewsScreen
10. Veja notícias filtradas
11. Clique em ícone de perfil ou menu → ProfileScreen
12. Veja seu perfil como "Aprendiz"
13. Clique "Sair" → Volta para login
```

### Caso 2: Login + Navegação

```
1. Tela de login
2. Email: prof@example.com, Senha: prof123
3. Clique "Entrar"
4. Veja HomeScreen
5. Clique cada quick action
6. Teste pull-to-refresh
7. Navegue entre abas
8. Volte para perfil
9. Veja tipo = Voluntário
```

### Caso 3: Busca e Filtros

```
1. HomeScreen
2. Clique "Buscar"
3. Veja todas as 10 disciplinas
4. Digite "Mat" na busca
5. Veja apenas Matemática
6. Limpe a busca
7. Clique filtro "Voluntários"
8. Clique filtro "Subjects"
9. Teste navegação
```

---

## 📱 Testes de Responsividade

Teste em diferentes tamanhos:

| Device | Tamanho | Teste |
|--------|--------|-------|
| iPhone SE | 375x667 | Fonte legível? Botões clicáveis? |
| iPhone 12/13 | 390x844 | Layout OK? Spacing correto? |
| iPhone 14 Pro Max | 430x932 | Sem overflow? |
| Pixel 4 | 412x915 | OK no Android? |
| iPad | 768x1024 | Adaptado bem? |

---

## ✅ Checklist Final

Antes de fazer deploy:

- [ ] Tela de login funciona
- [ ] Tela de signup funciona
- [ ] HomeScreen carrega dados
- [ ] SearchScreen busca funciona
- [ ] NewsScreen filtra
- [ ] ProfileScreen mostra dados
- [ ] Logout funciona
- [ ] Sem erros no console
- [ ] Testado em múltiplos devices
- [ ] Testado em simulador Android
- [ ] Testado em simulador iOS (se em Mac)
- [ ] Testado em web
- [ ] Nenhum console.error
- [ ] Performance aceitável
- [ ] Imagens carregam rápido
- [ ] Sem memory leaks

---

## 🚨 Problemas Conhecidos

1. **Mock data não persiste entre telas**
   - Esperado - sem backend real
   - Será fixado quando integrar API

2. **Logout não recarrega app**
   - Esperado - simulado
   - Será fixado com autenticação real

3. **Sem imagens nas notícias**
   - Esperado - não implementado
   - Adicionar em próxima versão

4. **Chat não funciona**
   - Esperado - não implementado
   - WebSocket será adicionado

---

## 📝 Relatório de Testes

Ao testar, preencha este template:

```
Data: ____/____/______
Device: Android / iOS / Web
Model: ________________
Função Testada: ________________

Resultado: ✅ PASSOU / ❌ FALHOU

Detalhes:
_________________________________
_________________________________

Prints (se houver bugs):
[Anexe aqui]

Recomendações:
_________________________________
_________________________________
```

---

## 🎬 Próximas Melhorias

- [ ] Testes automatizados
- [ ] E2E tests
- [ ] Performance profiling
- [ ] Screenshots para documentação
- [ ] Video walkthrough
- [ ] QA checklist integrado

---

**Teste bem! 🚀**
