import React from 'react';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { Route, Routes } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { authApi } from '@/api/authApi';
import { recipeApi } from '@/api/recipeApi';
import { courseApi } from '@/api/courseApi';
import { renderApp, makeStore } from './render';
import { API, server, user } from './server';

test.each([200, 401])('logout HTTP %s updates the header, navigates home and clears authenticated caches', async status => {
  localStorage.setItem('token', 'session');
  const logoutHeaders: string[] = [];
  server.use(
    http.get(`${API}/users/me`, ({ request }) => request.headers.has('Authorization')
      ? HttpResponse.json({ data: user }) : HttpResponse.json({}, { status: 401 })),
    http.post(`${API}/users/logout`, ({ request }) => {
      logoutHeaders.push(request.headers.get('Authorization'));
      return HttpResponse.json({}, { status });
    }),
  );
  const store = makeStore();
  await store.dispatch(recipeApi.endpoints.getRecipeById.initiate('1')).unwrap();
  await store.dispatch(courseApi.endpoints.getCourseById.initiate('1')).unwrap();
  const interaction = userEvent.setup();
  renderApp(<><Header currentTheme='light' onThemeToggle={jest.fn()} /><Routes>
    <Route path='/favorites' element={<p>Private page</p>} />
    <Route path='/' element={<p>Home page</p>} />
  </Routes></>, { route: '/favorites', store });
  await interaction.click((await screen.findByTestId('PersonIcon')).closest('button'));
  await interaction.click(screen.getByRole('menuitem', { name: 'Logout' }));
  expect(await screen.findByText('Home page')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeVisible();
  expect(screen.queryByTestId('PersonIcon')).not.toBeInTheDocument();
  expect(localStorage.getItem('token')).toBeNull();
  expect(store.getState().user.isAuthenticated).toBe(false);
  expect(store.getState().user.currentUser).toBeNull();
  expect(recipeApi.endpoints.getRecipeById.select('1')(store.getState()).data).toBeUndefined();
  expect(courseApi.endpoints.getCourseById.select('1')(store.getState()).data).toBeUndefined();
  expect(logoutHeaders).toEqual(['Bearer session']);
});

test('logout aborts a pending user refresh so it cannot restore the signed-out session', async () => {
  localStorage.setItem('token', 'session');
  let reads = 0;
  server.use(
    http.get(`${API}/users/me`, async ({ request }) => {
      if (!request.headers.has('Authorization')) return HttpResponse.json({}, { status: 401 });
      if (++reads > 1) await delay(300);
      return HttpResponse.json({ data: user });
    }),
    http.post(`${API}/users/logout`, () => HttpResponse.json({})),
  );
  const store = makeStore();
  await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
  const refresh = store.dispatch(authApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }));
  await waitFor(() => expect(reads).toBe(2));
  await act(async () => { await store.dispatch(authApi.endpoints.logout.initiate()).unwrap(); });
  await refresh;
  expect(store.getState().user.currentUser).toBeNull();
  expect(authApi.endpoints.getCurrentUser.select()(store.getState()).data).toBeUndefined();
  expect(localStorage.getItem('token')).toBeNull();
});
