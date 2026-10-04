import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { http, HttpResponse, delay } from 'msw';
import SingleRecipePage from '@/pages/SingleRecipePage/SingleRecipePage';
import RecipeCreateForm from '@/pages/RecipeCreateForm/RecipeCreateForm';
import AdvancedRecipeSearch from '@/components/AdvancedRecipeSearch/AdvancedRecipeSearch';
import { renderApp } from './render';
import { API, server, recipe, recipeList, user } from './server';

test('recipe details load ingredients and instructions; toggles refresh detail; AI loads on demand', async () => {
  let liked = false; let favorited = false; let aiCalls = 0;
  server.use(
    http.get(`${API}/recipes/1`, async () => { await delay(30); return HttpResponse.json({ data: { ...recipe, likes: { count: liked ? 3 : 2, is_liked_by_user: liked }, favorites: { count: favorited ? 1 : 0, is_favorited_by_user: favorited } } }); }),
    http.post(`${API}/recipes/1/like`, () => { liked = !liked; return HttpResponse.json({}); }),
    http.post(`${API}/recipes/1/favorite`, () => { favorited = !favorited; return HttpResponse.json({}); }),
    http.get(`${API}/recipes/1/ai`, async () => { aiCalls++; await delay(50); return HttpResponse.json({ data: { suggestion: 'Roast carrots.' } }); }),
  );
  const interaction = userEvent.setup();
  renderApp(<Routes><Route path='/recipe/:id' element={<SingleRecipePage />} /></Routes>, { route: '/recipe/1' });
  expect(screen.getByRole('progressbar')).toBeVisible();
  expect(await screen.findByRole('heading', { name: 'Carrot soup' })).toBeVisible();
  expect(screen.getByText(/Carrot x 2 pcs/)).toBeVisible();
  expect(screen.getByText(/Chop carrots/)).toBeVisible();
  await waitFor(() => expect(screen.getByTestId('ThumbUpOffAltIcon').closest('button')).toBeEnabled());
  await interaction.click(screen.getByTestId('ThumbUpOffAltIcon').closest('button'));
  await waitFor(() => expect(screen.getByTestId('ThumbUpAltIcon')).toBeVisible());
  await interaction.click(screen.getByTestId('FavoriteBorderIcon').closest('button'));
  await waitFor(() => expect(screen.getByTestId('FavoriteIcon')).toBeVisible());
  expect(aiCalls).toBe(0);
  await interaction.click(screen.getByRole('button', { name: 'Ask AI' }));
  expect(await screen.findByText('Roast carrots.')).toBeVisible();
  expect(aiCalls).toBe(1);
  await interaction.click(screen.getByTestId('CloseIcon').closest('button'));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test.each([401, 403, 404, 500])('recipe HTTP %s shows its error page', async status => {
  server.use(http.get(`${API}/recipes/1`, () => HttpResponse.json({ message: 'Error' }, { status })));
  renderApp(<Routes><Route path='/recipe/:id' element={<SingleRecipePage />} /></Routes>, { route: '/recipe/1' });
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByRole('heading', { name: 'Carrot soup' })).not.toBeInTheDocument();
  expect(screen.getByText(String(status))).toBeVisible();
  expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
});

test('search waits for debounce and applies recipe type and ingredient filters', async () => {
  const queries: URLSearchParams[] = [];
  server.use(http.get(`${API}/recipes`, ({ request }) => { queries.push(new URL(request.url).searchParams); return HttpResponse.json(recipeList); }));
  const interaction = userEvent.setup();
  renderApp(<AdvancedRecipeSearch />);
  await screen.findByText('Carrot soup');
  const search = screen.getByPlaceholderText('Search for recipes...');
  await interaction.type(search, 'Carrot');
  expect(queries.at(-1).get('search')).not.toBe('Carrot');
  await waitFor(() => expect(queries.at(-1).get('search')).toBe('Carrot'));
  await interaction.click(screen.getByRole('button', { name: /premium/i }));
  await waitFor(() => expect(queries.at(-1).get('recipeType')).toBe('premium'));
  const ingredient = screen.getByRole('combobox', { name: /ingredient/i });
  await interaction.click(ingredient);
  await interaction.click(await screen.findByRole('option', { name: 'Carrot' }));
  await waitFor(() => expect(queries.at(-1).get('ingredients')).toBe('Carrot'));
});

test('search displays an empty result and navigates from a recipe card', async () => {
  const interaction = userEvent.setup();
  const { unmount } = renderApp(<AdvancedRecipeSearch />);
  await interaction.click(await screen.findByRole('button', { name: /view/i }));
  expect(screen.getByTestId('location')).toHaveTextContent('/recipe/1');
  unmount();
  server.use(http.get(`${API}/recipes`, () => HttpResponse.json({ ...recipeList, recipes: [], total: 0 })));
  renderApp(<AdvancedRecipeSearch />);
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByText('Carrot soup')).not.toBeInTheDocument();
});

