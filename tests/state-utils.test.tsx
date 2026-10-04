import { act, renderHook } from '@testing-library/react';
import reducer, * as actions from '@/store/slices/recipesSlice';
import appReducer, { setThemeMode, toggleThemeMode } from '@/store/slices/appSlice';
import { formatErrors } from '@/utils/formUtils';
import { recipeThumbnail } from '@/utils/recipeImage';
import useDebounce from '@/utils/useDebounce';

test('recipe state tracks loading, selection, errors and mutations under the current search', () => {
  const soup = { id: '1', title: 'Soup' } as any;
  const cake = { id: '2', title: 'Cake' } as any;
  let state = reducer(undefined, actions.fetchRecipesStart());
  expect(state.isLoading).toBe(true);
  state = reducer(state, actions.fetchRecipesSuccess([soup]));
  expect(state.filteredRecipes).toEqual([soup]);
  state = reducer(state, actions.setCurrentRecipe(soup));
  expect(state.currentRecipe).toEqual(soup);
  state = reducer(state, actions.clearCurrentRecipe());
  expect(state.currentRecipe).toBeNull();
  state = reducer(state, actions.setSearchQuery('CAKE'));
  state = reducer(state, actions.addRecipe(cake));
  expect(state.filteredRecipes).toEqual([cake]);
  state = reducer(state, actions.updateRecipe({ ...cake, title: 'Chocolate cake' }));
  expect(state.filteredRecipes[0].title).toBe('Chocolate cake');
  state = reducer(state, actions.updateRecipe({ id: 'missing', title: 'Ignored' } as any));
  expect(state.recipes).toHaveLength(2);
  state = reducer(state, actions.deleteRecipe('2'));
  expect(state.filteredRecipes).toEqual([]);
  state = reducer(state, actions.fetchRecipesFailure('Offline'));
  expect(state.error).toBe('Offline');
  expect(reducer(state, actions.clearError()).error).toBeNull();
});

test('theme actions set and toggle the preference', () => {
  expect(appReducer({ themeMode: false }, toggleThemeMode()).themeMode).toBe(true);
  expect(appReducer({ themeMode: true }, setThemeMode(false)).themeMode).toBe(false);
});

test.each(['dark', 'light'])('saved %s theme takes priority over the system preference', mode => {
  localStorage.setItem('theme-mode', mode);
  jest.isolateModules(() => {
    const reducer = require('@/store/slices/appSlice').default;
    expect(reducer(undefined, { type: 'init' }).themeMode).toBe(mode === 'dark');
  });
});

test('system dark preference initializes the theme when no preference is saved', () => {
  (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: true });
  jest.isolateModules(() => {
    const reducer = require('@/store/slices/appSlice').default;
    expect(reducer(undefined, { type: 'init' }).themeMode).toBe(true);
  });
});

test.each([
  [{ data: { errors: { title: ['Required'], amount: ['Numeric'] } } }, 'Required Numeric', ['Required', 'Numeric']],
  [{ data: { message: 'Offline' } }, 'Offline', ['Offline']],
  [undefined, 'An error occurred', ['An error occurred']],
])('formats field errors and fallback messages', (error, message, list) => {
  expect(formatErrors(error, 'str')).toBe(message);
  expect(formatErrors(error, 'array')).toEqual(list);
});

test('thumbnail transforms only Unsplash URLs and preserves other query values', () => {
  const transformed = new URL(recipeThumbnail('https://images.unsplash.com/photo?existing=yes&w=1', 300));
  expect(transformed.searchParams.get('w')).toBe('300');
  expect(transformed.searchParams.get('h')).toBe('240');
  expect(transformed.searchParams.get('existing')).toBe('yes');
  expect(recipeThumbnail('/storage/soup.jpg', 300)).toBe('/storage/soup.jpg');
  expect(recipeThumbnail('https://example.com/soup.jpg', 300)).toBe('https://example.com/soup.jpg');
});

test('debounce returns only the latest value and cleans up on unmount', () => {
  jest.useFakeTimers();
  const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 500), { initialProps: { value: 'a' } });
  rerender({ value: 'b' });
  act(() => jest.advanceTimersByTime(300));
  rerender({ value: 'c' });
  act(() => jest.advanceTimersByTime(499));
  expect(result.current).toBe('a');
  act(() => jest.advanceTimersByTime(1));
  expect(result.current).toBe('c');
  unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});
