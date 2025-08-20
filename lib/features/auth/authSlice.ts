import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true
      state.error = null
    },
    signUpSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    signUpError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  signUpStart,
  signUpSuccess,
  signUpError,
  loginStart,
  loginSuccess,
  loginError,
  logout,
  clearError,
} = authSlice.actions

export default authSlice.reducer