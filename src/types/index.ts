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
  image_url: string;
  ingredients: Ingredient[];
  instructions: string;
  comments: Comment[];
}

export interface Unit {
  value: string;
  label: string;
}
