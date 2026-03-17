export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  birth_date?: string;
  role: UserRole;
  active: boolean;
  plan_id?: string;
  last_access?: string;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
}

export interface Plan {
  id: string;
  name: string;
  validity_days: number;
  price: number;
  is_promotional: boolean;
  promotional_price?: number;
  payment_url: string;
  promotional_payment_url?: string;
  active: boolean;
  accessible_modules: string[]; // IDs of modules
  created_at?: string;
}

export interface Progress {
  user_id: string;
  lesson_id: string;
  wpm: number;
  accuracy: number;
  completed_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  content: string;
  link: string;
  active: boolean;
  clicks: number;
  bg_color: string;
  text_color: string;
  speed: number;
  target_plans: string[];
  created_at?: string;
}
