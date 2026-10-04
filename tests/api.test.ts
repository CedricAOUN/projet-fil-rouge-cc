import { http, HttpResponse } from 'msw';
import { API, server, user, recipe, course } from './server';
import { makeStore } from './render';
import { authApi } from '@/api/authApi';
import { recipeApi } from '@/api/recipeApi';
import { courseApi } from '@/api/courseApi';
import { plansApi, formatPrice } from '@/api/plansApi';

test('login, registration, Google linking, restoration and logout manage the session', async () => {
  const store = makeStore();
  const requests: any[] = [];
  server.use(http.post(`${API}/users/:action`, async ({ request, params }) => {
    requests.push({ action: params.action, body: params.action === 'logout' ? null : await request.json(), authorization: request.headers.get('authorization') });
    return HttpResponse.json({ user, access_token: 'session-token', token_type: 'Bearer' });
  }));
  for (const [endpoint, body] of [
    [authApi.endpoints.login, { email: user.email, password: 'secret' }],
    [authApi.endpoints.register, { name: user.name, email: user.email, password: 'secret', password_confirmation: 'secret' }],
    [authApi.endpoints.googleLogin, { credential: 'google-token', password: 'link-password' }],
  ] as const) {
    await store.dispatch(endpoint.initiate(body as any)).unwrap();
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('session-token');
  }
  expect(requests.map(r => r.action)).toEqual(['login', 'register', 'google']);
  expect(requests[2].body).toEqual({ credential: 'google-token', password: 'link-password' });
  expect(await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap()).toEqual(user);
  await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  expect(requests[3].authorization).toBe('Bearer session-token');
  expect(store.getState().user.currentUser).toBeNull();
  expect(localStorage.getItem('token')).toBeNull();
});

test('failed session restoration clears an expired token', async () => {
  localStorage.setItem('token', 'expired');
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 })));
  const store = makeStore();
  await expect(store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap()).rejects.toMatchObject({ status: 401 });
  expect(store.getState().user.isAuthenticated).toBe(false);
  expect(localStorage.getItem('token')).toBeNull();
});

test.each(['login', 'register', 'googleLogin'] as const)('%s failure finishes loading without authenticating', async endpoint => {
  server.use(http.post(`${API}/users/*`, () => HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })));
  const store = makeStore();
  await expect(store.dispatch(authApi.endpoints[endpoint].initiate({ email: user.email, password: 'wrong', credential: 'bad' } as any)).unwrap()).rejects.toMatchObject({ status: 401 });
  expect(store.getState().user.isLoading).toBe(false);
  expect(store.getState().user.isAuthenticated).toBe(false);
});

test('search encodes filters and sends the bearer and Accept headers', async () => {
  localStorage.setItem('token', 'token');
  let observed: Request;
  server.use(http.get(`${API}/recipes`, ({ request }) => { observed = request; return HttpResponse.json({ recipes: [], total: 0 }); }));
  await makeStore().dispatch(recipeApi.endpoints.getRecipes.initiate({ search: 'salt & pepper', ingredients: ['Salt', 'Pepper'], creators: ['Julia'], likeRange: [1, 20], recipeType: 'premium' })).unwrap();
  const params = new URL(observed.url).searchParams;
  expect(Object.fromEntries(params)).toEqual({ search: 'salt & pepper', ingredients: 'Salt,Pepper', creators: 'Julia', likeRange: '1,20', recipeType: 'premium' });
  expect(observed.headers.get('authorization')).toBe('Bearer token');
  expect(observed.headers.get('accept')).toBe('application/json');
});

test.each(['createRecipe', 'editRecipe'] as const)('%s serializes quantities, premium status and image as multipart data', async endpoint => {
  let fields: FormData;
  server.use(http.all(`${API}/recipes/*`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json({ data: recipe }); }));
  const data = { title: 'Soup', instructions: 'Boil', is_premium: true, ingredients: [{ name: 'Salt', amount: '2', unit: 'tsp' }], image: new File(['image'], 'soup.jpg', { type: 'image/jpeg' }) };
  const payload = endpoint === 'editRecipe' ? { data, id: '1' } : data;
  expect(await makeStore().dispatch(recipeApi.endpoints[endpoint].initiate(payload as any)).unwrap()).toEqual(recipe);
  expect(fields.get('ingredients[0][quantity]')).toBe('2');
  expect(fields.get('description')).toBe('');
  expect(fields.get('is_premium')).toBe('1');
  expect((fields.get('image_file') as File).name).toBe('soup.jpg');
});

