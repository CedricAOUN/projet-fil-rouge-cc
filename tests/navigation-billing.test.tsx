import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import App from '@/App';
import Header from '@/components/Header/Header';
import Checkout from '@/components/Checkout/Checkout';
import Favorites from '@/pages/Favorites/Favorites';
import MyRecipes from '@/pages/MyRecipes/MyRecipes';
import BillingSuccess from '@/pages/BillingSuccess/BillingSuccess';
import BillingFailure from '@/pages/BillingFailure/BillingFailure';
import PremiumPage from '@/pages/PremiumPage/PremiumPage';
import CourseList from '@/components/CourseList/CourseList';
import { renderApp } from './render';
import { API, server, recipe, recipeList, user, course } from './server';

jest.mock('react-player', () => ({ __esModule: true, default: () => <video /> }));
jest.mock('@uiw/react-md-editor', () => ({ __esModule: true, default: () => <textarea />, commands: { group: jest.fn(() => ({})) } }));

test('app restores its session, persists theme changes and navigates from home to recipes', async () => {
  localStorage.setItem('token', 'session');
  const interaction = userEvent.setup(); const { store } = renderApp(<App />);
  await waitFor(() => expect(store.getState().user.currentUser?.id).toBe(1));
  expect(await screen.findByRole('heading', { name: 'Carrot soup' })).toBeVisible();
  const themeSwitch = screen.getByRole('button', { name: 'Dark mode' });
  await interaction.click(themeSwitch);
  await waitFor(() => expect(localStorage.getItem('theme-mode')).toBe('dark'));
  await interaction.click(screen.getByRole('link', { name: 'Recipes', exact: true }));
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/recipes'));
  expect(await screen.findByPlaceholderText('Search for recipes...')).toBeVisible();
  expect(window.scrollTo).toHaveBeenCalled();
});

test('unknown routes show the not-found page', async () => {
  renderApp(<App />, { route: '/unknown' });
  expect(await screen.findByRole('heading', { name: "Woops! This page doesn't exist." })).toBeVisible();
});

test('anonymous header opens login and supports theme switching', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({}, { status: 401 })));
  const toggle = jest.fn();
  renderApp(<Header currentTheme='light' onThemeToggle={toggle} />);
  fireEvent.click(screen.getByRole('button', { name: 'Dark mode' }));
  expect(toggle).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
  expect(await screen.findByRole('tab', { name: 'Login' })).toBeVisible();
});

