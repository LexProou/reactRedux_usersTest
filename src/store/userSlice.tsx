import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types/User';


interface UserState {
  activeUsers: User[]; 
  archivedUsers: User[]; 
  loading: boolean; 
  error: string | null; 
  message: string; 
  open: boolean; 
  user: User | null; 
}

// Начальное состояние
const initialState: UserState = {
  activeUsers: [],
  archivedUsers: [],
  loading: false,
  error: null,
  message: '',
  open: false,
  user: null,
};

// Получение списка пользователей
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
  return response.data.slice(0, 6); 
});

// Получение одного пользователя по ID
export const fetchUser = createAsyncThunk<User, string>('user/fetchUser', async (userId) => {
  const response = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return response.data;
});

// Сохранение изменений пользователя
export const saveUser = createAsyncThunk<User, User>('user/saveUser', async (user) => {
  const response = await axios.put<User>(`https://jsonplaceholder.typicode.com/users/${user.id}`, user);
  return response.data; 
});


const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Обновление списка пользователей
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.activeUsers = action.payload;
    },
    // Архивирование пользователя
    archiveUser: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      const user = state.activeUsers.find(u => u.id === userId);
      if (user) {
        user.isArchived = true;
        state.archivedUsers.push(user);
        state.activeUsers = state.activeUsers.filter(u => u.id !== userId);
      }
    },
    // Восстановление пользователя
    unarchiveUser(state, action: PayloadAction<number>) {
      const userId = action.payload;
      const userIndex = state.archivedUsers.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        const [user] = state.archivedUsers.splice(userIndex, 1);
        user.isArchived = false;  
        state.activeUsers.push(user);
      }
    },
    // Скрытие пользователя
    hideUser: (state, action: PayloadAction<number>) => {
      state.activeUsers = state.activeUsers.filter(u => u.id !== action.payload);
    },

    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  
    setOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.activeUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить пользователя';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось загрузить пользователя';
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.message = 'Изменения сохранены!';
        state.open = true;
        const updatedUser = action.payload;
        state.activeUsers = state.activeUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось загрузить пользователя';
      });
  },
});

export const { setUsers, archiveUser, unarchiveUser, hideUser, setMessage, setOpen, setUser } = userSlice.actions;
export default userSlice.reducer;