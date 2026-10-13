import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { recipeApi } from '@/api/recipeApi';
import { courseApi } from '@/api/courseApi';
import { plansApi } from '@/api/plansApi';
import { sessionEnded } from './slices/userSlice';

export function createSessionListener() {
  const listener = createListenerMiddleware();
  listener.startListening({
    matcher: isAnyOf(authApi.endpoints.logout.matchFulfilled, authApi.endpoints.logout.matchRejected),
    effect: (action, { dispatch }) => {
      if (authApi.endpoints.logout.matchRejected(action) && action.payload?.status !== 401) return;
      dispatch(sessionEnded());
      // Stop old authenticated responses from restoring data after sign-out.
      for (const api of [authApi, recipeApi, courseApi, plansApi]) {
        for (const query of dispatch(api.util.getRunningQueriesThunk())) query.abort();
        dispatch(api.util.resetApiState());
      }
    },
  });
  return listener;
}
