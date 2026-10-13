import React from 'react';
import { act, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import LoginModal from '@/components/LoginModal/LoginModal';
import GoogleSignInButton from '@/components/LoginModal/GoogleSignInButton';
import { renderApp } from './render';
import { API, server, user } from './server';
import { CONSENT_KEY, saveConsent } from '@/consent';

function googleSdk() {
  let callback: (response: { credential: string }) => void;
  window.google = { accounts: { id: {
    initialize: jest.fn(options => { callback = options.callback; }),
    renderButton: jest.fn(element => { const button = document.createElement('button'); button.textContent = 'Google sign-in'; button.onclick = () => callback({ credential: 'google-credential' }); element.append(button); }),
  } } };
}

beforeEach(() => { process.env.VITE_GOOGLE_CLIENT_ID = 'test-client'; googleSdk(); saveConsent(true); });
afterEach(() => { delete window.google; delete process.env.VITE_GOOGLE_CLIENT_ID; });

test('login displays server errors, prevents repeated submission while pending, and closes after success', async () => {
  saveConsent(false);
  let calls = 0;
  server.use(http.post(`${API}/users/login`, async () => {
    calls++; await delay(80);
    return calls === 1 ? HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }) : HttpResponse.json({ user, access_token: 'token', token_type: 'Bearer' });
  }));
  const handleClose = jest.fn();
  const interaction = userEvent.setup();
  const { store } = renderApp(<LoginModal isOpen handleClose={handleClose} />);
  await interaction.type(screen.getByPlaceholderText('Email'), user.email);
  await interaction.type(screen.getByPlaceholderText('Password'), 'Password123!');
  await interaction.click(screen.getByRole('button', { name: 'Login', exact: true }));
  expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
  expect(await screen.findByText('Invalid credentials')).toBeVisible();
  expect(handleClose).not.toHaveBeenCalled();
  await interaction.click(screen.getByRole('button', { name: 'Login', exact: true }));
  await waitFor(() => expect(handleClose).toHaveBeenCalledTimes(1));
  expect(store.getState().user.isAuthenticated).toBe(true);
  expect(localStorage.getItem('token')).toBe('token');
  expect(calls).toBe(2);
});

test('registration blocks weak/mismatched passwords and submits matching strong credentials', async () => {
  const requests: any[] = [];
  server.use(http.post(`${API}/users/register`, async ({ request }) => { requests.push(await request.json()); return HttpResponse.json({ user, access_token: 'registered', token_type: 'Bearer' }); }));
  const interaction = userEvent.setup();
  const handleClose = jest.fn();
  renderApp(<LoginModal isOpen handleClose={handleClose} />);
  await interaction.click(screen.getByRole('tab', { name: 'Sign Up' }));
  await interaction.type(screen.getByLabelText(/Name/), 'Julia');
  await interaction.type(screen.getByLabelText(/Email/), user.email);
  await interaction.type(screen.getByLabelText(/^Password/), 'short');
  await interaction.type(screen.getByLabelText(/Confirm password/), 'different');
  await interaction.click(screen.getByRole('button', { name: 'Sign Up' }));
  expect(requests).toEqual([]);
  expect(screen.getByText('Passwords must match.')).toBeVisible();
  await interaction.clear(screen.getByLabelText(/^Password/));
  await interaction.type(screen.getByLabelText(/^Password/), 'Strong!Password123');
  await interaction.clear(screen.getByLabelText(/Confirm password/));
  await interaction.type(screen.getByLabelText(/Confirm password/), 'Strong!Password123');
  await interaction.click(screen.getByRole('button', { name: 'Sign Up' }));
  await waitFor(() => expect(handleClose).toHaveBeenCalled());
  expect(requests[0]).toEqual({ name: 'Julia', email: user.email, password: 'Strong!Password123', password_confirmation: 'Strong!Password123' });
});

test('Google account linking keeps credentials through password failure then succeeds', async () => {
  const requests: any[] = [];
  server.use(http.post(`${API}/users/google`, async ({ request }) => {
    const body: any = await request.json(); requests.push(body);
    if (!body.password) return HttpResponse.json({ code: 'account_link_required' }, { status: 409 });
    if (body.password === 'wrong') return HttpResponse.json({ code: 'invalid_link_password', message: 'Incorrect password' }, { status: 401 });
    return HttpResponse.json({ user, access_token: 'google-token', token_type: 'Bearer' });
  }));
  const handleClose = jest.fn(); const interaction = userEvent.setup();
  renderApp(<LoginModal isOpen handleClose={handleClose} />);
  await interaction.click(screen.getByRole('button', { name: 'Google sign-in' }));
  const password = await screen.findByLabelText('Existing account password');
  expect(screen.getByRole('button', { name: 'Link account' })).toBeDisabled();
  await interaction.type(password, 'wrong');
  await interaction.click(screen.getByRole('button', { name: 'Link account' }));
  expect(await screen.findByText('Incorrect password')).toBeVisible();
  await interaction.clear(password); await interaction.type(password, 'correct');
  fireEvent.keyDown(password, { key: 'Enter' });
  await waitFor(() => expect(handleClose).toHaveBeenCalled());
  expect(requests).toEqual([{ credential: 'google-credential' }, { credential: 'google-credential', password: 'wrong' }, { credential: 'google-credential', password: 'correct' }]);
  expect(localStorage.getItem('token')).toBe('google-token');
});