test.each(['createCourse', 'editCourse'] as const)('%s sends course content and video', async endpoint => {
  let fields: FormData;
  server.use(http.all(`${API}/courses/*`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json({ data: course }); }));
  const data = { id: 1, title: 'Knife', content: '# Chop', video: new File(['video'], 'lesson.mp4', { type: 'video/mp4' }) };
  expect(await makeStore().dispatch(courseApi.endpoints[endpoint].initiate(data)).unwrap()).toEqual(course);
  expect(fields.get('content')).toBe('# Chop');
  expect((fields.get('video') as File).name).toBe('lesson.mp4');
});

test('recipe mutations refresh subscribed details and comments use their own routes', async () => {
  const store = makeStore();
  let reads = 0;
  const writes: any[] = [];
  server.use(
    http.get(`${API}/recipes/1`, () => { reads++; return HttpResponse.json({ data: recipe }); }),
    http.post(`${API}/recipes/1/:action`, ({ params }) => { writes.push(params.action); return HttpResponse.json({}); }),
    http.all(`${API}/comments/*`, async ({ request }) => { writes.push({ method: request.method, path: new URL(request.url).pathname, body: request.method === 'DELETE' ? null : await request.json() }); return HttpResponse.json({ id: 3, recipe_id: '1' }); }),
  );
  const subscription = store.dispatch(recipeApi.endpoints.getRecipeById.initiate('1'));
  await subscription.unwrap();
  for (const endpoint of ['toggleLikeRecipe', 'toggleFavoriteRecipe'] as const) {
    await store.dispatch(recipeApi.endpoints[endpoint].initiate({ recipeId: '1' })).unwrap();
    await Promise.all(store.dispatch(recipeApi.util.getRunningQueriesThunk()));
  }
  expect(reads).toBeGreaterThanOrEqual(3);
  await store.dispatch(recipeApi.endpoints.addComment.initiate({ recipeId: '1', content: 'Lovely' })).unwrap();
  await store.dispatch(recipeApi.endpoints.editComment.initiate({ commentId: 3, content: 'Edited' })).unwrap();
  await store.dispatch(recipeApi.endpoints.deleteComment.initiate({ commentId: 3, recipeId: '1' })).unwrap();
  expect(writes).toContainEqual({ method: 'POST', path: '/api/v1/comments/create', body: { recipe_id: '1', content: 'Lovely' } });
  expect(writes).toContainEqual({ method: 'PUT', path: '/api/v1/comments/edit/3', body: { content: 'Edited' } });
  expect(writes).toContainEqual({ method: 'DELETE', path: '/api/v1/comments/delete/3', body: null });
  subscription.unsubscribe();
});

test.each([['month', 1, 1200, '12.00 EUR'], ['month', 6, 6000, '10.00 EUR'], ['year', 1, 9600, '8.00 EUR']])('formats %s/%s plan pricing', async (interval, count, amount, monthly) => {
  server.use(http.post(`${API}/stripe/plan-details`, () => HttpResponse.json({ amount, currency: 'eur', interval, interval_count: count })));
  expect(await makeStore().dispatch(plansApi.endpoints.getPlanDetails.initiate('price_test')).unwrap()).toEqual({ price: formatPrice(Number(amount), 'eur'), monthlyPrice: monthly });
});

test('profile updates and account deletion use the current ID and preserve password request data', async () => {
  const store = makeStore();
  const calls: any[] = [];
  server.use(http.put(`${API}/users/edit/1`, async ({ request }) => { calls.push((await request.formData()).get('name')); return HttpResponse.json(user); }), http.delete(`${API}/users/delete/1`, async ({ request }) => { calls.push(await request.json()); return new HttpResponse(null, { status: 204 }); }));
  await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
  const profileData = new FormData(); profileData.append('name', 'New name');
  await store.dispatch(authApi.endpoints.updateProfile.initiate({ userId: 1, profileData })).unwrap();
  await store.dispatch(authApi.endpoints.deleteUserById.initiate({ id: '1', password: 'secret' })).unwrap();
  expect(calls).toEqual(['New name', { password: 'secret' }]);
  expect(store.getState().user.isAuthenticated).toBe(false);
});
