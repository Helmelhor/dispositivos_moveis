// screens/NewsScreen.tsx
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
import { Card, Loading } from '@/components/ui';
import apiService from '@/services/api';
import { News } from '@/types';

interface NewsScreenProps {
  navigation: any;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'event' | 'campaign' | 'news'>('all');

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNews({
        ...(filter !== 'all' && { news_type: filter }),
        limit: 50,
      });
      setNews(data);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'event':
        return '📅';
      case 'campaign':
        return '🎁';
      case 'news':
        return '📰';
      case 'announcement':
        return '📢';
      default:
        return '📌';
    }
  };

  const getNewsTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Evento';
      case 'campaign':
        return 'Campanha';
      case 'news':
        return 'Notícia';
      case 'announcement':
        return 'Anúncio';
      default:
        return 'Conteúdo';
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Tudo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'event' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('event')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'event' && styles.filterChipTextActive,
            ]}
          >
            Eventos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'campaign' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('campaign')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'campaign' && styles.filterChipTextActive,
            ]}
          >
            Campanhas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'news' && styles.filterChipActive,
          ]}
          onPress={() => setFilter('news')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'news' && styles.filterChipTextActive,
            ]}
          >
            Notícias
          </Text>
        </TouchableOpacity>
      </View>

      {/* News List */}
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsCard}
            onPress={() => navigation?.navigate('NewsDetail', { newsId: item.id })}
          >
            <View style={styles.newsHeader}>
              <View style={styles.typeAndTitle}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeEmoji}>{getNewsIcon(item.news_type)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.newsType}>
                    {getNewsTypeLabel(item.news_type)}
                  </Text>
                  <Text style={styles.newsTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </View>
              {item.is_featured && (
                <View style={styles.featuredBadge}>
                  <MaterialIcons name="star" size={14} color="#F59E0B" />
                </View>
              )}
            </View>

            <Text style={styles.newsContent} numberOfLines={3}>
              {item.content}
            </Text>

            {/* Event Info */}
            {item.event_date && (
              <View style={styles.eventInfo}>
                <MaterialIcons name="event" size={14} color="#0A66C2" />
                <Text style={styles.eventInfoText}>
                  {new Date(item.event_date).toLocaleDateString('pt-BR')}
                </Text>
                {item.event_location && (
                  <>
                    <Text style={styles.eventInfoDot}>•</Text>
                    <Text style={styles.eventInfoText} numberOfLines={1}>
                      {item.event_location}
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* Campaign Info */}
            {item.campaign_goal && (
              <View style={styles.campaignInfo}>
                <MaterialIcons name="flag" size={14} color="#DC2626" />
                <Text style={styles.campaignText} numberOfLines={1}>
                  {item.campaign_goal}
                </Text>
              </View>
            )}

            <View style={styles.newsFooter}>
              <Text style={styles.newsDate}>
                {new Date(item.published_at).toLocaleDateString('pt-BR')}
              </Text>
              <View style={styles.viewsContainer}>
                <MaterialIcons name="visibility" size={14} color="#999" />
                <Text style={styles.viewsText}>{item.views_count || 0}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="newspaper" size={48} color="#DDD" />
            <Text style={styles.emptyText}>
              Nenhuma notícia disponível neste momento
            </Text>
          </View>
        }
      />

      {/* TODO: Adicionar */}
      {/* - Notificações de eventos próximos */}
      {/* - Inscrição em eventos */}
      {/* - Compartilhamento de notícias */}
      {/* - Favoritos de notícias */}
      {/* - Comentários em notícias */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  filterSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  filterChipActive: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  newsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeAndTitle: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  typeBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 20,
  },
  newsType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0A66C2',
    textTransform: 'uppercase',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
    lineHeight: 20,
  },
  featuredBadge: {
    backgroundColor: '#FEF3C7',
    padding: 4,
    borderRadius: 4,
  },
  newsContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#E6F4FE',
    borderRadius: 8,
    marginBottom: 8,
  },
  eventInfoText: {
    fontSize: 12,
    color: '#0A66C2',
    fontWeight: '500',
    flex: 1,
  },
  eventInfoDot: {
    color: '#0A66C2',
  },
  campaignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 12,
  },
  campaignText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  newsDate: {
    fontSize: 12,
    color: '#999',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});
