import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
export const API = 'http://localhost:8000/api/v1';
export const user = { id: 1, name: 'Julia', email: 'julia@example.com', first_name: 'Julia', last_name: 'Child', biography: 'Chef', avatar_url: null, is_premium: true, is_chef: true, favorite_recipes: [], created_at: '2026-01-01', updated_at: '2026-01-01', premium_expire: null };
export const recipe = { id: 1, title: 'Carrot soup', description: 'Warm soup', instructions: 'Chop carrots\nBoil water', image_url: 'https://example.com/soup.jpg', is_premium: false, creator: user, ingredients: [{ id: 1, name: 'Carrot', quantity: 2, unit: 'pcs' }], comments: [], likes: { count: 2, is_liked_by_user: false }, favorites: { count: 0, is_favorited_by_user: false }, created_at: '2026-01-01' };
export const course = { id: 1, title: 'Knife skills', content: '# Chop safely', created_by: user, video_url: null };
export const recipeList = { recipes: [recipe], total: 1, highest_likes: 2, lowest_likes: 0, all_creators: ['Julia'], all_ingredients: ['Carrot'] };
export const server = setupServer(
  http.get(`${API}/users/me`, () => HttpResponse.json({ data: user })),
  http.get(`${API}/users/chefs`, () => HttpResponse.json({ data: [user] })),
  http.get(`${API}/users/:id`, () => HttpResponse.json({ data: user })),
  http.get(`${API}/recipes`, () => HttpResponse.json(recipeList)),
  http.get(`${API}/recipes/:id/ai`, () => HttpResponse.json({ data: { suggestion: 'Roast carrots.' } })),
  http.get(`${API}/recipes/:id`, () => HttpResponse.json({ data: recipe })),
  http.get(`${API}/courses/list`, () => HttpResponse.json({ data: [course] })),
  http.get(`${API}/courses`, () => HttpResponse.json({ data: [course] })),
  http.get(`${API}/courses/:id`, () => HttpResponse.json({ data: course })),
  http.post(`${API}/stripe/plan-details`, () => HttpResponse.json({ amount: 1200, currency: 'eur', interval: 'month', interval_count: 1 })),
);
