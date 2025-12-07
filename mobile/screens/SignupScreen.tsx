// screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'learner' | 'volunteer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não correspondem';
    }

    if (!role) {
      newErrors.role = 'Selecione um tipo de conta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await signup(email, password, name, role!);
      // Navegação acontecerá automaticamente
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          label="Nome Completo"
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
          icon="person"
          error={errors.name}
          containerStyle={styles.inputContainer}
        />

        <TextInput
          label="Email"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail"
          error={errors.email}
          containerStyle={styles.inputContainer}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon="lock"
            error={errors.password}
            containerStyle={styles.inputContainer}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.togglePassword}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            label="Confirmar Senha"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            icon="lock"
            error={errors.confirmPassword}
            containerStyle={styles.inputContainer}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.togglePassword}
          >
            <MaterialIcons
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Role Selection */}
        <Text style={styles.roleLabel}>Tipo de Conta</Text>
        {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'learner' && styles.roleButtonActive,
            ]}
            onPress={() => setRole('learner')}
          >
            <MaterialIcons
              name="school"
              size={28}
              color={role === 'learner' ? '#0A66C2' : '#999'}
            />
            <Text
              style={[
                styles.roleButtonText,
                role === 'learner' && styles.roleButtonTextActive,
              ]}
            >
              Aprendiz
            </Text>
            <Text style={styles.roleButtonSubtext}>
              Quero aprender
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'volunteer' && styles.roleButtonActive,
            ]}
            onPress={() => setRole('volunteer')}
          >
            <MaterialIcons
              name="volunteer-activism"
              size={28}
              color={role === 'volunteer' ? '#0A66C2' : '#999'}
            />
            <Text
              style={[
                styles.roleButtonText,
                role === 'volunteer' && styles.roleButtonTextActive,
              ]}
            >
              Voluntário
            </Text>
            <Text style={styles.roleButtonSubtext}>
              Quero ensinar
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Criar Conta"
          onPress={handleSignup}
          loading={loading}
          style={styles.signupButton}
        />
      </View>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já tem conta? </Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.loginLink}>Fazer login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    right: 12,
    bottom: 14,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  roleButtonActive: {
    borderColor: '#0A66C2',
    backgroundColor: '#E6F4FE',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  roleButtonTextActive: {
    color: '#0A66C2',
  },
  roleButtonSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  signupButton: {
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#0A66C2',
    fontSize: 14,
    fontWeight: '600',
  },
});
