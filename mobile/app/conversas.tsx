// app/conversas.tsx
// Tela de Fórum - EducaConecta

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Loading, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { ForumTopic, ForumReply, Subject } from '@/types';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type ViewMode = 'topics' | 'topic-detail';

export default function ConversasScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('topics');
  
  // Modais
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showEditReplyModal, setShowEditReplyModal] = useState(false);
  
  // Formulário de tópico
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicSubjectId, setTopicSubjectId] = useState<number>(1);
  
  // Formulário de resposta
  const [replyContent, setReplyContent] = useState('');
  const [editingReply, setEditingReply] = useState<ForumReply | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTopics = useCallback(async () => {
    try {
      const [topicsData, subjectsData] = await Promise.all([
        apiService.getForumTopics({ limit: 50 }),
        apiService.getSubjects(),
      ]);
      setTopics(topicsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Erro ao carregar tópicos:', error);
    }
  }, []);

  const loadReplies = useCallback(async (topicId: number) => {
    try {
      const repliesData = await apiService.getForumReplies(topicId);
      setReplies(repliesData);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadTopics();
      setLoading(false);
    };
    init();
  }, [loadTopics]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (viewMode === 'topics') {
      await loadTopics();
    } else if (selectedTopic) {
      await loadReplies(selectedTopic.id);
    }
    setRefreshing(false);
  };

  const openTopic = async (topic: ForumTopic) => {
    setSelectedTopic(topic);
    setViewMode('topic-detail');
    setLoading(true);
    await loadReplies(topic.id);
    setLoading(false);
  };

  const closeTopic = () => {
    setSelectedTopic(null);
    setReplies([]);
    setViewMode('topics');
    loadTopics(); // Recarregar para atualizar contadores
  };

  const handleCreateTopic = async () => {
    if (!state.user?.id) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um tópico.');
      return;
    }
    if (!topicTitle.trim() || !topicContent.trim()) {
      Alert.alert('Erro', 'Preencha o título e o conteúdo do tópico.');
      return;
    }

    setSubmitting(true);
    try {
      const newTopic = await apiService.createForumTopic({
        subject_id: topicSubjectId,
        user_id: state.user.id,
        title: topicTitle.trim(),
        content: topicContent.trim(),
      });
      setTopics([newTopic, ...topics]);
      setShowCreateTopicModal(false);
      setTopicTitle('');
      setTopicContent('');
      Alert.alert('Sucesso', 'Tópico criado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar tópico.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTopic = async () => {
    if (!selectedTopic || !state.user?.id) return;
    if (!topicTitle.trim() || !topicContent.trim()) {
      Alert.alert('Erro', 'Preencha o título e o conteúdo do tópico.');
      return;
    }

    setSubmitting(true);
    try {
      const updatedTopic = await apiService.updateForumTopic(
        selectedTopic.id,
        state.user.id,
        { title: topicTitle.trim(), content: topicContent.trim() }
      );
      setSelectedTopic(updatedTopic);
      setTopics(topics.map(t => t.id === updatedTopic.id ? updatedTopic : t));
      setShowEditTopicModal(false);
      Alert.alert('Sucesso', 'Tópico atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar tópico.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTopic = () => {
    if (!selectedTopic || !state.user?.id) return;

    Alert.alert(
      'Excluir Tópico',
      'Tem certeza que deseja excluir este tópico? Todas as respostas também serão excluídas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteForumTopic(selectedTopic.id, state.user!.id);
              setTopics(topics.filter(t => t.id !== selectedTopic.id));
              closeTopic();
              Alert.alert('Sucesso', 'Tópico excluído com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir tópico.');
            }
          },
        },
      ]
    );
  };

  const handleCreateReply = async () => {
    if (!selectedTopic || !state.user?.id) return;
    if (!replyContent.trim()) {
      Alert.alert('Erro', 'Digite o conteúdo da resposta.');
      return;
    }

    setSubmitting(true);
    try {
      const newReply = await apiService.createForumReply({
        topic_id: selectedTopic.id,
        user_id: state.user.id,
        content: replyContent.trim(),
      });
      setReplies([...replies, newReply]);
      setReplyContent('');
      // Atualizar contador de respostas
      setSelectedTopic({
        ...selectedTopic,
        replies_count: selectedTopic.replies_count + 1
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReply = async () => {
    if (!editingReply || !state.user?.id) return;
    if (!replyContent.trim()) {
      Alert.alert('Erro', 'Digite o conteúdo da resposta.');
      return;
    }

    setSubmitting(true);
    try {
      const updatedReply = await apiService.updateForumReply(
        editingReply.id,
        state.user.id,
        { content: replyContent.trim() }
      );
      setReplies(replies.map(r => r.id === updatedReply.id ? updatedReply : r));
      setShowEditReplyModal(false);
      setEditingReply(null);
      setReplyContent('');
      Alert.alert('Sucesso', 'Resposta atualizada!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar resposta.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = (reply: ForumReply) => {
    if (!state.user?.id) return;

    Alert.alert(
      'Excluir Resposta',
      'Tem certeza que deseja excluir esta resposta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteForumReply(reply.id, state.user!.id);
              setReplies(replies.filter(r => r.id !== reply.id));
              if (selectedTopic) {
                setSelectedTopic({
                  ...selectedTopic,
                  replies_count: Math.max(0, selectedTopic.replies_count - 1)
                });
              }
              Alert.alert('Sucesso', 'Resposta excluída!');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir resposta.');
            }
          },
        },
      ]
    );
  };

  const handleLikeReply = async (reply: ForumReply) => {
    try {
      const updatedReply = await apiService.likeForumReply(reply.id);
      setReplies(replies.map(r => r.id === updatedReply.id ? updatedReply : r));
    } catch (error: any) {
      console.error('Erro ao curtir:', error);
    }
  };

  const openEditTopicModal = () => {
    if (selectedTopic) {
      setTopicTitle(selectedTopic.title);
      setTopicContent(selectedTopic.content);
      setShowEditTopicModal(true);
    }
  };

  const openEditReplyModal = (reply: ForumReply) => {
    setEditingReply(reply);
    setReplyContent(reply.content);
    setShowEditReplyModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Geral';
  };

  // ==================== RENDERIZAÇÃO ====================

  const renderTopicItem = ({ item }: { item: ForumTopic }) => (
    <TouchableOpacity style={styles.topicCard} onPress={() => openTopic(item)}>
      <View style={styles.topicHeader}>
        <View style={styles.topicMeta}>
          <Text style={styles.topicSubject}>{getSubjectName(item.subject_id)}</Text>
          {item.is_resolved && (
            <View style={styles.resolvedBadge}>
              <MaterialIcons name="check-circle" size={14} color="#10B981" />
              <Text style={styles.resolvedText}>Resolvido</Text>
            </View>
          )}
        </View>
        <Text style={styles.topicDate}>{formatDate(item.created_at)}</Text>
      </View>
      
      <Text style={styles.topicTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.topicPreview} numberOfLines={2}>{item.content}</Text>
      
      <View style={styles.topicFooter}>
        <Text style={styles.topicAuthor}>Por {item.author_name}</Text>
        <View style={styles.topicStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="visibility" size={14} color="#999" />
            <Text style={styles.statText}>{item.views_count}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="chat-bubble-outline" size={14} color="#999" />
            <Text style={styles.statText}>{item.replies_count}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReplyItem = ({ item }: { item: ForumReply }) => {
    const isAuthor = state.user?.id === item.user_id;
    const isTopicAuthor = state.user?.id === selectedTopic?.user_id;

    return (
      <View style={[styles.replyCard, item.is_accepted && styles.acceptedReply]}>
        {item.is_accepted && (
          <View style={styles.acceptedBadge}>
            <MaterialIcons name="check-circle" size={14} color="#10B981" />
            <Text style={styles.acceptedText}>Resposta aceita</Text>
          </View>
        )}
        
        <View style={styles.replyHeader}>
          <Text style={styles.replyAuthor}>{item.author_name}</Text>
          <Text style={styles.replyDate}>{formatDate(item.created_at)}</Text>
        </View>
        
        <Text style={styles.replyContent}>{item.content}</Text>
        
        <View style={styles.replyFooter}>
          <TouchableOpacity style={styles.replyAction} onPress={() => handleLikeReply(item)}>
            <MaterialIcons name="thumb-up" size={16} color="#666" />
            <Text style={styles.replyActionText}>{item.likes_count}</Text>
          </TouchableOpacity>
          
          {isAuthor && (
            <>
              <TouchableOpacity style={styles.replyAction} onPress={() => openEditReplyModal(item)}>
                <MaterialIcons name="edit" size={16} color="#0A66C2" />
                <Text style={[styles.replyActionText, { color: '#0A66C2' }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.replyAction} onPress={() => handleDeleteReply(item)}>
                <MaterialIcons name="delete" size={16} color="#EF4444" />
                <Text style={[styles.replyActionText, { color: '#EF4444' }]}>Excluir</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  // Modal de criar tópico
  const CreateTopicModal = () => (
    <Modal visible={showCreateTopicModal} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Novo Tópico</Text>
            <TouchableOpacity onPress={() => setShowCreateTopicModal(false)}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectPicker}>
              {subjects.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectOption,
                    topicSubjectId === subject.id && styles.subjectOptionSelected
                  ]}
                  onPress={() => setTopicSubjectId(subject.id)}
                >
                  <Text style={[
                    styles.subjectOptionText,
                    topicSubjectId === subject.id && styles.subjectOptionTextSelected
                  ]}>
                    {subject.icon} {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o título do tópico"
              value={topicTitle}
              onChangeText={setTopicTitle}
              maxLength={200}
            />

            <Text style={styles.inputLabel}>Conteúdo</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Descreva sua dúvida ou assunto"
              value={topicContent}
              onChangeText={setTopicContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowCreateTopicModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleCreateTopic}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Criando...' : 'Criar Tópico'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // Modal de editar tópico
  const EditTopicModal = () => (
    <Modal visible={showEditTopicModal} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Tópico</Text>
            <TouchableOpacity onPress={() => setShowEditTopicModal(false)}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Título</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o título do tópico"
              value={topicTitle}
              onChangeText={setTopicTitle}
              maxLength={200}
            />

            <Text style={styles.inputLabel}>Conteúdo</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Descreva sua dúvida ou assunto"
              value={topicContent}
              onChangeText={setTopicContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowEditTopicModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleEditTopic}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // Modal de editar resposta
  const EditReplyModal = () => (
    <Modal visible={showEditReplyModal} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Resposta</Text>
            <TouchableOpacity onPress={() => {
              setShowEditReplyModal(false);
              setEditingReply(null);
              setReplyContent('');
            }}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Conteúdo</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Digite sua resposta"
              value={replyContent}
              onChangeText={setReplyContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => {
                setShowEditReplyModal(false);
                setEditingReply(null);
                setReplyContent('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleEditReply}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  if (loading && viewMode === 'topics') {
    return <Loading fullScreen />;
  }

  // Vista de detalhes do tópico
  if (viewMode === 'topic-detail' && selectedTopic) {
    const isTopicAuthor = state.user?.id === selectedTopic.user_id;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header do tópico */}
        <View style={styles.topicDetailHeader}>
          <TouchableOpacity onPress={closeTopic} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#0A66C2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Tópico</Text>
          {isTopicAuthor && (
            <View style={styles.topicActions}>
              <TouchableOpacity onPress={openEditTopicModal} style={styles.headerAction}>
                <MaterialIcons name="edit" size={20} color="#0A66C2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteTopic} style={styles.headerAction}>
                <MaterialIcons name="delete" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={replies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderReplyItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => (
              <View style={styles.topicDetailCard}>
                <View style={styles.topicDetailMeta}>
                  <Text style={styles.topicDetailSubject}>
                    {getSubjectName(selectedTopic.subject_id)}
                  </Text>
                  {selectedTopic.is_resolved && (
                    <View style={styles.resolvedBadge}>
                      <MaterialIcons name="check-circle" size={14} color="#10B981" />
                      <Text style={styles.resolvedText}>Resolvido</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.topicDetailTitle}>{selectedTopic.title}</Text>
                <Text style={styles.topicDetailContent}>{selectedTopic.content}</Text>
                <View style={styles.topicDetailFooter}>
                  <Text style={styles.topicDetailAuthor}>
                    Por {selectedTopic.author_name}
                  </Text>
                  <Text style={styles.topicDetailDate}>
                    {formatDate(selectedTopic.created_at)}
                  </Text>
                </View>
                <View style={styles.repliesDivider}>
                  <Text style={styles.repliesTitle}>
                    {replies.length} {replies.length === 1 ? 'Resposta' : 'Respostas'}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyReplies}>
                <MaterialIcons name="chat-bubble-outline" size={48} color="#CCC" />
                <Text style={styles.emptyText}>Nenhuma resposta ainda</Text>
                <Text style={styles.emptySubtext}>Seja o primeiro a responder!</Text>
              </View>
            )}
            contentContainerStyle={styles.repliesList}
          />
        )}

        {/* Input de nova resposta */}
        {state.user && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.replyInputContainer}>
              <TextInput
                style={styles.replyInput}
                placeholder="Escreva uma resposta..."
                value={replyContent}
                onChangeText={setReplyContent}
                multiline
                maxLength={2000}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !replyContent.trim() && styles.sendButtonDisabled]}
                onPress={handleCreateReply}
                disabled={!replyContent.trim() || submitting}
              >
                <MaterialIcons 
                  name="send" 
                  size={24} 
                  color={replyContent.trim() ? '#FFF' : '#999'} 
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        <EditTopicModal />
        <EditReplyModal />
      </SafeAreaView>
    );
  }

  // Vista da lista de tópicos
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fórum</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Lista de tópicos */}
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTopicItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="forum" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum tópico encontrado</Text>
            <Text style={styles.emptySubtext}>
              Seja o primeiro a criar uma discussão!
            </Text>
          </View>
        )}
        contentContainerStyle={styles.topicsList}
      />

      {/* FAB para criar tópico */}
      {state.user && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setShowCreateTopicModal(true)}
        >
          <MaterialIcons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}

      <CreateTopicModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerAction: {
    padding: 8,
  },
  topicsList: {
    padding: 16,
  },
  topicCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicSubject: {
    fontSize: 12,
    color: '#0A66C2',
    fontWeight: '600',
    backgroundColor: '#E6F4FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  resolvedText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  topicDate: {
    fontSize: 11,
    color: '#999',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  topicPreview: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  topicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicAuthor: {
    fontSize: 12,
    color: '#666',
  },
  topicStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#999',
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A66C2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    minHeight: 120,
  },
  subjectPicker: {
    marginBottom: 8,
  },
  subjectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  subjectOptionSelected: {
    backgroundColor: '#0A66C2',
  },
  subjectOptionText: {
    fontSize: 13,
    color: '#666',
  },
  subjectOptionTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0A66C2',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },

  // Topic Detail
  topicDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  topicActions: {
    flexDirection: 'row',
  },
  topicDetailCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  topicDetailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  topicDetailSubject: {
    fontSize: 12,
    color: '#0A66C2',
    fontWeight: '600',
    backgroundColor: '#E6F4FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  topicDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  topicDetailContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  topicDetailFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  topicDetailAuthor: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  topicDetailDate: {
    fontSize: 12,
    color: '#999',
  },
  repliesDivider: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  repliesList: {
    paddingBottom: 100,
  },
  emptyReplies: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  // Replies
  replyCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  acceptedReply: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  acceptedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  replyDate: {
    fontSize: 11,
    color: '#999',
  },
  replyContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  replyFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  replyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyActionText: {
    fontSize: 12,
    color: '#666',
  },

  // Reply Input
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: '#FAFAFA',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A66C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});
