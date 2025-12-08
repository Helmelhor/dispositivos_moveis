// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Sempre redireciona para a tela de login ao iniciar o app
  return <Redirect href="/login" />;
}
