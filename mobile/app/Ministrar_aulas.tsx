import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { Subject, PublishedLesson } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MinistrarAulasScreen() {
  const authContext = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [mediaFileName, setMediaFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [publishedLessons, setPublishedLessons] = useState<PublishedLesson[]>([]);
  const [activeTab, setActiveTab] = useState<'publish' | 'list'>('publish');

  // Verificar se o usuário é voluntário
  useEffect(() => {
    if (!authContext?.state.user || authContext.state.user.role !== 'volunteer') {
      Alert.alert('Acesso Negado', 'Apenas voluntários podem publicar aulas.');
    }
  }, [authContext?.state.user]);

  // Carregar disciplinas
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await apiService.getSubjects();
        setSubjects(data);
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Falha ao carregar disciplinas');
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // Carregar aulas publicadas pelo voluntário
  useEffect(() => {
    if (activeTab === 'list' && authContext?.state.user) {
      loadPublishedLessons();
    }
  }, [activeTab, authContext?.state.user]);

  const loadPublishedLessons = async () => {
    try {
      const volunteerId = authContext?.state.user?.id;
      if (volunteerId) {
        const data = await apiService.getPublishedLessons(volunteerId);
        setPublishedLessons(data);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao carregar aulas publicadas');
    }
  };

  const pickMedia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/*', 'image/*', 'application/pdf'],
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedMedia(file);
        setMediaFileName(file.name);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar arquivo');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const image = result.assets[0];
        const file = {
          uri: image.uri,
          name: `image_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
        setSelectedMedia(file);
        setMediaFileName(file.name);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar imagem');
    }
  };

  const handlePublishLesson = async () => {
    // Validações
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a aula');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma descrição para a aula');
      return;
    }

    if (!selectedSubject) {
      Alert.alert('Erro', 'Por favor, selecione uma disciplina');
      return;
    }

    try {
      setIsLoading(true);

      const volunteerId = authContext?.state.user?.id;
      if (!volunteerId) {
        Alert.alert('Erro', 'Informações do usuário não encontradas');
        return;
      }

      // Preparar arquivo de mídia se fornecido
      let mediaFile = null;
      if (selectedMedia) {
        mediaFile = {
          uri: selectedMedia.uri,
          type: selectedMedia.type || 'application/octet-stream',
          name: selectedMedia.name || 'media_file',
        };
      }

      // Publicar aula
      const response = await apiService.publishLesson(
        volunteerId,
        selectedSubject,
        title,
        description,
        mediaFile
      );

      Alert.alert('Sucesso', 'Aula publicada com sucesso!');

      // Limpar form
      setTitle('');
      setDescription('');
      setSelectedSubject(null);
      setSelectedMedia(null);
      setMediaFileName('');

      // Atualizar lista de aulas
      await loadPublishedLessons();
    } catch (error: any) {
      const errorMessage = typeof error?.message === 'string' 
        ? error.message 
        : JSON.stringify(error?.message) || 'Falha ao publicar aula';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja deletar esta aula?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              const volunteerId = authContext?.state.user?.id;
              if (volunteerId) {
                await apiService.deletePublishedLesson(lessonId, volunteerId);
                Alert.alert('Sucesso', 'Aula deletada com sucesso');
                await loadPublishedLessons();
              }
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Falha ao deletar aula');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getSubjectName = (subjectId: number) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Disciplina desconhecida';
  };

  return (
    <ThemedView style={styles.container}>
      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'publish' && styles.activeTab]}
          onPress={() => setActiveTab('publish')}
        >
          <ThemedText style={styles.tabText}>Publicar Aula</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <ThemedText style={styles.tabText}>Minhas Aulas</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'publish' ? (
          <View style={styles.formContainer}>
            <ThemedText style={styles.sectionTitle}>Publicar Nova Aula</ThemedText>

            {/* Título */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Título da Aula *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Ex: Introdução à Física Quântica"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <ThemedText style={styles.charCount}>{title.length}/100</ThemedText>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Descrição da Aula *</ThemedText>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Descreva os conteúdos que serão abordados nesta aula..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                maxLength={1000}
              />
              <ThemedText style={styles.charCount}>{description.length}/1000</ThemedText>
            </View>

            {/* Disciplina */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Disciplina *</ThemedText>
              {isLoadingSubjects ? (
                <ActivityIndicator size="large" />
              ) : (
                <ScrollView horizontal style={styles.subjectScroll}>
                  {subjects.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectButton,
                        selectedSubject === subject.id && styles.subjectButtonActive,
                      ]}
                      onPress={() => setSelectedSubject(subject.id)}
                    >
                      <ThemedText
                        style={[
                          styles.subjectButtonText,
                          selectedSubject === subject.id && styles.subjectButtonTextActive,
                        ]}
                      >
                        {subject.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Mídia */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Adicionar Mídia (Opcional)</ThemedText>
              <ThemedText style={styles.mediaInfo}>
                Você pode adicionar um vídeo, imagem ou PDF para complementar sua aula
              </ThemedText>

              {selectedMedia && (
                <Card style={styles.mediaSelected}>
                  <ThemedText style={styles.mediaLabel}>Arquivo Selecionado:</ThemedText>
                  <ThemedText style={styles.mediaName}>{mediaFileName}</ThemedText>
                  <TouchableOpacity onPress={() => setSelectedMedia(null)}>
                    <ThemedText style={styles.removeMedia}>Remover</ThemedText>
                  </TouchableOpacity>
                </Card>
              )}

              <View style={styles.mediaButtonsContainer}>
                <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                  <ThemedText style={styles.mediaButtonText}>📷 Imagem</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
                  <ThemedText style={styles.mediaButtonText}>📎 Arquivo</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Publicar */}
            <Button
              title={isLoading ? 'Publicando...' : 'Publicar Aula'}
              onPress={handlePublishLesson}
              disabled={isLoading}
              style={styles.publishButton}
            />
          </View>
        ) : (
          <View style={styles.listContainer}>
            <ThemedText style={styles.sectionTitle}>Minhas Aulas Publicadas</ThemedText>

            {publishedLessons.length === 0 ? (
              <Card style={styles.emptyCard}>
                <ThemedText style={styles.emptyText}>
                  Você ainda não publicou nenhuma aula.
                </ThemedText>
              </Card>
            ) : (
              publishedLessons.map(lesson => (
                <Card key={lesson.id} style={styles.lessonCard}>
                  <View style={styles.lessonHeader}>
                    <ThemedText style={styles.lessonTitle}>{lesson.title}</ThemedText>
                    <TouchableOpacity
                      onPress={() => handleDeleteLesson(lesson.id)}
                      style={styles.deleteButton}
                    >
                      <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
                    </TouchableOpacity>
                  </View>

                  <ThemedText style={styles.lessonSubject}>
                    📚 {getSubjectName(lesson.subject_id)}
                  </ThemedText>

                  <ThemedText style={styles.lessonDescription} numberOfLines={3}>
                    {lesson.description}
                  </ThemedText>

                  <View style={styles.lessonStats}>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>👁️ {lesson.views_count}</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>❤️ {lesson.likes_count}</ThemedText>
                    </View>
                    {lesson.media_type && (
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>
                          {lesson.media_type === 'video' && '🎥'}
                          {lesson.media_type === 'image' && '🖼️'}
                          {lesson.media_type === 'pdf' && '📄'}
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <ThemedText style={styles.lessonDate}>
                    {new Date(lesson.created_at).toLocaleDateString('pt-BR')}
                  </ThemedText>
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    gap: 20,
  },
  listContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  subjectScroll: {
    flexDirection: 'row',
    gap: 10,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  subjectButtonActive: {
    backgroundColor: '#007AFF',
  },
  subjectButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  subjectButtonTextActive: {
    color: '#fff',
  },
  mediaInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  mediaSelected: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
  },
  mediaLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  mediaName: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 4,
  },
  removeMedia: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  mediaButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  mediaButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  publishButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
  },
  lessonCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  lessonSubject: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  lessonStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  lessonDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
