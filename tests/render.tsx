import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import getTheme from '@/theme/muiTheme';
import app from '@/store/slices/appSlice';
import user from '@/store/slices/userSlice';
import recipes from '@/store/slices/recipesSlice';
import { authApi } from '@/api/authApi';
import { recipeApi } from '@/api/recipeApi';
import { courseApi } from '@/api/courseApi';
import { plansApi } from '@/api/plansApi';
export function makeStore() {
  return configureStore({ reducer: { app, user, recipes, authApi: authApi.reducer, recipeApi: recipeApi.reducer, courseApi: courseApi.reducer, plansApi: plansApi.reducer }, middleware: get => get().concat(authApi.middleware, recipeApi.middleware, courseApi.middleware, plansApi.middleware) });
}
function Location() { return <output data-testid="location">{useLocation().pathname}</output>; }
export function renderApp(ui: React.ReactNode, { route = '/', store = makeStore() } = {}) {
  return { store, ...render(<Provider store={store}><MemoryRouter initialEntries={[route]}><ThemeProvider theme={getTheme('light')}>{ui}<Location /></ThemeProvider></MemoryRouter></Provider>) };
}
