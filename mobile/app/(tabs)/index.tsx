// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

// URL base da API (troque 'localhost' pelo IP da máquina se estiver no celular físico)
const API_BASE = 'http://192.168.1.10:8000';

// Função genérica para buscar dados de qualquer endpoint
async function fetchData(endpoint: string) {
  try {
    const response = await axios.get(`${API_BASE}${endpoint}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default function HomeScreen() {
  // Troque o endpoint para consumir outro recurso (ex: '/volunteers', '/news', '/partners')
  const endpoint = '/profiles/volunteers';
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(endpoint)
      .then((result) => setData(result as any[]))
      .catch(err => {
        Alert.alert('Erro', 'Não foi possível carregar os dados: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de dados da API: {endpoint}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.itemBox}>
              {/* Exibe o campo 'name' se existir, senão mostra o JSON completo */}
              <Text style={styles.itemText}>{item.name ?? JSON.stringify(item)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F5F5F5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  itemBox: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#DDD' },
  itemText: { fontSize: 16 },
});

/*
Como usar para outros endpoints:
- Troque o valor de 'endpoint' para o recurso desejado, ex:
  const endpoint = '/volunteers';
  const endpoint = '/news';
  const endpoint = '/partners';
- O componente renderiza o campo 'name' se existir, ou o JSON completo do item.
- Para customizar a exibição, altere o renderItem conforme o modelo retornado pela API.
*/