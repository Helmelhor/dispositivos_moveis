import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { Subject, PublishedLesson } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function VerAulasScreen() {
  const authContext = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [lessons, setLessons] = useState<PublishedLesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<PublishedLesson[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  // Filtrar aulas quando mudar busca ou disciplina
  useEffect(() => {
    filterLessons();
  }, [searchQuery, selectedSubject, lessons]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [lessonsData, subjectsData] = await Promise.all([
        apiService.getPublishedLessons(),
        apiService.getSubjects(),
      ]);
      setLessons(lessonsData);
      setFilteredLessons(lessonsData);
      setSubjects(subjectsData);
    } catch (error: any) {
      const errorMessage = typeof error?.message === 'string' 
        ? error.message 
        : 'Falha ao carregar aulas';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  }, []);

  const filterLessons = () => {
    let filtered = [...lessons];

    // Filtrar por disciplina
    if (selectedSubject) {
      filtered = filtered.filter(lesson => lesson.subject_id === selectedSubject);
    }

    // Filtrar por busca (título ou descrição)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lesson =>
          lesson.title.toLowerCase().includes(query) ||
          (lesson.description && lesson.description.toLowerCase().includes(query))
      );
    }

    setFilteredLessons(filtered);
  };

  const handleLikeLesson = async (lessonId: number) => {
    try {
      await apiService.likePublishedLesson(lessonId);
      // Atualizar o contador de likes localmente
      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === lessonId
            ? { ...lesson, likes_count: lesson.likes_count + 1 }
            : lesson
        )
      );
    } catch (error: any) {
      const errorMessage = typeof error?.message === 'string' 
        ? error.message 
        : 'Falha ao curtir aula';
      Alert.alert('Erro', errorMessage);
    }
  };

  const getSubjectName = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Disciplina';
  };

  const getSubjectIcon = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.icon || '📚';
  };

  const clearFilters = () => {
    setSelectedSubject(null);
    setSearchQuery('');
  };

  const getMediaIcon = (mediaType: string | undefined) => {
    switch (mediaType) {
      case 'video':
        return '🎥';
      case 'image':
        return '🖼️';
      case 'pdf':
        return '📄';
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Carregando aulas...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header com título */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>📚 Aulas Disponíveis</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Explore conteúdos publicados pelos voluntários
        </ThemedText>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark && styles.searchBarDark]}>
          <MaterialIcons name="search" size={22} color="#999" />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Buscar por título ou descrição..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros por Disciplina */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <ThemedText style={styles.filterTitle}>Filtrar por disciplina:</ThemedText>
          {(selectedSubject || searchQuery) && (
            <TouchableOpacity onPress={clearFilters}>
              <ThemedText style={styles.clearFilters}>Limpar filtros</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedSubject && styles.filterChipActive,
            ]}
            onPress={() => setSelectedSubject(null)}
          >
            <ThemedText
              style={[
                styles.filterChipText,
                !selectedSubject && styles.filterChipTextActive,
              ]}
            >
              Todas
            </ThemedText>
          </TouchableOpacity>
          {subjects.map(subject => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.filterChip,
                selectedSubject === subject.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSubject(subject.id)}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedSubject === subject.id && styles.filterChipTextActive,
                ]}
              >
                {subject.icon || '📖'} {subject.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contador de resultados */}
      <View style={styles.resultsCount}>
        <ThemedText style={styles.resultsText}>
          {filteredLessons.length} {filteredLessons.length === 1 ? 'aula encontrada' : 'aulas encontradas'}
        </ThemedText>
      </View>

      {/* Lista de Aulas */}
      <ScrollView
        style={styles.lessonsList}
        contentContainerStyle={styles.lessonsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {filteredLessons.length === 0 ? (
          <Card style={styles.emptyCard}>
            <MaterialIcons name="search-off" size={48} color="#ccc" />
            <ThemedText style={styles.emptyTitle}>Nenhuma aula encontrada</ThemedText>
            <ThemedText style={styles.emptyText}>
              {searchQuery || selectedSubject
                ? 'Tente ajustar os filtros ou busca'
                : 'Aguarde os voluntários publicarem novas aulas'}
            </ThemedText>
          </Card>
        ) : (
          filteredLessons.map(lesson => (
            <Card key={lesson.id} style={styles.lessonCard}>
              {/* Header do Card */}
              <View style={styles.cardHeader}>
                <View style={styles.subjectBadge}>
                  <ThemedText style={styles.subjectIcon}>
                    {getSubjectIcon(lesson.subject_id)}
                  </ThemedText>
                  <ThemedText style={styles.subjectName}>
                    {getSubjectName(lesson.subject_id)}
                  </ThemedText>
                </View>
                {lesson.media_type && (
                  <View style={styles.mediaBadge}>
                    <ThemedText style={styles.mediaIcon}>
                      {getMediaIcon(lesson.media_type)}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Título */}
              <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>

              {/* Descrição */}
              {lesson.description && (
                <ThemedText style={styles.lessonDescription} numberOfLines={4}>
                  {lesson.description}
                </ThemedText>
              )}

              {/* Footer do Card */}
              <View style={styles.cardFooter}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="visibility" size={16} color="#666" />
                    <ThemedText style={styles.statText}>{lesson.views_count}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.statItem}
                    onPress={() => handleLikeLesson(lesson.id)}
                  >
                    <MaterialIcons name="favorite" size={16} color="#FF6B6B" />
                    <ThemedText style={styles.statText}>{lesson.likes_count}</ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText style={styles.dateText}>
                  {new Date(lesson.created_at).toLocaleDateString('pt-BR')}
                </ThemedText>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchBarDark: {
    backgroundColor: '#2c2c2e',
    borderColor: '#3a3a3c',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  searchInputDark: {
    color: '#fff',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  clearFilters: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    color: '#999',
  },
  lessonsList: {
    flex: 1,
  },
  lessonsContent: {
    padding: 16,
    paddingTop: 4,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  lessonCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  subjectName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  mediaBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mediaIcon: {
    fontSize: 16,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
});
