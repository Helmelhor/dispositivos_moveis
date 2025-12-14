// app/pontos.tsx
// Tela de Gamificação - Pontos, Badges e Missões

import React, { useEffect, useState, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Activity {
  id: number;
  type: 'aula' | 'comentario' | 'resposta' | 'participacao';
  title: string;
  description: string;
  points: number;
  date: string;
  icon: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface Mission {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  icon: string;
  completed: boolean;
}

export default function PontosScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumo' | 'missoes' | 'historico'>('resumo');

  // Mock data - em produção, viriam da API
  const [userPoints] = useState(2450);
  const [userLevel] = useState(12);
  const [nextLevelPoints] = useState(3000);
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      name: 'Primeiro Passo',
      description: 'Publica sua primeira aula',
      icon: '🎬',
      earned: true,
      earnedDate: '2025-10-15',
    },
    {
      id: 2,
      name: 'Mestre',
      description: 'Ministra 10 aulas',
      icon: '👨‍🏫',
      earned: true,
      earnedDate: '2025-11-20',
    },
    {
      id: 3,
      name: 'Ajudante Comunitário',
      description: 'Responde 20 dúvidas no fórum',
      icon: '🤝',
      earned: false,
    },
    {
      id: 4,
      name: 'Pesquisador',
      description: 'Explora 50 disciplinas diferentes',
      icon: '🔍',
      earned: false,
    },
    {
      id: 5,
      name: 'Dedicado',
      description: 'Usa o app por 30 dias consecutivos',
      icon: '🔥',
      earned: true,
      earnedDate: '2025-12-10',
    },
  ]);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: 'Aula Semanal',
      description: 'Publique 2 aulas esta semana',
      progress: 1,
      target: 2,
      reward: 100,
      icon: '📚',
      completed: false,
    },
    {
      id: 2,
      title: 'Participação Social',
      description: 'Responda 5 dúvidas no fórum',
      progress: 3,
      target: 5,
      reward: 50,
      icon: '💬',
      completed: false,
    },
    {
      id: 3,
      title: 'Explorador',
      description: 'Visualize aulas de 3 disciplinas diferentes',
      progress: 3,
      target: 3,
      reward: 75,
      icon: '🗺️',
      completed: true,
    },
    {
      id: 4,
      title: 'Curtindo Conteúdo',
      description: 'Dê like em 10 aulas',
      progress: 7,
      target: 10,
      reward: 40,
      icon: '❤️',
      completed: false,
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: 'aula',
      title: 'Aula Publicada',
      description: 'Você publicou "Introdução à Matemática"',
      points: 150,
      date: '2025-12-14',
      icon: '🎬',
    },
    {
      id: 2,
      type: 'resposta',
      title: 'Resposta Aceita',
      description: 'Sua resposta no fórum foi aceita como solução',
      points: 50,
      date: '2025-12-13',
      icon: '✅',
    },
    {
      id: 3,
      type: 'comentario',
      title: 'Comentário Útil',
      description: 'Seus comentários receberam 5 curtidas',
      points: 30,
      date: '2025-12-12',
      icon: '👍',
    },
    {
      id: 4,
      type: 'participacao',
      title: 'Participação em Fórum',
      description: 'Você participou ativamente da discussão',
      points: 25,
      date: '2025-12-11',
      icon: '💭',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carregamento de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const progressPercentage = (userPoints / nextLevelPoints) * 100;
  const earnedBadges = badges.filter(b => b.earned).length;

  // ==================== RENDERIZAÇÃO ====================

  const renderBadgeItem = ({ item }: { item: Badge }) => (
    <TouchableOpacity style={[styles.badgeCard, !item.earned && styles.badgeCardLocked]}>
      <View style={[styles.badgeIcon, !item.earned && styles.badgeIconLocked]}>
        <Text style={styles.badgeEmoji}>{item.icon}</Text>
        {!item.earned && (
          <View style={styles.badgeLock}>
            <MaterialIcons name="lock" size={12} color="#999" />
          </View>
        )}
      </View>
      <Text style={styles.badgeName} numberOfLines={2}>{item.name}</Text>
      <Text style={[styles.badgeDescription, !item.earned && styles.badgeDescriptionLocked]}>
        {item.description}
      </Text>
      {item.earned && item.earnedDate && (
        <Text style={styles.badgeDate}>
          {new Date(item.earnedDate).toLocaleDateString('pt-BR')}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderMissionItem = ({ item }: { item: Mission }) => {
    const progressPercent = (item.progress / item.target) * 100;

    return (
      <View style={[styles.missionCard, item.completed && styles.missionCardCompleted]}>
        <View style={styles.missionHeader}>
          <Text style={styles.missionIcon}>{item.icon}</Text>
          <View style={styles.missionInfo}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text style={styles.missionDescription}>{item.description}</Text>
          </View>
          <View style={styles.missionReward}>
            <MaterialIcons name="star" size={16} color="#FCD34D" />
            <Text style={styles.missionRewardText}>+{item.reward}</Text>
          </View>
        </View>
        <View style={styles.missionProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progressPercent, 100)}%`,
                  backgroundColor: item.completed ? '#10B981' : '#0A66C2',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress}/{item.target}
          </Text>
        </View>
      </View>
    );
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityDate}>
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.activityPoints}>
        <Text style={styles.activityPointsText}>+{item.points}</Text>
        <MaterialIcons name="star" size={14} color="#FCD34D" />
      </View>
    </View>
  );

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gamificação</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Conteúdo */}
      <FlatList
        scrollEnabled={activeTab === 'resumo'}
        data={activeTab === 'resumo' ? [] : activeTab === 'missoes' ? missions : activities}
        renderItem={
          activeTab === 'missoes'
            ? renderMissionItem
            : activeTab === 'historico'
            ? renderActivityItem
            : undefined
        }
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          activeTab === 'resumo' ? (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Card de Resumo */}
              <Card style={styles.summaryCard}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{userLevel}</Text>
                  <Text style={styles.levelLabel}>Nível</Text>
                </View>
                <View style={styles.pointsInfo}>
                  <Text style={styles.pointsTitle}>Pontos Totais</Text>
                  <Text style={styles.pointsValue}>{userPoints.toLocaleString('pt-BR')}</Text>
                  <Text style={styles.pointsSubtitle}>
                    {nextLevelPoints - userPoints} para o próximo nível
                  </Text>
                </View>
              </Card>

              {/* Barra de Progresso */}
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  {Math.round(progressPercentage)}% para o próximo nível
                </Text>
              </View>

              {/* Badges */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="grade" size={20} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Conquistas</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeCount}>
                      {earnedBadges}/{badges.length}
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={badges}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderBadgeItem}
                  numColumns={3}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.badgesGrid}
                  contentContainerStyle={styles.badgesContainer}
                />
              </View>

              {/* Estatísticas Rápidas */}
              <View style={styles.statsSection}>
                <View style={styles.statCard}>
                  <MaterialIcons name="school" size={24} color="#0A66C2" />
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Aulas</Text>
                </View>
                <View style={styles.statCard}>
                  <MaterialIcons name="chat" size={24} color="#10B981" />
                  <Text style={styles.statNumber}>23</Text>
                  <Text style={styles.statLabel}>Respostas</Text>
                </View>
                <View style={styles.statCard}>
                  <MaterialIcons name="thumb-up" size={24} color="#F59E0B" />
                  <Text style={styles.statNumber}>142</Text>
                  <Text style={styles.statLabel}>Curtidas</Text>
                </View>
              </View>
            </ScrollView>
          ) : null
        }
        contentContainerStyle={activeTab !== 'resumo' ? styles.listContent : undefined}
      />

      {/* Abas */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resumo' && styles.tabActive]}
          onPress={() => setActiveTab('resumo')}
        >
          <MaterialIcons
            name="dashboard"
            size={24}
            color={activeTab === 'resumo' ? '#0A66C2' : '#999'}
          />
          <Text style={[styles.tabLabel, activeTab === 'resumo' && styles.tabLabelActive]}>
            Resumo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'missoes' && styles.tabActive]}
          onPress={() => setActiveTab('missoes')}
        >
          <MaterialIcons
            name="flag"
            size={24}
            color={activeTab === 'missoes' ? '#0A66C2' : '#999'}
          />
          <Text style={[styles.tabLabel, activeTab === 'missoes' && styles.tabLabelActive]}>
            Missões
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'historico' && styles.tabActive]}
          onPress={() => setActiveTab('historico')}
        >
          <MaterialIcons
            name="history"
            size={24}
            color={activeTab === 'historico' ? '#0A66C2' : '#999'}
          />
          <Text style={[styles.tabLabel, activeTab === 'historico' && styles.tabLabelActive]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingBottom: 70,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0A66C2',
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A66C2',
  },
  levelLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pointsSubtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  progressSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A66C2',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  badge: {
    backgroundColor: '#0A66C2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCount: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },
  badgesContainer: {
    paddingHorizontal: 16,
  },
  badgesGrid: {
    gap: 12,
    marginBottom: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  badgeCardLocked: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeIconLocked: {
    backgroundColor: '#F0F0F0',
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeLock: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  badgeDescriptionLocked: {
    color: '#999',
  },
  badgeDate: {
    fontSize: 9,
    color: '#999',
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  missionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  missionCardCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  missionIcon: {
    fontSize: 32,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  missionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  missionReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 2,
  },
  missionRewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  missionProgress: {
    gap: 8,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
  },
  activityCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  activityPoints: {
    alignItems: 'center',
    gap: 2,
  },
  activityPointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FCD34D',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0A66C2',
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#0A66C2',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 70,
  },
});
