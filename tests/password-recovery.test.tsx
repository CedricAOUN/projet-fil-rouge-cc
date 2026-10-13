import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '@/pages/PasswordRecovery/ForgotPassword';
import ResetPassword from '@/pages/PasswordRecovery/ResetPassword';
import LoginModal from '@/components/LoginModal/LoginModal';
import ConsentBanner from '@/components/ConsentBanner/ConsentBanner';
import { setAnalyticsConsent, trackPageView } from '@/analytics';
import { saveConsent } from '@/consent';
import i18n from '@/i18n';
import { renderApp } from './render';
import { API, server } from './server';

jest.mock('@/analytics', () => ({ setAnalyticsConsent: jest.fn(), trackPageView: jest.fn(), trackEvent: jest.fn() }));
const resetRoute = '/reset-password?token=secret-token&email=julia%2Btest%40example.com';

test('forgot-password link closes the login modal and opens the MealMosaic recovery page', async () => {
  const close = jest.fn();
  renderApp(<><LoginModal isOpen handleClose={close} /><Routes><Route path='/forgot-password' element={<ForgotPassword />} /></Routes></>);
  await userEvent.click(screen.getByRole('link', { name: 'Forgot password?' }));
  expect(close).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('location')).toHaveTextContent('/forgot-password');
});

test('recovery submits the email, prevents repeat submission, and displays a generic confirmation', async () => {
  const emails: unknown[] = [];
  server.use(http.post(`${API}/users/forgot-password`, async ({ request }) => {
    emails.push(await request.json()); await delay(80); return HttpResponse.json({ message: 'OK' });
  }));
  const interaction = userEvent.setup();
  renderApp(<ForgotPassword />);
  expect(screen.getByText(/If you use Google, sign in with Google/)).toBeVisible();
  await interaction.type(screen.getByLabelText(/^Email/), 'julia@example.com');
  await interaction.click(screen.getByRole('button', { name: 'Send reset link' }));
  expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  expect(await screen.findByText('If this email belongs to a MealMosaic password account, we have sent a reset link.')).toBeVisible();
  expect(emails).toEqual([{ email: 'julia@example.com' }]);
});

test('reset enforces password rules and matching confirmation and submits the emailed credentials', async () => {
  const requests: unknown[] = [];
  server.use(http.post(`${API}/users/reset-password`, async ({ request }) => {
    requests.push(await request.json()); await delay(80); return HttpResponse.json({ message: 'OK' });
  }));
  localStorage.setItem('token', 'old-session');
  const interaction = userEvent.setup();
  const { store } = renderApp(<ResetPassword />, { route: resetRoute });
  await interaction.type(screen.getByLabelText(/^New password/), 'weak');
  await interaction.type(screen.getByLabelText(/^Confirm password/), 'different');
  await interaction.click(screen.getByRole('button', { name: 'Reset password' }));
  expect(requests).toEqual([]);
  expect(screen.getByText('Passwords must match.')).toBeVisible();
  await interaction.clear(screen.getByLabelText(/^New password/));
  await interaction.type(screen.getByLabelText(/^New password/), 'Strong!Password456');
  await interaction.clear(screen.getByLabelText(/^Confirm password/));
  await interaction.type(screen.getByLabelText(/^Confirm password/), 'Strong!Password456');
  await interaction.click(screen.getByRole('button', { name: 'Reset password' }));
  expect(screen.getByRole('button', { name: 'Resetting password...' })).toBeDisabled();
  expect(await screen.findByText('Your password has been reset. You can now sign in.')).toBeVisible();
  expect(requests).toEqual([{ email: 'julia+test@example.com', token: 'secret-token', password: 'Strong!Password456', password_confirmation: 'Strong!Password456' }]);
  expect(store.getState().user.isAuthenticated).toBe(false);
  expect(localStorage.getItem('token')).toBeNull();
});

test('invalid and expired links offer a new reset link', async () => {
  const first = renderApp(<ResetPassword />, { route: '/reset-password' });
  expect(screen.getByText('This password reset link is invalid or expired. Request a new link.')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Request a new reset link' })).toHaveAttribute('href', '/forgot-password');
  first.unmount();
  server.use(http.post(`${API}/users/reset-password`, () => HttpResponse.json({ message: 'This password reset link is invalid or expired. Request a new link.' }, { status: 422 })));
  const interaction = userEvent.setup();
  renderApp(<ResetPassword />, { route: resetRoute });
  await interaction.type(screen.getByLabelText(/^New password/), 'Strong!Password456');
  await interaction.type(screen.getByLabelText(/^Confirm password/), 'Strong!Password456');
  await interaction.click(screen.getByRole('button', { name: 'Reset password' }));
  expect(await screen.findByText('This password reset link is invalid or expired. Request a new link.')).toBeVisible();
});

test('recovery request failures allow retry and French text is available', async () => {
  await i18n.changeLanguage('fr');
  try {
    server.use(http.post(`${API}/users/forgot-password`, () => HttpResponse.json({}, { status: 503 })));
    const interaction = userEvent.setup();
    renderApp(<ForgotPassword />);
    expect(screen.getByRole('heading', { name: 'Mot de passe oublié ?' })).toBeVisible();
    await interaction.type(screen.getByLabelText(/^Adresse e-mail/), 'julia@example.com');
    await interaction.click(screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' }));
    expect(await screen.findByText('Impossible d’envoyer le lien de réinitialisation. Veuillez réessayer.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Envoyer le lien de réinitialisation' })).toBeEnabled();
  } finally { await act(async () => { await i18n.changeLanguage('en'); }); }
});

test('reset links are excluded from analytics even when cookies are accepted', () => {
  saveConsent(true);
  renderApp(<ConsentBanner open={false} onClose={jest.fn()} />, { route: resetRoute });
  expect(setAnalyticsConsent).toHaveBeenCalledWith(false);
  expect(trackPageView).not.toHaveBeenCalled();
});
