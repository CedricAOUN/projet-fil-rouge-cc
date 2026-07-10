import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import your slices here
import userSlice from './slices/userSlice';
import recipesSlice from './slices/recipesSlice';
import appSlice from './slices/appSlice';
import { authApi } from '@/api/authApi';
import { userApi } from '@/api/userApi';
import { recipeApi } from '@/api/recipeApi';
import { courseApi } from '@/api/courseApi';
import { plansApi } from '@/api/plansApi';

export const store = configureStore({
  reducer: {
    app: appSlice,
    user: userSlice,
    recipes: recipesSlice,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [recipeApi.reducerPath]: recipeApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      recipeApi.middleware,
      courseApi.middleware,
      plansApi.middleware,
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
