import { AnyAction, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedDispatch = ThunkDispatch<AppState, any, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, AnyAction>;
