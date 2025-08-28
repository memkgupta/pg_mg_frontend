import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials, 
  User,
  AuthResponse
} from '../types';
import { login, register, logout, isAuthenticated, getCurrentUser } from '../services/auth';
import { getAuthToken, getRefreshToken } from '@/utils/cookies';

// Define auth action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: AuthResponse }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: User | null; token: string | null; refreshToken: string | null } };

// Initial auth state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

// Create auth context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Auth reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        accessToken: action.payload.tokens.access_token,
        refreshToken: action.payload.tokens.refresh_token,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated =await isAuthenticated();
      
      if (authenticated) {
        const user =await getCurrentUser();
        if(user)
        {
const token = getAuthToken()!
const refreshToken = getRefreshToken()! // since we already performed refresh token it is guarantedd that token will be there

   dispatch({
          type: 'INITIALIZE',
          payload: { user, token, refreshToken },
        });

     
        }
       
      } else {
        dispatch({
          type: 'INITIALIZE',
          payload: { user: null, token: null, refreshToken: null },
        });
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    try {
      const response = await login(credentials);
      
      if (response.success && response.data) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data,
        });
        return true;
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: response.error || 'Invalid credentials',
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Authentication failed',
      });
      return false;
    }
  };

  // Register handler
  const handleRegister = async (credentials: RegisterCredentials): Promise<boolean> => {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    try {
      const response = await register(credentials);
      
      if (response.success && response.data) {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: response.data,
        });
        return true;
      } else {
        dispatch({
          type: 'REGISTER_FAILURE',
          payload: response.error || 'Registration failed',
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: 'Registration failed',
      });
      return false;
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Create memoized context value
  const contextValue = useMemo(
    () => ({
      ...state,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [state]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};