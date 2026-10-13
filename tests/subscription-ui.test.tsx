import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import SingleUserPage from '@/pages/SingleUserPage/SingleUserPage';
import PremiumPage from '@/pages/PremiumPage/PremiumPage';
import '@/i18n';
import { renderApp } from './render';
import { API, server, user } from './server';

const endsAt = '2030-11-01T00:00:00.000000Z';
const subscription = { can_cancel: true, cancelled: false, ends_at: null, current_period_end: endsAt, cancellation_email_sent: false };

function profile(route = '/user/1') {
  return renderApp(<Routes>
    <Route path='/user/:id' element={<SingleUserPage />} />
    <Route path='/premium' element={<PremiumPage />} />
  </Routes>, { route });
}

test('own profile requires confirmation, cancels renewal, refreshes status and preserves access', async () => {
  let currentSubscription = subscription;
  const requests: string[] = [];
  localStorage.setItem('token', 'session');
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, subscription: currentSubscription } })),
    http.post(`${API}/subscription/cancel`, async ({ request }) => {
      requests.push(request.headers.get('Authorization'));
      await delay(80);
      currentSubscription = { ...subscription, can_cancel: false, cancelled: true, ends_at: endsAt, cancellation_email_sent: true };
      return HttpResponse.json({ message: 'Your subscription will not renew.', ends_at: endsAt, email_sent: true });
    }),
  );
  const interaction = userEvent.setup();
  const { store } = profile();
  await interaction.click(await screen.findByRole('button', { name: 'Unsubscribe', exact: true }));
  await interaction.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));
  expect(requests).toEqual([]);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await interaction.click(screen.getByRole('button', { name: 'Unsubscribe', exact: true }));
  const dialog = within(screen.getByRole('dialog', { name: 'Unsubscribe' }));
  expect(dialog.getByText(/You will keep your access until November 1, 2030/)).toBeVisible();
  await interaction.click(dialog.getByRole('button', { name: 'Confirm unsubscribe' }));
  expect(dialog.getByRole('button', { name: 'Unsubscribing...' })).toBeDisabled();
  expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  expect(await screen.findByText('A confirmation email has been sent.')).toBeVisible();
  expect(screen.getByText(/Your subscription will not renew/)).toHaveTextContent('November 1, 2030');
  expect(screen.queryByRole('button', { name: 'Unsubscribe', exact: true })).not.toBeInTheDocument();
  await waitFor(() => expect(store.getState().user.currentUser.subscription.can_cancel).toBe(false));
  expect(store.getState().user.currentUser.is_premium).toBe(true);
  expect(requests).toEqual(['Bearer session']);
});

test('cancellation errors keep the confirmation open for retry', async () => {
  let requests = 0;
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, subscription } })),
    http.post(`${API}/subscription/cancel`, () => {
      requests++;
      return requests === 1 ? HttpResponse.json({ message: 'Stripe unavailable' }, { status: 503 })
        : HttpResponse.json({ ends_at: endsAt, email_sent: true });
    }),
  );
  const interaction = userEvent.setup();
  profile();
  await interaction.click(await screen.findByRole('button', { name: 'Unsubscribe', exact: true }));
  await interaction.click(screen.getByRole('button', { name: 'Confirm unsubscribe' }));
  expect(await screen.findByText('Unable to cancel your subscription. Please try again.')).toBeVisible();
  expect(screen.getByRole('dialog')).toBeVisible();
  await interaction.click(screen.getByRole('button', { name: 'Confirm unsubscribe' }));
  expect(await screen.findByText('A confirmation email has been sent.')).toBeVisible();
  expect(requests).toBe(2);
});

test('email delivery failure reports successful cancellation and allows a confirmation email retry', async () => {
  let requests = 0;
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, subscription } })),
    http.post(`${API}/subscription/cancel`, () => HttpResponse.json({ ends_at: endsAt, email_sent: ++requests > 1 })),
  );
  const interaction = userEvent.setup();
  profile();
  await interaction.click(await screen.findByRole('button', { name: 'Unsubscribe', exact: true }));
  await interaction.click(screen.getByRole('button', { name: 'Confirm unsubscribe' }));
  expect(await screen.findByText('Your subscription is cancelled, but the confirmation email could not be sent.')).toBeVisible();
  await interaction.click(await screen.findByRole('button', { name: 'Retry confirmation email' }));
  expect(await screen.findByText('A confirmation email has been sent.')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Retry confirmation email' })).not.toBeInTheDocument();
  expect(requests).toBe(2);
});

test('subscription management is private and explains unavailable subscription details', async () => {
  server.use(
    http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, subscription } })),
    http.get(`${API}/users/2`, () => HttpResponse.json({ data: { ...user, id: 2, name: 'Other chef' } })),
  );
  const first = profile('/user/2');
  await screen.findByRole('heading', { name: 'Other chef' });
  await waitFor(() => expect(first.store.getState().user.currentUser).not.toBeNull());
  expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Subscription' })).not.toBeInTheDocument();
  first.unmount();
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: user })));
  const second = profile();
  await screen.findByRole('heading', { name: 'Julia' });
  await waitFor(() => expect(second.store.getState().user.currentUser).not.toBeNull());
  expect(await screen.findByText('Subscription details are unavailable. Please refresh the page or try again later.')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument();
});

test.each([
  [true, null, 'Your premium access is not linked to a billing subscription. There is no renewal to cancel.'],
  [false, null, 'You do not have a subscription.'],
  [false, { ...subscription, can_cancel: false }, 'Your subscription has ended. There is no renewal to cancel.'],
])('own profile explains billing status for premium=%s and subscription=%s', async (isPremium, billingSubscription, message) => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, is_premium: isPremium, subscription: billingSubscription } })));
  profile();
  expect(await screen.findByRole('heading', { name: 'Subscription' })).toBeVisible();
  expect(await screen.findByText(message as string)).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument();
});

test('premium subscribers get a manage-subscription link to their own profile', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, subscription } })));
  const interaction = userEvent.setup();
  profile('/premium');
  const manage = await screen.findByRole('link', { name: 'Manage subscription' });
  expect(manage).toHaveAttribute('href', '/user/1');
  expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument();
  await interaction.click(manage);
  expect(screen.getByTestId('location')).toHaveTextContent('/user/1');
  expect(await screen.findByRole('button', { name: 'Unsubscribe', exact: true })).toBeVisible();
});
