import React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { authApi, ChangePasswordRequest } from '@/api/authApi';
import { makeStore, renderApp } from './render';
import { API, server, user } from './server';
import i18n from '@/i18n';

const currentPassword = 'Current!Password123';
const newPassword = 'New!Password456';
const requirements = 'Use at least 12 characters, with uppercase and lowercase letters, a number, and a symbol.';

async function openPasswordDialog() {
  const store = makeStore();
  await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
  const onStopEdit = jest.fn();
  const interaction = userEvent.setup();
  renderApp(<EditProfileForm onStopEdit={onStopEdit} />, { store });
  await interaction.click(screen.getByRole('button', { name: 'Change Password' }));
  const dialog = within(screen.getByRole('dialog', { name: 'Change Password' }));
  return { store, onStopEdit, interaction, dialog };
}

test('changing a password sends authenticated credentials, prevents repeat submissions and preserves profile edits', async () => {
  const requests: ChangePasswordRequest[] = [];
  localStorage.setItem('token', 'session');
  server.use(http.put(`${API}/users/password`, async ({ request }) => {
    expect(request.headers.get('Authorization')).toBe('Bearer session');
    requests.push(await request.json() as ChangePasswordRequest);
    await delay(100);
    return HttpResponse.json({ message: 'Password changed successfully.' });
  }));
  const { dialog, interaction, onStopEdit, store } = await openPasswordDialog();
  await interaction.type(dialog.getByLabelText(/Current password/), currentPassword);
  await interaction.type(dialog.getByLabelText(/New password/), newPassword);
  await interaction.type(dialog.getByLabelText(/Confirm password/), newPassword);
  // Submit through Enter, just as with any other form.
  await interaction.type(dialog.getByLabelText(/Confirm password/), '{Enter}');
  expect(dialog.getByRole('button', { name: 'Changing password...' })).toBeDisabled();
  expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  fireEvent.keyDown(dialog.getByLabelText(/Confirm password/), { key: 'Escape' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await screen.findByText('Password changed successfully.');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(requests).toEqual([{
    current_password: currentPassword, password: newPassword, password_confirmation: newPassword,
  }]);
  expect(onStopEdit).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Username')).toHaveValue('Julia');
  expect(store.getState().user.isAuthenticated).toBe(true);
  expect(localStorage.getItem('token')).toBe('session');
  await interaction.click(screen.getByRole('button', { name: 'Change Password' }));
  expect(screen.getByLabelText(/Current password/)).toHaveValue('');
  expect(screen.getByLabelText(/New password/)).toHaveValue('');
  expect(screen.getByLabelText(/Confirm password/)).toHaveValue('');
});

test('missing, weak, mismatched and unchanged passwords are blocked before making a request', async () => {
  const request = jest.fn();
  server.use(http.put(`${API}/users/password`, () => { request(); return HttpResponse.json({}); }));
  const { dialog, interaction } = await openPasswordDialog();
  const submit = dialog.getByRole('button', { name: 'Change Password' });
  await interaction.click(submit);
  expect(dialog.getByText('Enter your current password.')).toBeVisible();
  await interaction.type(dialog.getByLabelText(/Current password/), currentPassword);
  await interaction.type(dialog.getByLabelText(/New password/), 'short');
  await interaction.type(dialog.getByLabelText(/Confirm password/), 'different');
  await interaction.click(submit);
  expect(dialog.getByText('Passwords must match.')).toBeVisible();
  expect(dialog.getByLabelText(/New password/)).toHaveAttribute('aria-invalid', 'true');
  expect(dialog.getByText(requirements)).toBeVisible();
  await interaction.clear(dialog.getByLabelText(/New password/));
  await interaction.type(dialog.getByLabelText(/New password/), currentPassword);
  await interaction.clear(dialog.getByLabelText(/Confirm password/));
  await interaction.type(dialog.getByLabelText(/Confirm password/), currentPassword);
  await interaction.click(submit);
  expect(dialog.getByText('Your new password must be different from your current password.')).toBeVisible();
  expect(request).not.toHaveBeenCalled();
});

test('server validation and general failures keep the dialog open and allow correction and retry', async () => {
  let calls = 0;
  server.use(http.put(`${API}/users/password`, () => {
    calls++;
    if (calls === 1) return HttpResponse.json({
      message: 'Validation failed.',
      errors: { current_password: ['The current password is incorrect.'] },
    }, { status: 422 });
    if (calls === 2) return HttpResponse.json({ message: 'Service unavailable.' }, { status: 503 });
    return HttpResponse.json({ message: 'Password changed successfully.' });
  }));
  const { dialog, interaction, onStopEdit } = await openPasswordDialog();
  await interaction.type(dialog.getByLabelText(/Current password/), 'wrong');
  await interaction.type(dialog.getByLabelText(/New password/), newPassword);
  await interaction.type(dialog.getByLabelText(/Confirm password/), newPassword);
  await interaction.click(dialog.getByRole('button', { name: 'Change Password' }));
  expect(await dialog.findByText('The current password is incorrect.')).toBeVisible();
  expect(dialog.getByLabelText(/Current password/)).toHaveAttribute('aria-invalid', 'true');
  expect(dialog.getByLabelText(/New password/)).toHaveValue(newPassword);
  await interaction.clear(dialog.getByLabelText(/Current password/));
  await interaction.type(dialog.getByLabelText(/Current password/), currentPassword);
  expect(dialog.queryByText('The current password is incorrect.')).not.toBeInTheDocument();
  await interaction.click(dialog.getByRole('button', { name: 'Change Password' }));
  expect(await dialog.findByText('Service unavailable.')).toBeVisible();
  expect(onStopEdit).not.toHaveBeenCalled();
  await interaction.click(dialog.getByRole('button', { name: 'Change Password' }));
  expect(await screen.findByText('Password changed successfully.')).toBeVisible();
  expect(calls).toBe(3);
});

test('cancelling clears entered passwords and server errors on the next attempt', async () => {
  server.use(http.put(`${API}/users/password`, () => new HttpResponse(null, { status: 500 })));
  const { dialog, interaction } = await openPasswordDialog();
  await interaction.type(dialog.getByLabelText(/Current password/), currentPassword);
  await interaction.type(dialog.getByLabelText(/New password/), newPassword);
  await interaction.type(dialog.getByLabelText(/Confirm password/), newPassword);
  await interaction.click(dialog.getByRole('button', { name: 'Change Password' }));
  expect(await dialog.findByText('Unable to change your password. Please try again.')).toBeVisible();
  await interaction.click(dialog.getByRole('button', { name: 'Cancel' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await interaction.click(screen.getByRole('button', { name: 'Change Password' }));
  expect(screen.getByLabelText(/Current password/)).toHaveValue('');
  expect(screen.getByLabelText(/New password/)).toHaveValue('');
  expect(screen.getByLabelText(/Confirm password/)).toHaveValue('');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('Google-only accounts receive an explanation instead of a password form', async () => {
  const store = makeStore();
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({
    data: { ...user, has_password: false },
  })));
  await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
  renderApp(<EditProfileForm onStopEdit={jest.fn()} />, { store });
  expect(screen.getByRole('button', { name: 'Change Password' })).toBeDisabled();
  expect(screen.getByText('You sign in with Google and do not have a password to change.')).toBeVisible();
});

test('password fields and validation messages are translated into French', async () => {
  await i18n.changeLanguage('fr');
  try {
    const store = makeStore();
    await store.dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
    renderApp(<EditProfileForm onStopEdit={jest.fn()} />, { store });
    await userEvent.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }));
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByLabelText(/Mot de passe actuel/)).toBeVisible();
    expect(dialog.getByLabelText(/Nouveau mot de passe/)).toBeVisible();
    await userEvent.click(dialog.getByRole('button', { name: 'Modifier le mot de passe' }));
    expect(dialog.getByText('Saisissez votre mot de passe actuel.')).toBeVisible();
  } finally {
    await act(async () => { await i18n.changeLanguage('en'); });
  }
});
