# Redux Store Setup

This project uses Redux Toolkit for state management. Here's how to use it:

## Structure

```
src/store/
├── store.ts           # Main store configuration
├── index.ts           # Store exports
├── hooks.ts           # Custom hooks for Redux operations
└── slices/
    ├── counterSlice.ts    # Example counter slice
    ├── userSlice.ts       # User authentication slice
    └── recipesSlice.ts    # Recipes management slice
```

## Usage

### 1. Using typed hooks

Instead of the regular `useSelector` and `useDispatch`, use the typed versions:

```tsx
import { useAppSelector, useAppDispatch } from '@/store';

const MyComponent = () => {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();
  
  // ...
};
```

### 2. Using custom hooks

For complex operations, use the custom hooks:

```tsx
import { useAuth, useRecipes } from '@/store/hooks';

const MyComponent = () => {
  const { currentUser, login, logout } = useAuth();
  const { recipes, fetchRecipes, searchRecipes } = useRecipes();
  
  // ...
};
```

### 3. Creating new slices

To create a new slice:

1. Create a new file in `src/store/slices/`
2. Define your state interface
3. Create the slice with `createSlice`
4. Export actions and reducer
5. Add the reducer to `store.ts`
6. Export actions from `index.ts`

Example:

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyState {
  data: string[];
  loading: boolean;
}

const initialState: MyState = {
  data: [],
  loading: false,
};

const mySlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setData, setLoading } = mySlice.actions;
export default mySlice.reducer;
```

## Available Slices

### Counter Slice
- `increment()` - Increment counter by 1
- `decrement()` - Decrement counter by 1
- `incrementByAmount(amount)` - Increment by specific amount
- `reset()` - Reset counter to 0

### User Slice
- `loginStart()` - Set loading state for login
- `loginSuccess(user)` - Set user data on successful login
- `loginFailure(error)` - Set error on login failure
- `logout()` - Clear user data
- `updateUser(userData)` - Update user profile
- `clearError()` - Clear any error messages

### Recipes Slice
- `fetchRecipesStart()` - Set loading state
- `fetchRecipesSuccess(recipes)` - Set recipes data
- `fetchRecipesFailure(error)` - Set error state
- `setCurrentRecipe(recipe)` - Set currently selected recipe
- `clearCurrentRecipe()` - Clear selected recipe
- `addRecipe(recipe)` - Add new recipe
- `updateRecipe(recipe)` - Update existing recipe
- `deleteRecipe(id)` - Remove recipe
- `setSearchQuery(query)` - Filter recipes by search

## API Integration

The custom hooks in `hooks.ts` show examples of how to integrate with your API. Replace the example API calls with your actual endpoints.

## DevTools

Redux DevTools are enabled in development mode for easier debugging.