test('cancelling Google linking clears the prompt and permits a new attempt', async () => {
  server.use(http.post(`${API}/users/google`, () => HttpResponse.json({ code: 'account_link_required' }, { status: 409 })));
  const interaction = userEvent.setup();
  renderApp(<LoginModal isOpen handleClose={jest.fn()} />);
  await interaction.click(screen.getByRole('button', { name: 'Google sign-in' }));
  await screen.findByLabelText('Existing account password');
  await interaction.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByLabelText('Existing account password')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Google sign-in' })).toBeVisible();
});

test('Google SDK receives its client ID and forwards credential callbacks', async () => {
  const credential = jest.fn(); renderApp(<GoogleSignInButton onCredential={credential} />);
  await userEvent.click(screen.getByRole('button', { name: 'Google sign-in' }));
  expect(window.google.accounts.id.initialize).toHaveBeenCalledWith(expect.objectContaining({ client_id: 'test-client' }));
  expect(credential).toHaveBeenCalledWith('google-credential');
});

test.each([
  ['missing', null],
  ['refused', JSON.stringify({ version: 1, accepted: false, timestamp: Date.now() })],
  ['malformed', '{invalid'],
  ['expired', JSON.stringify({ version: 1, accepted: true, timestamp: 0 })],
  ['invalid', JSON.stringify({ version: 1, accepted: 'true', timestamp: Date.now() })],
])('Google sign-in stays unavailable with %s consent while password login remains usable', (_, consent) => {
  if (consent === null) localStorage.removeItem(CONSENT_KEY);
  else localStorage.setItem(CONSENT_KEY, consent);
  renderApp(<><LoginModal isOpen handleClose={jest.fn()} /><GoogleSignInButton onCredential={jest.fn()} /></>);
  expect(screen.queryByRole('button', { name: 'Google sign-in' })).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeEnabled();
  expect(window.google.accounts.id.initialize).not.toHaveBeenCalled();
  expect(document.getElementById('google-identity-services')).toBeNull();
});

test('Google SDK loads only after acceptance and a delayed load is ignored after refusal', () => {
  saveConsent(false);
  delete window.google;
  renderApp(<GoogleSignInButton onCredential={jest.fn()} />);
  expect(document.getElementById('google-identity-services')).toBeNull();
  act(() => { saveConsent(true); });
  const script = document.getElementById('google-identity-services');
  expect(script).toHaveAttribute('src', 'https://accounts.google.com/gsi/client');
  act(() => { saveConsent(false); });
  expect(document.getElementById('google-identity-services')).toBeNull();
  googleSdk();
  fireEvent.load(script);
  expect(window.google.accounts.id.initialize).not.toHaveBeenCalled();
});

test('changing consent updates an open login dialog and blocks stale Google callbacks', () => {
  renderApp(<LoginModal isOpen handleClose={jest.fn()} />);
  const callback = (window.google.accounts.id.initialize as jest.Mock).mock.calls[0][0].callback;
  act(() => { saveConsent(false); });
  expect(screen.queryByRole('button', { name: 'Google sign-in' })).not.toBeInTheDocument();
  act(() => { callback({ credential: 'revoked-credential' }); });
  expect(screen.queryByLabelText('Existing account password')).not.toBeInTheDocument();
  act(() => { saveConsent(true); });
  expect(screen.getByRole('button', { name: 'Google sign-in' })).toBeVisible();
  act(() => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, accepted: false, timestamp: Date.now() }));
    window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_KEY }));
  });
  expect(screen.queryByRole('button', { name: 'Google sign-in' })).not.toBeInTheDocument();
});

test('Google callbacks stop working immediately when consent is refused, even before the UI updates', () => {
  const credential = jest.fn();
  renderApp(<GoogleSignInButton onCredential={credential} />);
  const callback = (window.google.accounts.id.initialize as jest.Mock).mock.calls[0][0].callback;
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, accepted: false, timestamp: Date.now() }));
  act(() => { callback({ credential: 'revoked-credential' }); });
  expect(credential).not.toHaveBeenCalled();
});
