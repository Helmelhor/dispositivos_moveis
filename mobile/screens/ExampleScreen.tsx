// EXEMPLO DE COMO CRIAR UMA NOVA TELA
// Copie este arquivo e adapte conforme necessário

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Button, TextInput, Loading } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';

interface ExampleScreenProps {
  navigation: any;
  route?: any; // Parâmetros passados via navigation
}

/**
 * ExampleScreen - Template para criar novas telas
 * 
 * TODO: Personalize conforme necessário:
 * - [ ] Trocar nome da tela
 * - [ ] Adicionar componentes específicos
 * - [ ] Conectar com API endpoints
 * - [ ] Implementar lógica de negócios
 * - [ ] Styling customizado
 */
export const ExampleScreen: React.FC<ExampleScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Extrair parâmetros da rota se necessário
  const itemId = route?.params?.itemId;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Substituir com chamada real à API
      // const response = await apiService.getSomeData();
      // setData(response);
      
      // Dados simulados
      setData([
        { id: 1, title: 'Item 1', description: 'Descrição 1' },
        { id: 2, title: 'Item 2', description: 'Descrição 2' },
      ]);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    // TODO: Implementar ação específica
    console.log('Action triggered');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header customizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Tela</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Settings')}>
          <MaterialIcons name="more-vert" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de informação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <Card>
            <Text style={styles.text}>
              Usuário logado: {state.user?.name}
            </Text>
            <Text style={[styles.text, { marginTop: 8 }]}>
              Tipo: {state.user?.role === 'learner' ? 'Aprendiz' : 'Voluntário'}
            </Text>
          </Card>
        </View>

        {/* Seção de formulário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formulário</Text>
          <TextInput
            label="Campo 1"
            placeholder="Digite algo..."
            icon="text-fields"
            containerStyle={{ marginBottom: 12 }}
          />
          <TextInput
            label="Campo 2"
            placeholder="Digite algo..."
            icon="description"
          />
        </View>

        {/* Seção de lista */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista de Dados</Text>
          {error && (
            <Card style={{ backgroundColor: '#FEE2E2', borderColor: '#DC2626' }}>
              <Text style={{ color: '#DC2626' }}>⚠️ {error}</Text>
            </Card>
          )}
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 12 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>
                  {item.description}
                </Text>
              </Card>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum dado disponível
              </Text>
            }
          />
        </View>

        {/* Botões de ação */}
        <View style={styles.section}>
          <Button
            title="Ação Primária"
            onPress={handleAction}
            variant="primary"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Ação Secundária"
            onPress={handleAction}
            variant="secondary"
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Ação Perigosa"
            onPress={handleAction}
            variant="danger"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

// ============================================
// INSTRUÇÕES DE INTEGRAÇÃO NO NAVIGATION
// ============================================
/*

1. Adicione a tela ao arquivo de rotas (app/(tabs)/index.tsx ou similar):

import { ExampleScreen } from '@/screens/ExampleScreen';

<Stack.Screen 
  name="Example" 
  component={ExampleScreen}
  options={{
    title: 'Minha Tela',
    headerShown: true,
  }}
/>

2. Para navegar para esta tela de outra tela:

navigation?.navigate('Example');

// Ou com parâmetros:
navigation?.navigate('Example', { itemId: 123 });

3. Para receber os parâmetros na tela:

const { itemId } = route?.params || {};

4. Para voltar para a tela anterior:

navigation?.goBack();

*/

// ============================================
// CHECKLIST DE REQUISITOS
// ============================================
/*

Antes de fazer deploy, verifique:

[ ] Tela está responsiva (funciona em diferentes tamanhos)
[ ] Tela tem loading state
[ ] Tela tem error handling
[ ] Tela tem empty state
[ ] Todos os campos estão validados
[ ] Componentes reutilizáveis foram usados
[ ] Não há console.log no código final (ou use logger)
[ ] TypeScript types estão corretos
[ ] Acessibilidade foi considerada (cores, textos legíveis)
[ ] Testou em múltiplos dispositivos
[ ] Performance foi otimizada (evite renders desnecessários)
[ ] Localizações específicas do componente foram documentadas

*/