test('recipe form validates ingredients, adds/removes rows and submits an uploaded image', async () => {
  let fields: FormData;
  server.use(http.post(`${API}/recipes/create`, async ({ request }) => { fields = await request.formData(); return HttpResponse.json({ data: recipe }); }));
  const interaction = userEvent.setup();
  renderApp(<RecipeCreateForm />);
  await screen.findByText('Mark recipe as Premium');
  await interaction.click(screen.getByRole('button', { name: 'Submit Recipe' }));
  expect(await screen.findByText('Title is required')).toBeVisible();
  expect(screen.getByText('Ingredient name is required')).toBeVisible();
  await interaction.type(screen.getByPlaceholderText('Title'), 'Soup');
  await interaction.type(screen.getByPlaceholderText('Instructions'), 'Boil');
  await interaction.type(screen.getByPlaceholderText('Description'), 'Warm');
  await interaction.type(screen.getByPlaceholderText('Ingredient Name'), 'Carrot');
  await interaction.type(screen.getByPlaceholderText('Amount'), 'abc');
  await interaction.click(screen.getByRole('button', { name: 'Submit Recipe' }));
  expect(await screen.findByText('Amount must be a number')).toBeVisible();
  await interaction.clear(screen.getByPlaceholderText('Amount')); await interaction.type(screen.getByPlaceholderText('Amount'), '2');
  await interaction.click(screen.getByRole('combobox'));
  await interaction.click(screen.getByRole('option', { name: 'Pieces' }));
  await interaction.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getAllByPlaceholderText('Ingredient Name')).toHaveLength(2);
  await interaction.click(screen.getAllByRole('button', { name: 'X' })[1]);
  expect(screen.getAllByPlaceholderText('Ingredient Name')).toHaveLength(1);
  const input = document.querySelector('input[type=file]') as HTMLInputElement;
  await interaction.upload(input, new File(['photo'], 'soup.jpg', { type: 'image/jpeg' }));
  expect(await screen.findByAltText('Preview of your recipe photo')).toBeVisible();
  await interaction.click(screen.getByRole('button', { name: 'Remove Image' }));
  expect(screen.queryByAltText('Preview of your recipe photo')).not.toBeInTheDocument();
  await interaction.upload(input, new File(['photo'], 'soup.jpg', { type: 'image/jpeg' }));
  await interaction.click(screen.getByRole('button', { name: 'Submit Recipe' }));
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/recipe/1'));
  expect(fields.get('ingredients[0][quantity]')).toBe('2');
  expect((fields.get('image_file') as File).name).toBe('soup.jpg');
});

test('recipe editing pre-fills data, sends an update and rejects another owner', async () => {
  let body: FormData;
  server.use(http.put(`${API}/recipes/edit/1`, async ({ request }) => { body = await request.formData(); return HttpResponse.json({ data: recipe }); }));
  const interaction = userEvent.setup();
  const { unmount } = renderApp(<Routes><Route path='/recipe/edit/:id' element={<RecipeCreateForm />} /></Routes>, { route: '/recipe/edit/1' });
  expect(await screen.findByDisplayValue('Carrot soup')).toBeVisible();
  await interaction.clear(screen.getByPlaceholderText('Title')); await interaction.type(screen.getByPlaceholderText('Title'), 'New soup');
  await interaction.click(screen.getByRole('button', { name: 'Confirm' }));
  await waitFor(() => expect(body?.get('title')).toBe('New soup'));
  unmount();
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user, id: 2 } })));
  renderApp(<Routes><Route path='/recipe/edit/:id' element={<RecipeCreateForm />} /></Routes>, { route: '/recipe/edit/1' });
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
});
