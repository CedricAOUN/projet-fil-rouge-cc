// Define or import Course type before using it
export type Course = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  created_by_id: string;
  created_on: string;
};

export type User = {
  id: number;
  name: string; // Username
  first_name: string;
  last_name: string;
  is_expert: boolean;
  courses_count?: number;
  biography: string;
  courses?: Course[];
  avatar_url?: string;
};

export interface Recipe {
  id: string;
  title: string;
  description: string;
  date: string;
  img_url: string;
  ingredients: Ingredient[];
  instructions: string;
  comments: Comment[];
  favorites: {
    count: number;
    is_favorited_by_user: boolean;
  };
  likes: {
    count: number;
    is_liked_by_user: boolean;
  };
  creator: User;
}

export type Ingredient = {
  name: string;
  quantity: number | string;
  unit: string;
};

export type Unit = {
  value: string;
  label: string;
};

export type Comment = {
  username: string;
  content: string;
  created_at: string;
};
