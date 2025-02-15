// validationSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определение состояния валидации
interface ValidationState {
  errors: Record<string, string>;
  isValid: boolean;
}

const initialState: ValidationState = {
  errors: {},
  isValid: true,
};

// Создание слайса для управления ошибками валидации
const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    // Устанавливаем ошибки валидации
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
      state.isValid = Object.keys(action.payload).length === 0;
    },
    // Очищаем ошибки валидации
    clearErrors: (state) => {
      state.errors = {};
      state.isValid = true;
    }
  }
});

export const { setErrors, clearErrors } = validationSlice.actions;
export default validationSlice.reducer;
