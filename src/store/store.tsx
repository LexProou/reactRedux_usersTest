import { configureStore, Middleware } from '@reduxjs/toolkit';
import usersReducer from '../store/userSlice';
import validationReducer from '../store/validationSlice';
import { validationMiddleware } from './validationMiddleware';


export type RootState = {
  users: ReturnType<typeof usersReducer>;
  validation: ReturnType<typeof validationReducer>;
};


export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    users: usersReducer,
    validation: validationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(validationMiddleware as Middleware),
});

export default store;
