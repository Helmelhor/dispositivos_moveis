// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User, AuthState } from '@/types';
import apiService from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'learner' | 'volunteer') => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'RESTORE_TOKEN'; payload: string | null }
  | { type: 'SIGN_IN'; payload: { token: string; user: User } }
  | { type: 'SIGN_UP'; payload: { token: string; user: User } }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  isLoading: true,
  isSignout: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        userToken: action.payload || undefined,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_UP':
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: undefined,
        user: undefined,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaurar token ao iniciar app
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        dispatch({ type: 'RESTORE_TOKEN', payload: token });
      } catch (e) {
        console.error('Falha ao restaurar token:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Integrar com endpoint de login da API
      const response = await apiService.login(email, password);
      
      const token = response.access_token;
      const userData: User = response.user;
      
      await AsyncStorage.setItem('userToken', token);
      apiService.setToken(token);
      
      dispatch({ type: 'SIGN_IN', payload: { token, user: userData } });
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw new Error(error.message || 'Falha ao fazer login');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: 'learner' | 'volunteer') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Integrar com endpoint de signup da API
      const response = await apiService.signup({ email, password, name, role });
      
      const token = response.access_token;
      const userData: User = response.user;
      
      await AsyncStorage.setItem('userToken', token);
      apiService.setToken(token);
      
      dispatch({ type: 'SIGN_UP', payload: { token, user: userData } });
    } catch (error: any) {
      console.error('Erro ao fazer signup:', error);
      throw new Error(error.message || 'Falha ao criar conta');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await AsyncStorage.removeItem('userToken');
      apiService.clearToken();
      
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const restoreToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        apiService.setToken(token);
      }
      dispatch({ type: 'RESTORE_TOKEN', payload: token });
    } catch (e) {
      console.error('Falha ao restaurar token:', e);
    }
  }, []);

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    restoreToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
