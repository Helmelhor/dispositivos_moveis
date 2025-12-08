// app/news.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import apiService from '@/services/api';
import { News } from '@/types';

export default function NewsScreen() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await apiService.getNews();
      setNews(newsData);
    } catch (error) {
      // Pode adicionar tratamento de erro aqui
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📰 Todas as Notícias</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.newsCard}>
            <View style={styles.newsTypeBadge}>
              <Text style={styles.newsTypeText}>
                {item.news_type === 'event' && '📅'}
                {item.news_type === 'campaign' && '🎁'}
                {item.news_type === 'news' && '📰'}
                {item.news_type === 'announcement' && '📢'}
              </Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsDate}>
                {new Date(item.published_at).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notícia encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 18,
    textAlign: 'left',
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
  },
  newsTypeBadge: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newsTypeText: {
    fontSize: 20,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 18,
  },
  newsDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
