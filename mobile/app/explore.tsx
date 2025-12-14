// app/explore.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Loading } from '@/components/ui';
import apiService from '@/services/api';
import { PublishedLesson, Subject } from '@/types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [lessons, setLessons] = useState<PublishedLesson[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [filteredLessons, setFilteredLessons] = useState<PublishedLesson[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [lessonsData, subjectsData] = await Promise.all([
        apiService.getPublishedLessons(undefined, undefined, 0, 100),
        apiService.getSubjects(),
      ]);
      setLessons(lessonsData);
      setSubjects(subjectsData);
      setFilteredLessons(lessonsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filtrar aulas por busca e categoria
  const filterLessons = useCallback(() => {
    let filtered = lessons;

    // Filtrar por categoria
    if (selectedSubjectId) {
      filtered = filtered.filter(l => l.subject_id === selectedSubjectId);
    }

    // Filtrar por busca
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(search) ||
        l.description?.toLowerCase().includes(search)
      );
    }

    setFilteredLessons(filtered);
  }, [lessons, selectedSubjectId, searchText]);

  useEffect(() => {
    filterLessons();
  }, [filterLessons]);

  const getSubjectName = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Sem categoria';
  };

  const getSubjectIcon = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.icon || '📚';
  };

  // Aulas mais visualizadas (destacadas)
  const topLessons = [...lessons]
    .sort((a, b) => b.views_count - a.views_count)
    .slice(0, 3);

  if (loading) {
    return <Loading fullScreen />;
  }

  const renderLessonCard = ({ item }: { item: PublishedLesson }) => (
    <TouchableOpacity style={styles.lessonCard}>
      <View style={styles.lessonImagePlaceholder}>
        <Text style={styles.lessonIcon}>{getSubjectIcon(item.subject_id)}</Text>
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonCategory}>{getSubjectName(item.subject_id)}</Text>
        <Text style={styles.lessonTitle} numberOfLines={2}>{item.title}</Text>
        {item.description && (
          <Text style={styles.lessonDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
        <View style={styles.lessonStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="visibility" size={14} color="#666" />
            <Text style={styles.statText}>{item.views_count}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="favorite" size={14} color="#EF4444" />
            <Text style={styles.statText}>{item.likes_count}</Text>
          </View>
          <Text style={styles.lessonDate}>
            {new Date(item.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTopLessonCard = ({ item }: { item: PublishedLesson }) => (
    <TouchableOpacity style={styles.topLessonCard}>
      <View style={styles.topLessonImagePlaceholder}>
        <Text style={styles.topLessonIcon}>{getSubjectIcon(item.subject_id)}</Text>
        <View style={styles.topLessonBadge}>
          <MaterialIcons name="star" size={16} color="#FCD34D" />
        </View>
      </View>
      <Text style={styles.topLessonTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.topLessonCategory}>{getSubjectName(item.subject_id)}</Text>
    </TouchableOpacity>
  );

  const renderSubjectChip = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={[
        styles.subjectChip,
        selectedSubjectId === item.id && styles.subjectChipSelected
      ]}
      onPress={() => setSelectedSubjectId(selectedSubjectId === item.id ? null : item.id)}
    >
      <Text style={styles.subjectChipIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.subjectChipText,
          selectedSubjectId === item.id && styles.subjectChipTextSelected
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      {/* Conteúdo com ScrollView */}
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLessonCard}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <>
            {/* Busca */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar aulas..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#999"
              />
              {searchText && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Aulas Destaque */}
            {topLessons.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="trending-up" size={20} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Em Destaque</Text>
                </View>
                <FlatList
                  data={topLessons}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderTopLessonCard}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.topLessonsContainer}
                  scrollEnabled
                />
              </View>
            )}

            {/* Explorar por Disciplina */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="category" size={20} color="#0A66C2" />
                <Text style={styles.sectionTitle}>Disciplinas</Text>
              </View>
              <FlatList
                data={subjects}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSubjectChip}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subjectsContainer}
                scrollEnabled
              />
            </View>

            {/* Resultados */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {filteredLessons.length} aula{filteredLessons.length !== 1 ? 's' : ''}
              </Text>
              {(searchText || selectedSubjectId) && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setSelectedSubjectId(null);
                  }}
                >
                  <Text style={styles.clearFilters}>Limpar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Nenhuma aula encontrada</Text>
            <Text style={styles.emptySubtext}>
              Tente ajustar seus filtros ou buscar por outro termo
            </Text>
          </View>
        )}
        contentContainerStyle={styles.lessonsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  topLessonsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  topLessonCard: {
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  topLessonImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topLessonIcon: {
    fontSize: 48,
  },
  topLessonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FCD34D',
    borderRadius: 16,
    padding: 4,
  },
  topLessonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    padding: 10,
    paddingBottom: 4,
  },
  topLessonCategory: {
    fontSize: 11,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  subjectsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  subjectChipSelected: {
    backgroundColor: '#0A66C2',
    borderColor: '#0A66C2',
  },
  subjectChipIcon: {
    fontSize: 16,
  },
  subjectChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  subjectChipTextSelected: {
    color: '#FFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  clearFilters: {
    fontSize: 13,
    color: '#0A66C2',
    fontWeight: '600',
  },
  lessonsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  lessonImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIcon: {
    fontSize: 40,
  },
  lessonContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  lessonCategory: {
    fontSize: 11,
    color: '#0A66C2',
    fontWeight: '600',
    backgroundColor: '#E6F4FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  lessonDate: {
    fontSize: 11,
    color: '#999',
    marginLeft: 'auto',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});
