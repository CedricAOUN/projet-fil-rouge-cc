// Define or import Course type before using it
export type Course = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  created_by_id: string;
  created_on: string;
};

export type Expert = {
  id: number;
  first_name: string;
  last_name: string;
  is_expert: boolean;
  courses_count?: number;
  biography: string;
  courses?: Course[];
  avatar?: string;
};

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

export type Ingredient = {
  name: string;
  amount: number | string;
  unit: string;
};

export type Unit = {
  value: string;
  label: string;
};