test('profile dropdown exposes entitled actions and navigates to favorites', async () => {
  const interaction = userEvent.setup(); renderApp(<Header currentTheme='light' onThemeToggle={jest.fn()} />);
  const avatar = await screen.findByTestId('PersonIcon');
  await interaction.click(avatar.closest('button'));
  expect(screen.getByRole('menuitem', { name: 'Create a recipe' })).toBeVisible();
  expect(screen.getByRole('menuitem', { name: 'Create a course' })).toBeVisible();
  await interaction.click(screen.getByRole('menuitem', { name: 'Favorites' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/favorites');
});

test('favorites empty state links to search and populated state opens a recipe', async () => {
  const interaction = userEvent.setup(); const first = renderApp(<Favorites />);
  await interaction.click(await screen.findByRole('button', { name: 'Explore Recipes' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/recipes');
  first.unmount();
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, favorite_recipes: [recipe] } })));
  renderApp(<Favorites />);
  await interaction.click(await screen.findByRole('button', { name: 'View Recipe' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/recipe/1');
});

test('my recipes allows editing and requires confirmation before deletion', async () => {
  let deletes = 0;
  server.use(http.delete(`${API}/recipes/delete/1`, () => { deletes++; return new HttpResponse(null, { status: 204 }); }));
  const interaction = userEvent.setup(); renderApp(<MyRecipes />);
  await screen.findByRole('heading', { name: 'Carrot soup' });
  await interaction.click(screen.getByTestId('EditIcon').closest('button'));
  expect(screen.getByTestId('location')).toHaveTextContent('/recipe/edit/1');
  await interaction.click(screen.getByTestId('DeleteIcon').closest('button'));
  await interaction.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(deletes).toBe(0);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  await interaction.click(screen.getByTestId('DeleteIcon').closest('button'));
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(deletes).toBe(1));
});

test('my recipes empty state opens recipe creation', async () => {
  server.use(http.get(`${API}/recipes`, () => HttpResponse.json({ ...recipeList, recipes: [], total: 0 })));
  const interaction = userEvent.setup(); renderApp(<MyRecipes />);
  await interaction.click(await screen.findByRole('button', { name: 'Create a Recipe' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/recipe/create');
});

test('checkout requires login and terms, resets acceptance when billing changes, and survives request failure', async () => {
  const requests: any[] = [];
  server.use(http.post(`${API}/checkout`, async ({ request }) => { requests.push(await request.json()); return HttpResponse.json({ message: 'Unavailable' }, { status: 500 }); }));
  const interaction = userEvent.setup();
  renderApp(<Checkout selectedTier='premium' onTierSelect={jest.fn()} paymentSectionRef={null} />);
  const proceed = await screen.findByRole('button', { name: 'Proceed to Checkout' });
  expect(proceed).toBeDisabled();
  await interaction.click(screen.getByRole('checkbox'));
  await waitFor(() => expect(proceed).toBeEnabled());
  await interaction.click(screen.getAllByRole('combobox')[1]);
  await interaction.click(screen.getByRole('option', { name: 'Yearly' }));
  expect(proceed).toBeDisabled();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  await interaction.click(screen.getByRole('checkbox'));
  await interaction.click(proceed);
  await waitFor(() => expect(requests).toEqual([{ product: 'premium', interval: 'annual' }]));
  await waitFor(() => expect(proceed).toBeEnabled());
});

test('anonymous checkout cannot proceed even after accepting terms', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({}, { status: 401 })));
  renderApp(<Checkout selectedTier='premium' onTierSelect={jest.fn()} paymentSectionRef={null} />);
  await userEvent.click(screen.getByRole('checkbox'));
  expect(screen.getByRole('button', { name: 'You must be logged in' })).toBeDisabled();
});

test('billing success displays fetched order details and both outcomes return home', async () => {
  window.history.replaceState({}, '', '/billing/success?session_id=cs_test');
  server.use(http.get(`${API}/stripe/order-details/cs_test`, async () => { await delay(30); return HttpResponse.json({ id: 'cs_test', amount_total: 1200, currency: 'eur', created: 1800000000, customer_details: { email: user.email } }); }));
  const interaction = userEvent.setup(); const first = renderApp(<BillingSuccess />, { route: '/billing/success' });
  expect(screen.getByRole('progressbar')).toBeVisible();
  expect(await screen.findByText('Amount Paid: 12.00 EUR')).toBeVisible();
  expect(screen.getByText(`User: ${user.email}`)).toBeVisible();
  await interaction.click(screen.getByRole('button', { name: 'Back to Home' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/');
  first.unmount(); window.history.replaceState({}, '', '/');
  renderApp(<BillingFailure />, { route: '/billing/cancel' });
  expect(screen.getByRole('heading', { name: 'Payment Failed' })).toBeVisible();
  await interaction.click(screen.getByRole('button', { name: 'Back to Home' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/');
});

test('premium tier cards update checkout selection', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, is_premium: false, is_chef: false } })));
  renderApp(<PremiumPage />);
  const interaction = userEvent.setup();
  const buttons = screen.getAllByRole('button').filter(button => /select|choose|start/i.test(button.textContent));
  expect(buttons.length).toBeGreaterThan(0);
  await interaction.click(buttons.at(-1));
  expect(screen.getAllByRole('combobox')[0]).toHaveTextContent('Master Chef');
});

test('course owners can edit and confirm deletion; free users are directed to premium', async () => {
  let deleted = false;
  server.use(http.delete(`${API}/courses/delete/1`, () => { deleted = true; return new HttpResponse(null, { status: 204 }); }));
  const interaction = userEvent.setup(); const first = renderApp(<CourseList courses={[course]} allowModfications />);
  await screen.findByRole('button', { name: 'View Course' });
  await interaction.click(screen.getByTestId('EditIcon').closest('button'));
  expect(screen.getByTestId('location')).toHaveTextContent('/course/edit/1');
  await interaction.click(screen.getByTestId('DeleteIcon').closest('button'));
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(deleted).toBe(true));
  first.unmount();
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, is_premium: false } })));
  renderApp(<CourseList courses={[course]} />);
  await interaction.click(await screen.findByRole('button', { name: 'Get Premium' }));
  expect(screen.getByTestId('location')).toHaveTextContent('/premium');
});
