// Type definitions for the application

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
}

export interface Comment {
  comment_id: number;
  content: string;
  creator_id: number;
  created_at: string;
  username: string;
  avatar_url: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  likes: number;
  date: string;
  image_url: string;
  ingredients: Ingredient[];
  instructions: string;
  comments: Comment[];
}

export interface Unit {
  value: string;
  label: string;
}
