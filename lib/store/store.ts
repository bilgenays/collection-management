import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import collectionsReducer from './collectionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;