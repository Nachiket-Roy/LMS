import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authApi from '../services/authApi';

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  const initializeAuth = useCallback(async () => {
    const publicRoutes = ['/', '/about', '/contact', '/faqs', '/collection'];
    const currentPath = window.location.pathname;
    const hasAccessToken = document.cookie.includes('accessToken=');

    // Skip only if no token AND on a public route
    if (publicRoutes.includes(currentPath) && !hasAccessToken) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userData = await authApi.checkAuth();

      if (userData?.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData.user }
        });

        // If logged in and on public route, redirect based on role
        if (publicRoutes.includes(currentPath)) {
          const role = userData.user.role;
          if (role === 'user') window.location.href = '/user';
          else if (role === 'librarian') window.location.href = '/librarian';
          else if (role === 'admin') window.location.href = '/admin';
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = await authApi.checkAuth();
      if (userData?.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData.user }
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authApi.login(credentials);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user
        }
      });

      return { success: true, redirectTo: response.redirectTo };
    } catch (error) {
      let errorMsg = error.message;
      if (error.response) {
        errorMsg = error.response.data?.message || errorMsg;
        if (error.response.status === 429) {
          errorMsg = 'Too many attempts. Please try again later.';
        }
      }

      dispatch({
        type: 'LOGIN_FAILURE',
        payload: { error: errorMsg }
      });

      return { success: false, error: errorMsg };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.register(userData);

      if (response.autoLogin) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user
          }
        });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, user: response.user, autoLogin: response.autoLogin };
    } catch (error) {
      let errorMsg = error.message;
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMsg };
    }
  }, []);

  const logout = useCallback(async (allDevices = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authApi.logout(allDevices);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    register,
    clearError,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced HOC for protected routes with role-based access
export const withAuth = (WrappedComponent, { allowedRoles = [], redirectTo = '/' } = {}) => {
  return (props) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
      return <div className="auth-loading">Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      window.location.href = redirectTo;
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return (
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Enhanced Route guard component
export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/',
  loadingComponent = <div>Loading...</div>,
  unauthorizedComponent = <div>Unauthorized</div>
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return loadingComponent;
  }

  if (!isAuthenticated) {
    window.location.href = redirectTo;
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return unauthorizedComponent;
  }

  return children;
};