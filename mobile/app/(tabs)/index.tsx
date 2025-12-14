// app/(tabs)/index.tsx
// Este arquivo exporta a HomeScreen real do EducaConecta

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Loading } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { News, Subject } from '@/types';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, subjectsData] = await Promise.all([
        apiService.getNews({ limit: 5 }),
        apiService.getSubjects(),
      ]);
      setNews(newsData);
      setSubjects(subjectsData.slice(0, 6));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Olá, {state.user?.name?.split(' ')[0] || 'Visitante'}! 👋
          </Text>
          <Text style={styles.subgreeting}>Bem-vindo ao EducaConecta</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/profile' as any)}
          style={styles.profileButton}
        >
          <MaterialIcons name="account-circle" size={40} color="#0A66C2" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/explore' as any)}
        >
          <MaterialIcons name="search" size={24} color="#0A66C2" />
          <Text style={styles.actionText}>Buscar</Text>
        </TouchableOpacity>
        {state.user?.role === 'volunteer' ? (
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/Ministrar_aulas' as any)}>
            <MaterialIcons name="calendar-today" size={24} color="#10B981" />
            <Text style={styles.actionText}>Ministrar aulas</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/Ver_aulas' as any)}>
            <MaterialIcons name="calendar-today" size={24} color="#10B981" />
            <Text style={styles.actionText}>Ver aulas</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/conversas' as any)}>
          <MaterialIcons name="message" size={24} color="#F59E0B" />
          <Text style={styles.actionText}>Mensagens</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="star" size={24} color="#EC4899" />
          <Text style={styles.actionText}>Pontos</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📰 Notícias e Eventos</Text>
          <TouchableOpacity onPress={() => router.push('/news' as any)}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {news.length > 0 ? (
          <FlatList
            data={news}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
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
          />
        ) : (
          <Text style={styles.emptyText}>Nenhuma notícia no momento</Text>
        )}
      </View>

      {/* Subjects Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Disciplinas Populares</Text>
          <TouchableOpacity onPress={() => router.push('/explore' as any)}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {subjects.length > 0 ? (
          <View style={styles.subjectsGrid}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={styles.subjectCard}
                
              >
                <Text style={styles.subjectIcon}>{subject.icon || '📖'}</Text>
                <Text style={styles.subjectName}>{subject.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhuma disciplina disponível</Text>
        )}
      </View>

      {/* Call to Action */}
      {state.user?.role === 'learner' && (
        <Card style={styles.ctaCard}>
          <MaterialIcons name="volunteer-activism" size={40} color="#0A66C2" />
          <Text style={styles.ctaTitle}>Quero ser voluntário!</Text>
          <Text style={styles.ctaDescription}>
            Ajude a transformar vidas através da educação
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/signup' as any)}>
            <Text style={styles.ctaButtonText}>Começar agora</Text>
          </TouchableOpacity>
        </Card>
      )}
    </ScrollView>
  );
}

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
    paddingVertical: 20,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subgreeting: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  actionText: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 13,
    color: '#0A66C2',
    fontWeight: '500',
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
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  subjectIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  ctaCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginTop: 12,
  },
  ctaDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0A66C2',
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
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