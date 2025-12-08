// app/profile.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { state, logout } = useAuth();
  const user = state.user;

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'person', label: 'Editar perfil', action: () => { router.push('/editar_perfil') } },
    { icon: 'notifications', label: 'Notificações', action: () => {} },
    { icon: 'security', label: 'Privacidade', action: () => {} },
    { icon: 'help', label: 'Ajuda', action: () => { Alert.alert('Ajuda', 'Aqui você encontra informações úteis.'); } },
    { icon: 'info', label: 'Sobre', action: () => { Alert.alert('Sobre', 'Um app feito por Helmer Barcelos!'); } },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <MaterialIcons name="account-circle" size={80} color="#0A66C2" />
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <MaterialIcons
            name={user?.role === 'volunteer' ? 'volunteer-activism' : 'school'}
            size={16}
            color="#0A66C2"
          />
          <Text style={styles.roleText}>
            {user?.role === 'volunteer' ? 'Voluntário' : 'Aprendiz'}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.action}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name={item.icon as any} size={24} color="#666" />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#DC2626" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.version}>Versão 1.0.0</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A66C2',
  },
  menuSection: {
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 32,
  },
});
