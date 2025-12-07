// Tipos gerais da aplicação

export type UserRole = 'learner' | 'volunteer';
export type UserStatus = 'pending' | 'active' | 'inactive' | 'rejected';
export type VolunteerType = 'student' | 'teacher';
export type NewsType = 'news' | 'event' | 'campaign' | 'announcement';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profile_image?: string;
  location_city?: string;
  location_state?: string;
  bio?: string;
  is_online_available: boolean;
  is_presencial_available: boolean;
  created_at: string;
  last_login?: string;
}

export interface Volunteer extends User {
  volunteer_id: number;
  volunteer_type: VolunteerType;
  institution?: string;
  document_verified: 0 | 1 | 2; // 0: pendente, 1: aprovado, 2: rejeitado
  total_points: number;
  total_lessons: number;
  subjects?: Subject[];
}

export interface Learner extends User {
  learner_id: number;
  total_badges: number;
  total_courses_completed: number;
  total_quiz_score: number;
  interests?: Subject[];
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  news_type: NewsType;
  author?: string;
  is_featured: boolean;
  is_active: boolean;
  published_at: string;
  event_date?: string;
  event_location?: string;
  event_link?: string;
  campaign_goal?: string;
  campaign_end_date?: string;
  campaign_contact?: string;
  views_count: number;
}

export interface PartnerLocation {
  id: number;
  name: string;
  partner_type: 'ong' | 'library' | 'school' | 'community_center';
  description: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken?: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// TODO: Adicionar tipos para:
// - Lessons
// - Courses
// - Quiz e QuizAttempts
// - Badges e PointsTransaction
// - Messages e ForumTopics
// - Agendamento de aulas
