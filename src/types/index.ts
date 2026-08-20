// Type definitions for the application

import { User } from '@/api/api.types';
import { AuthUser } from '@/api/authApi';

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface Ingredient {
  name: string;
  quantity: number | string;
  unit: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  recipe_id: string;
  creator: User;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  likes: Likes;
  date: string;
  image_url: string;
  ingredients: Ingredient[];
  instructions: string;
  comments: Comment[];
  is_premium: boolean;
  creator: Partial<AuthUser>;
}

interface Likes {
  count: number;
  is_logged_in_user: boolean;
  is_liked_by_current_user: boolean;
}

export interface Unit {
  value: string;
  label: string;
}
