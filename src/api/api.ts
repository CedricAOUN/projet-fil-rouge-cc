import { Recipe } from '@/types';
import { Course, User } from '@/api/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const recipesEndpoint = `${API_URL}/recipes`;
const expertsEndpoint = `${API_URL}/experts`;
const coursesEndpoint = `${API_URL}/courses`;

const defaultHeaders = {
  Accept: 'application/json',
};

export const fetchRecipes = async (query?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${recipesEndpoint}?search=${query || ''}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json().then((data) => data.data);
    return data;
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(expertsEndpoint, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then((data) => data.data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const fetchSingleUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${expertsEndpoint}/${id}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then((data) => data.data);
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}:`, error);
    throw error;
  }
};

export const fetchSingleRecipe = async (id: string): Promise<Recipe> => {
  try {
    const response = await fetch(`${recipesEndpoint}/${id}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then((data) => data.data);
  } catch (error) {
    console.error(`Failed to fetch recipe with id ${id}:`, error);
    throw error;
  }
};

export const fetchCourseByExpertId = async (
  expertId: string,
): Promise<Course[]> => {
  try {
    const response = await fetch(
      `${coursesEndpoint}?created_by_expert_id=${expertId}`,
      {
        headers: defaultHeaders,
      },
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then((data) => data.data);
  } catch (error) {
    console.error(
      `Failed to fetch courses for expert with id ${expertId}:`,
      error,
    );
    throw error;
  }
};

export const fetchCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await fetch(`${coursesEndpoint}/${id}`, {
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then((data) => data.data);
  } catch (error) {
    console.error(`Failed to fetch course with id ${id}:`, error);
    throw error;
  }
};
