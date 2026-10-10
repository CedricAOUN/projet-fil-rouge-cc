import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import Home from '@/pages/Home/Home';
import ThemeModeToggle from '@/components/Header/ThemeModeToggle';
import getTheme from '@/theme/muiTheme';
import { renderApp } from './render';
import { API, server, recipe, recipeList } from './server';

test('theme control is named, keyboard accessible, and exposes its current state', async () => {
  const toggle = jest.fn();
  const interaction = userEvent.setup();
  const { rerender } = renderApp(<ThemeModeToggle currentTheme='light' onThemeToggle={toggle} />);
  const button = screen.getByRole('button', { name: 'Dark mode', pressed: false });
  button.focus();
  await interaction.keyboard('{Enter}');
  await interaction.keyboard(' ');
  expect(toggle).toHaveBeenCalledTimes(2);
  rerender(<ThemeModeToggle currentTheme='dark' onThemeToggle={toggle} />);
  expect(screen.getByRole('button', { name: 'Dark mode', pressed: true })).toBeVisible();
});

test('hero uses the first free photograph and shares the initial listing request', async () => {
  let listingCalls = 0;
  server.use(http.get(`${API}/recipes`, () => {
    listingCalls++;
    return HttpResponse.json({ ...recipeList, recipes: [
      { ...recipe, id: 2, title: 'Premium dish', is_premium: true },
      { ...recipe, id: 3, title: 'No photograph', image_url: '' },
      recipe,
    ] });
  }));
  renderApp(<Home />);
  const image = await screen.findByRole('figure');
  expect(within(image).getByRole('img', { name: 'Carrot soup' })).toHaveAttribute('src', recipe.image_url);
  expect(listingCalls).toBe(1);
});

test('a failed hero image restores the kitchen note without hiding search or recipes', async () => {
  renderApp(<Home />);
  const figure = await screen.findByRole('figure');
  fireEvent.error(within(figure).getByRole('img'));
  expect(screen.getByText("Today's kitchen note")).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Search recipes' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Carrot soup' })).toBeVisible();
});

test.each(['empty', 'premium only', 'request failure'])('hero has a useful fallback for %s', async scenario => {
  server.use(http.get(`${API}/recipes`, () => scenario === 'request failure'
    ? HttpResponse.json({}, { status: 500 })
    : HttpResponse.json({ ...recipeList, recipes: scenario === 'empty' ? [] : [{ ...recipe, is_premium: true }] })));
  renderApp(<Home />);
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  expect(screen.getByText("Today's kitchen note")).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Search recipes' })).toBeVisible();
});

function luminance(hex: string) {
  const values = hex.replace('#', '').match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
test.each(['light', 'dark'] as const)('%s palette preserves readable text and brand actions', mode => {
  const { palette } = getTheme(mode);
  for (const background of [palette.background.default, palette.background.paper]) {
    expect(contrast(palette.text.primary, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.text.secondary, background)).toBeGreaterThanOrEqual(4.5);
    for (const color of [palette.primary, palette.secondary, palette.premium]) {
      expect(contrast(color.main, background)).toBeGreaterThanOrEqual(4.5);
    }
  }
  for (const color of [palette.primary, palette.secondary, palette.premium]) {
    expect(contrast(color.main, color.contrastText)).toBeGreaterThanOrEqual(4.5);
  }
});
