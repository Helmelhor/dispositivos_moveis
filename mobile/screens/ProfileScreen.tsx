// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { state, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Sair',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const user = state.user;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <MaterialIcons name="account-circle" size={80} color="#0A66C2" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: user?.status === 'active' ? '#10B981' : '#F59E0B' },
            ]}
          />
          <Text style={styles.statusText}>
            {user?.status === 'active' ? 'Ativo' : 'Pendente'}
          </Text>
        </View>
      </View>

      {/* Profile Info */}
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="phone" size={20} color="#0A66C2" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{user?.phone || 'Não preenchido'}</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="location-on" size={20} color="#0A66C2" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Localização</Text>
            <Text style={styles.infoValue}>
              {user?.location_city && user?.location_state
                ? `${user.location_city}, ${user.location_state}`
                : 'Não preenchido'}
            </Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="school" size={20} color="#0A66C2" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Tipo de Conta</Text>
            <Text style={styles.infoValue}>
              {user?.role === 'learner' ? 'Aprendiz' : 'Voluntário'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Statistics */}
      {user?.role === 'volunteer' && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="school" size={24} color="#0A66C2" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Aulas</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="star" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="people" size={24} color="#10B981" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Aprendizes</Text>
            </View>
          </View>
        </View>
      )}

      {user?.role === 'learner' && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="school" size={24} color="#0A66C2" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Cursos</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="star" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Selos</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="quiz" size={24} color="#EC4899" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Testes</Text>
            </View>
          </View>
        </View>
      )}

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="notifications" size={20} color="#0A66C2" />
          <Text style={styles.settingText}>Notificações</Text>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="lock" size={20} color="#0A66C2" />
          <Text style={styles.settingText}>Privacidade e Segurança</Text>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="help" size={20} color="#0A66C2" />
          <Text style={styles.settingText}>Ajuda e Suporte</Text>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="info" size={20} color="#0A66C2" />
          <Text style={styles.settingText}>Sobre o App</Text>
          <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="danger"
          style={{ marginBottom: 20 }}
        />
      </View>

      {/* TODO: Adicionar telas para */}
      {/* - Edição de perfil com foto, bio, disponibilidade */}
      {/* - Notificações */}
      {/* - Privacidade e segurança */}
      {/* - Chat de suporte */}
      {/* - Histórico de aulas e transações */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  header: {
    backgroundColor: '#FFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F4F8',
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A66C2',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
