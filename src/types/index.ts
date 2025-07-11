// Type definitions for the application

export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface Expert {
  id: number;
  first_name: string;
  last_name: string;
  is_expert: boolean;
  courses_count?: number;
  biography: string;
  courses?: Course[];
  avatar?: string;
}

export interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
}

export interface Comment {
  user: string;
  message: string;
  date: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  likes: number;
  date: string;
  img_url: string;
  ingredients: Ingredient[];
  instructions: string;
  comments: Comment[];
}

export interface Unit {
  value: string;
  label: string;
}
