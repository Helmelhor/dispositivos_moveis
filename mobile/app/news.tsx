// app/news.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { News } from '@/types';

export default function NewsScreen() {
  const { state } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para criação de notícia
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

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

  // Criar notícia (POST)
  const handleCreateNews = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('Erro', 'Preencha título e conteúdo.');
      return;
    }
    setCreating(true);
    try {
      await apiService.createNews({
        title: newTitle,
        content: newContent,
        news_type: 'news',
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      await loadNews();
      Alert.alert('Sucesso', 'Notícia criada com sucesso!');
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro ao criar notícia');
    } finally {
      setCreating(false);
    }
  };

  // Deletar notícia (DELETE)
  const handleDeleteNews = (id: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta notícia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteNews(id);
              await loadNews();
              Alert.alert('Sucesso', 'Notícia deletada!');
            } catch (e: any) {
              Alert.alert('Erro', e.message || 'Erro ao deletar notícia');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>📰 Todas as Notícias</Text>
        {state.user?.role === 'volunteer' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <MaterialIcons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.newsCard}>
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
            {state.user?.role === 'volunteer' && (
              <TouchableOpacity
                onPress={() => handleDeleteNews(item.id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete" size={22} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notícia encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Modal de criação de notícia */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Notícia</Text>
            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Digite o título"
              editable={!creating}
            />
            <Text style={styles.inputLabel}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newContent}
              onChangeText={setNewContent}
              placeholder="Digite o conteúdo"
              editable={!creating}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, (!newTitle || !newContent || creating) && { opacity: 0.5 }]}
                onPress={handleCreateNews}
                disabled={creating || !newTitle || !newContent}
              >
                <Text style={styles.createButtonText}>{creating ? 'Criando...' : 'Criar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
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
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
