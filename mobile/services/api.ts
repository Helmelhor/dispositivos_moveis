// services/api.ts
import axios from 'axios';
import { User, News, Subject, PartnerLocation, LoginRequest, SignupRequest, ForumTopic, ForumReply, ForumTopicCreate, ForumReplyCreate } from '@/types';

const API_BASE_URL = 'http://192.168.1.7:8000';

class ApiService {
  private api: any;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token em requisições
    this.api.interceptors.request.use(
      (config: any) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // ==================== AUTENTICAÇÃO ====================
  async login(email: string, password: string) {
    try {
      const response = await this.api.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(data: SignupRequest) {
    try {
      const response = await this.api.post('/users/', {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== USUÁRIOS ====================
  async getUser(userId: number): Promise<User> {
    try {
      const response = await this.api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(userId: number, data: Partial<User>) {
    try {
      const response = await this.api.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== DISCIPLINAS ====================
  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await this.api.get('/subjects/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubject(subjectId: number): Promise<Subject> {
    try {
      const response = await this.api.get(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== NOTÍCIAS ====================
  async getNews(params?: {
    news_type?: string;
    is_featured?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<News[]> {
    try {
      const response = await this.api.get('/news/', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNewsItem(newsId: number): Promise<News> {
    try {
      const response = await this.api.get(`/news/${newsId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createNews(data: { title: string; content: string; news_type: string }): Promise<News> {
    try {
      const response = await this.api.post('/news/', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteNews(newsId: number): Promise<void> {
    try {
      await this.api.delete(`/news/${newsId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== PARCEIROS ====================
  async getPartners(): Promise<PartnerLocation[]> {
    try {
      const response = await this.api.get('/partners/');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPartner(partnerId: number): Promise<PartnerLocation> {
    try {
      const response = await this.api.get(`/partners/${partnerId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== AULAS PUBLICADAS ====================
  async publishLesson(
    volunteerId: number,
    subjectId: number,
    title: string,
    description: string,
    mediaFile?: any
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('volunteer_id', volunteerId.toString());
      formData.append('subject_id', subjectId.toString());
      formData.append('title', title);
      formData.append('description', description);
      
      if (mediaFile) {
        // Para React Native, o arquivo pode ser um objeto com uri, type e name
        if (mediaFile.uri) {
          const filename = mediaFile.name || mediaFile.uri.split('/').pop();
          formData.append('media_file', {
            uri: mediaFile.uri,
            type: mediaFile.type || 'application/octet-stream',
            name: filename,
          } as any);
        } else {
          // Se for um arquivo de DocumentPicker
          formData.append('media_file', mediaFile);
        }
      }

      const response = await this.api.post('/published-lessons/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPublishedLessons(
    volunteerId?: number,
    subjectId?: number,
    skip?: number,
    limit?: number
  ): Promise<any[]> {
    try {
      const response = await this.api.get('/published-lessons/', {
        params: {
          volunteer_id: volunteerId,
          subject_id: subjectId,
          skip: skip || 0,
          limit: limit || 50,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPublishedLesson(lessonId: number): Promise<any> {
    try {
      const response = await this.api.get(`/published-lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePublishedLesson(
    lessonId: number,
    volunteerId: number,
    data: { title?: string; description?: string }
  ): Promise<any> {
    try {
      const response = await this.api.put(
        `/published-lessons/${lessonId}`,
        { ...data, volunteer_id: volunteerId }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePublishedLesson(lessonId: number, volunteerId: number): Promise<void> {
    try {
      await this.api.delete(`/published-lessons/${lessonId}`, {
        params: { volunteer_id: volunteerId },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async likePublishedLesson(lessonId: number): Promise<any> {
    try {
      const response = await this.api.post(`/published-lessons/${lessonId}/like`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== HEALTH CHECK ====================
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== FÓRUM ====================
  async getForumTopics(params?: {
    subject_id?: number;
    user_id?: number;
    is_resolved?: boolean;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<ForumTopic[]> {
    try {
      const response = await this.api.get('/forum/topics', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getForumTopic(topicId: number): Promise<ForumTopic> {
    try {
      const response = await this.api.get(`/forum/topics/${topicId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createForumTopic(data: ForumTopicCreate): Promise<ForumTopic> {
    try {
      const response = await this.api.post('/forum/topics', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateForumTopic(topicId: number, userId: number, data: { title?: string; content?: string; is_resolved?: boolean }): Promise<ForumTopic> {
    try {
      const response = await this.api.put(`/forum/topics/${topicId}`, data, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteForumTopic(topicId: number, userId: number): Promise<void> {
    try {
      await this.api.delete(`/forum/topics/${topicId}`, {
        params: { user_id: userId }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getForumReplies(topicId: number, skip?: number, limit?: number): Promise<ForumReply[]> {
    try {
      const response = await this.api.get(`/forum/topics/${topicId}/replies`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createForumReply(data: ForumReplyCreate): Promise<ForumReply> {
    try {
      const response = await this.api.post('/forum/replies', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateForumReply(replyId: number, userId: number, data: { content?: string }): Promise<ForumReply> {
    try {
      const response = await this.api.put(`/forum/replies/${replyId}`, data, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteForumReply(replyId: number, userId: number): Promise<void> {
    try {
      await this.api.delete(`/forum/replies/${replyId}`, {
        params: { user_id: userId }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async likeForumReply(replyId: number): Promise<ForumReply> {
    try {
      const response = await this.api.post(`/forum/replies/${replyId}/like`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async acceptForumReply(replyId: number, userId: number): Promise<ForumReply> {
    try {
      const response = await this.api.post(`/forum/replies/${replyId}/accept`, null, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== TRATAMENTO DE ERROS ====================
  private handleError(error: any) {
    if (error.response) {
      // Erro da API
      return {
        message: error.response.data?.detail || 'Erro na requisição',
        status: error.response.status,
      };
    } else if (error.request) {
      // Erro de conexão
      return {
        message: 'Erro de conexão. Verifique sua internet.',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'Erro desconhecido',
        status: -1,
      };
    }
  }

  // TODO: Adicionar métodos para:
  // - Voluntários (getVolunteers, createVolunteer, etc)
  // - Aprendizes (getLearners, createLearner, etc)
  // - Lições
  // - Cursos
  // - Quiz
  // - Gamificação (badges, points)
  // - Comunicação (mensagens, fórum)
  // - Agendamento
}

export default new ApiService();
