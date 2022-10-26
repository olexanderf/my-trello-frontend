import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

const store = configureStore({
   reducer: rootReducer,
})

export default store;
export type AppState = ReturnType<typeof rootReducer>;

