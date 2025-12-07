// screens/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Card, Loading } from '@/components/ui';
import apiService from '@/services/api';
import { Subject } from '@/types';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'volunteers' | 'learners' | 'subjects'>('volunteers');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSubjects();
      setSubjects(data);
      setResults(data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setResults(subjects);
    } else {
      const filtered = subjects.filter((subject) =>
        subject.name.toLowerCase().includes(query.toLowerCase()) ||
        subject.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleFilterChange = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter);
    // TODO: Implementar diferentes resultados para cada filtro
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          placeholder="Buscar disciplinas, voluntários..."
          value={searchQuery}
          onChangeText={handleSearch}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['volunteers', 'learners', 'subjects'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter === 'volunteers' && 'Voluntários'}
              {filter === 'learners' && 'Aprendizes'}
              {filter === 'subjects' && 'Disciplinas'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() =>
              navigation?.navigate('SubjectDetail', { subjectId: item.id })
            }
          >
            <View style={styles.resultIcon}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text style={styles.resultCategory}>{item.category}</Text>
              <Text style={styles.resultDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#DDD" />
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Nenhum resultado encontrado'
                : 'Use a barra de busca para encontrar disciplinas e voluntários'}
            </Text>
          </View>
        }
      />

      {/* TODO: Adicionar */}
      {/* - Busca avançada com filtros (categoria, disponibilidade, localização) */}
      {/* - Listagem de voluntários com avaliações */}
      {/* - Listagem de aprendizes procurando aulas */}
      {/* - Histórico de buscas recentes */}
      {/* - Salvando buscas favoritas */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  searchHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInput: {
    marginBottom: 0,
  },
  filterContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    marginVertical: 4,
  },
  filterButtonActive: {
    backgroundColor: '#0A66C2',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  resultIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultCategory: {
    fontSize: 11,
    color: '#0A66C2',
    marginTop: 2,
    fontWeight: '500',
  },
  resultDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});
