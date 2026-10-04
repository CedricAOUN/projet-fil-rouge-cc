import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import CommentList from '@/components/CommentList/CommentList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import DeleteUserModal from '@/components/EditProfileForm/DeleteUserModal';
import SingleUserPage from '@/pages/SingleUserPage/SingleUserPage';
import { Routes, Route } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { renderApp, makeStore } from './render';
import { API, server, user } from './server';

const comment = { id: 3, content: 'Lovely soup', creator: user, recipe_id: 1, created_at: '2026-01-01', updated_at: '2026-01-02' };

test('premium users can add and edit comments, and cancel or confirm deletion', async () => {
  const writes: any[] = [];
  server.use(http.all(`${API}/comments/*`, async ({ request }) => { writes.push({ method: request.method, body: request.method === 'DELETE' ? null : await request.json() }); return HttpResponse.json({ id: 3, recipe_id: '1' }); }));
  const interaction = userEvent.setup();
  renderApp(<CommentList comments={[comment]} recipeId='1' />);
  await interaction.type(await screen.findByLabelText('Add a comment'), 'Nice');
  await interaction.click(screen.getByTestId('SendIcon').closest('button'));
  await waitFor(() => expect(writes).toContainEqual({ method: 'POST', body: { recipe_id: '1', content: 'Nice' } }));
  expect(screen.getByLabelText('Add a comment')).toHaveValue('');
  await interaction.click(screen.getByTestId('EditIcon').closest('button'));
  const dialog = screen.getByRole('dialog');
  await interaction.clear(within(dialog).getByRole('textbox'));
  await interaction.type(within(dialog).getByRole('textbox'), 'Excellent');
  await interaction.click(within(dialog).getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(writes).toContainEqual({ method: 'PUT', body: { content: 'Excellent' } }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await interaction.click(screen.getByTestId('DeleteIcon').closest('button'));
  await interaction.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(writes.filter(r => r.method === 'DELETE')).toHaveLength(0);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await interaction.click(screen.getByTestId('DeleteIcon').closest('button'));
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(writes).toContainEqual({ method: 'DELETE', body: null }));
});

test('regular users cannot create comments or edit someone else’s comment', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, id: 2, is_premium: false } })));
  const { store } = renderApp(<CommentList comments={[comment]} recipeId='1' />);
  await waitFor(() => expect(store.getState().user.currentUser?.id).toBe(2));
  expect(screen.queryByLabelText('Add a comment')).not.toBeInTheDocument();
  expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
  expect(screen.getByText(/Edited on/)).toBeVisible();
});

test('empty comments still permit premium users to add their first comment', async () => {
  let content: any;
  server.use(http.post(`${API}/comments/create`, async ({ request }) => { content = await request.json(); return HttpResponse.json({ id: 3 }); }));
  const interaction = userEvent.setup(); renderApp(<CommentList comments={[]} recipeId='1' />);
  expect(screen.getByText('No comments available.')).toBeVisible();
  await interaction.type(await screen.findByLabelText('Add a comment'), 'First');
  await interaction.click(screen.getByTestId('SendIcon').closest('button'));
  await waitFor(() => expect(content.content).toBe('First'));
});

test('profile edit submits name, biography and the actual avatar file and can cancel', async () => {
  let fields: FormData;
  server.use(http.put(`${API}/users/edit/1`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json(user); }));
  const store = makeStore(); await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
  const stop = jest.fn(); const interaction = userEvent.setup();
  renderApp(<EditProfileForm onStopEdit={stop} />, { store });
  await interaction.clear(screen.getByLabelText('Username')); await interaction.type(screen.getByLabelText('Username'), 'New Julia');
  await interaction.clear(screen.getByLabelText('Biography')); await interaction.type(screen.getByLabelText('Biography'), 'Cooking teacher');
  await interaction.upload(document.querySelector('input[type=file]') as HTMLInputElement, new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' }));
  expect(screen.getByAltText('Preview of your profile photo')).toHaveAttribute('src', 'blob:preview');
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
  expect(fields.get('name')).toBe('New Julia');
  expect(fields.get('biography')).toBe('Cooking teacher');
  expect((fields.get('avatar_url') as File).name).toBe('avatar.jpg');
  await interaction.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(stop).toHaveBeenCalledTimes(2);
});

test('account deletion requires a password, retains the session on failure and clears it on success', async () => {
  const passwords: string[] = [];
  server.use(http.delete(`${API}/users/delete/1`, async ({ request }) => { const body: any = await request.json(); passwords.push(body.password); return body.password === 'wrong' ? HttpResponse.json({ message: 'Invalid password' }, { status: 401 }) : new HttpResponse(null, { status: 204 }); }));
  localStorage.setItem('token', 'session');
  const interaction = userEvent.setup(); const { store } = renderApp(<DeleteUserModal open onClose={jest.fn()} />);
  expect(screen.getByRole('button', { name: 'Delete account' })).toBeDisabled();
  await waitFor(() => expect(store.getState().user.isAuthenticated).toBe(true));
  await interaction.type(screen.getByPlaceholderText('Password'), 'wrong');
  await interaction.click(screen.getByRole('button', { name: 'Delete account' }));
  expect(await screen.findByText('Invalid password')).toBeVisible();
  expect(localStorage.getItem('token')).toBe('session');
  await interaction.clear(screen.getByPlaceholderText('Password')); await interaction.type(screen.getByPlaceholderText('Password'), 'correct');
  await interaction.click(screen.getByRole('button', { name: 'Delete account' }));
  await waitFor(() => expect(store.getState().user.isAuthenticated).toBe(false));
  expect(localStorage.getItem('token')).toBeNull();
  expect(passwords).toEqual(['wrong', 'correct']);
});

test('own profile offers editing and associated courses', async () => {
  const interaction = userEvent.setup();
  renderApp(<Routes><Route path='/user/:id' element={<SingleUserPage />} /></Routes>, { route: '/user/1' });
  await screen.findByText('Julia');
  const edit = await screen.findByRole('button', { name: /edit/i });
  await interaction.click(edit);
  expect(await screen.findByLabelText('Username')).toHaveValue('Julia');
});
