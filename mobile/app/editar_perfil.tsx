// app/editar_perfil.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const user = state.user;
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    setLoading(true);
    try {
      // PUT para atualizar nome e email
      await apiService.updateUser(user.id, { name, email });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (error: any) {
      let msg = 'Erro ao atualizar perfil.';
      if (error?.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          msg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          msg = error.response.data.detail[0]?.msg || msg;
        }
      }
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Seu email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
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
  form: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#0A66C2',
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
