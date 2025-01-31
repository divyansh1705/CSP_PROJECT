import { createContext, useEffect, useReducer } from "react";

// Initial State
const initialState = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  loading: false,
  error: null,
};

// Create Context
export const AuthContext = createContext(initialState);

// Reducer Function
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };

    case "REGISTER_SUCCESS":
      return { user: action.payload || null, loading: false, error: null };

    case "LOGOUT":
      return { user: null, loading: false, error: null };

    case "AUTH_ERROR":
      return { user: null, loading: false, error: action.payload };

    default:
      return state;
  }
};

// AuthContext Provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
