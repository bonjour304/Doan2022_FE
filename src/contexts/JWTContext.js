import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import { useNavigate } from 'react-router';
import { loginSquid, logoutSquid } from '../service/authService';
import { PATH_DASHBOARD, PATH_AUTH } from '../routes/paths';
import { restAPI } from '../config/api';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, data } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user: data
    };
  },
  LOGIN: (state, action) => {
    const { data } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user: data
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});
console.log(AuthContext);
AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await restAPI.get('/user/me');

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            data: response.data.data.data
          }
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };
    initialize();
  }, []);

  const login = async (account, password) => {
    const response = await loginSquid(account, password);
    const { data } = response.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        data
      }
    });
    navigate(PATH_DASHBOARD.rule.list);
  };

  const logout = async (payload) => {
    const response = await logoutSquid(payload);
    const { data } = response.data;
    dispatch({ type: 'LOGOUT', payload: { data } });
    navigate(PATH_AUTH.login);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
