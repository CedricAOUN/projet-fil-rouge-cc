import React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import DeleteUserModal from '@/components/EditProfileForm/DeleteUserModal';
import i18n from '@/i18n';
import { renderApp } from './render';
import { API, server, user } from './server';

test.each([false, true])('Google account deletion uses explicit confirmation with has_password=%s and retains the session on failure', async hasPassword => {
  const requests: unknown[] = [];
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, has_google_account: true, has_password: hasPassword } })),
    http.delete(`${API}/users/delete/1`, async ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer session');
      requests.push(await request.json());
      await delay(80);
      return requests.length === 1 ? HttpResponse.json({ message: 'Deletion unavailable' }, { status: 503 })
        : new HttpResponse(null, { status: 204 });
    }),
  );
  localStorage.setItem('token', 'session');
  const onClose = jest.fn();
  const interaction = userEvent.setup();
  const { store } = renderApp(<DeleteUserModal open onClose={onClose} />);
  await screen.findByText('Are you sure you want to delete your account? This action is irreversible.');
  const dialog = within(screen.getByRole('dialog', { name: 'Delete Account' }));
  expect(dialog.queryByLabelText('Password')).not.toBeInTheDocument();
  expect(requests).toEqual([]);
  await interaction.click(dialog.getByRole('button', { name: 'Delete account', exact: true }));
  expect(dialog.getByRole('button', { name: 'Deleting account...' })).toBeDisabled();
  expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(onClose).not.toHaveBeenCalled();
  expect(await dialog.findByText('Deletion unavailable')).toBeVisible();
  expect(localStorage.getItem('token')).toBe('session');
  expect(store.getState().user.isAuthenticated).toBe(true);
  await interaction.click(dialog.getByRole('button', { name: 'Delete account', exact: true }));
  await waitFor(() => expect(store.getState().user.isAuthenticated).toBe(false));
  expect(localStorage.getItem('token')).toBeNull();
  expect(requests).toEqual([{ confirmed: true }, { confirmed: true }]);
});

test('cancelling Google account deletion closes the confirmation without making a deletion request', async () => {
  const deletion = jest.fn();
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, has_google_account: true, has_password: false } })),
    http.delete(`${API}/users/delete/1`, () => { deletion(); return new HttpResponse(null, { status: 204 }); }),
  );
  const onClose = jest.fn();
  renderApp(<DeleteUserModal open onClose={onClose} />);
  await screen.findByText('Are you sure you want to delete your account? This action is irreversible.');
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(deletion).not.toHaveBeenCalled();
});

test('Google account deletion confirmation is translated into French', async () => {
  await i18n.changeLanguage('fr');
  try {
    server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, has_google_account: true, has_password: false } })));
    renderApp(<DeleteUserModal open onClose={jest.fn()} />);
    expect(await screen.findByText('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')).toBeVisible();
    expect(screen.queryByLabelText('Mot de passe')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Supprimer le compte', exact: true })).toBeEnabled();
  } finally {
    await act(async () => { await i18n.changeLanguage('en'); });
  }
});
