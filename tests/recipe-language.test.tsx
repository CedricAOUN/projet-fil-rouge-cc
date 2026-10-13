import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import AdvancedRecipeSearch from '@/components/AdvancedRecipeSearch/AdvancedRecipeSearch';
import Favorites from '@/pages/Favorites/Favorites';
import MyRecipes from '@/pages/MyRecipes/MyRecipes';
import RecipeCreateForm from '@/pages/RecipeCreateForm/RecipeCreateForm';
import i18n from '@/i18n';
import { renderApp } from './render';
import { API, server, recipe, recipeList, user } from './server';

afterEach(async () => { await act(async () => { await i18n.changeLanguage('en'); }); });

test('switching interface language preserves an unfinished recipe form', async () => {
  renderApp(<RecipeCreateForm />);
  await userEvent.type(screen.getByPlaceholderText('Title'), 'Unfinished recipe');
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(screen.getByDisplayValue('Unfinished recipe')).toBeVisible();
  expect(screen.getByRole('combobox', { name: /^Langue de la recette/ })).toHaveTextContent(i18n.t('English'));
});

test.each([AdvancedRecipeSearch, MyRecipes])('recipe listings follow the selected app language', async Component => {
  const languages: string[] = [];
  server.use(http.get(`${API}/recipes`, ({ request }) => {
    const language = new URL(request.url).searchParams.get('language');
    languages.push(language);
    return HttpResponse.json({ ...recipeList, recipes: [{ ...recipe, language,
      title: language === 'fr' ? 'Soupe française' : 'English soup' }] });
  }));
  renderApp(<Component />);
  expect(await screen.findByRole('heading', { name: 'English soup' })).toBeVisible();
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(await screen.findByRole('heading', { name: 'Soupe française' })).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'English soup' })).not.toBeInTheDocument();
  expect(languages).toContain('en');
  expect(languages).toContain('fr');
});

test('favorites follow the selected language without removing saved recipes', async () => {
  server.use(http.get(`${API}/users/me`, () => HttpResponse.json({ data: { ...user,
    favorite_recipes: [{ ...recipe, language: 'en', title: 'English favorite' },
      { ...recipe, id: 2, language: 'fr', title: 'Favori français' }],
  } })));
  renderApp(<Favorites />);
  expect(await screen.findByRole('heading', { name: 'English favorite' })).toBeVisible();
  expect(screen.queryByText('Favori français')).not.toBeInTheDocument();
  await act(async () => { await i18n.changeLanguage('fr'); });
  expect(await screen.findByRole('heading', { name: 'Favori français' })).toBeVisible();
  expect(screen.queryByText('English favorite')).not.toBeInTheDocument();
});
