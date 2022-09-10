import React, { useReducer, useState, useCallback, useEffect } from 'react';

import { AuthContext } from './Context';

// const getStorageToken = () => {
//   const localStorageToken = localStorage.getItem('auth_token');
//   return {
//     localStorageToken,
//   };
// };

const calculateAutoLogoutTime = (expireDate) => {
  const currentTimeInMilliseconds = new Date().getTime();
  const expireTimeInMilliseconds = new Date(expireDate).getTime();

  const remainingAutoLogoutTime =
    expireTimeInMilliseconds - currentTimeInMilliseconds;

  return remainingAutoLogoutTime;
};

const getStorageItems = () => {
  const authToken = localStorage.getItem('auth_token');
  const expireToken = localStorage.getItem('expire_token');

  const remainingTime = calculateAutoLogoutTime(expireToken);

  if (remainingTime <= 6000) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expire_token');
    return null;
  }
  return {
    authToken,
    remainingTime,
  };
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const authToken = action.payload;
      let isAuth;
      if (authToken) isAuth = !!authToken;

      return {
        ...state,
        authToken: authToken,
        isAuthenticated: isAuth,
      };
    case 'LOGOUT':
      return {
        ...state,
        authToken: null,
        isAuthenticated: false,
      };
    default:
      const localStorageToken = getStorageItems();
      return {
        authToken: localStorageToken.authToken,
        isAuthenticated: !!localStorageToken.authToken,
      };
  }
};

let logoutTimer = null;

const AuthProvider = ({ children }) => {
  const storageData = getStorageItems();
  let localStorageToken = null;
  if (storageData) localStorageToken = storageData.authToken;
  const [authState, dispatchAuth] = useReducer(authReducer, {
    authToken: localStorageToken,
    isAuthenticated: !!localStorageToken,
  });

  const [loginSuccess, setLoginSuccess] = useState({
    isSuccess: false,
    successMessage: '',
  });

  const [logoutSuccess, setLogoutSuccess] = useState({
    isSuccess: false,
    successMessage: '',
  });

  const logoutHandler = useCallback((logoutAccess) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('expire_token');
    dispatchAuth({ type: 'LOGOUT' });
    if (logoutAccess.isSuccess) {
      setLogoutSuccess({
        isSuccess: logoutAccess.isSuccess,
        successMessage: logoutAccess.successMessage,
      });
    }

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (loginAccess, expireDate) => {
    localStorage.setItem('auth_token', loginAccess?.data?.token);
    localStorage.setItem('expire_token', expireDate);
    dispatchAuth({ type: 'LOGIN', payload: loginAccess?.data?.token });
    setLoginSuccess({
      isSuccess: loginAccess?.status,
      successMessage: loginAccess?.message,
    });

    const autoLogout = calculateAutoLogoutTime(expireDate);
    logoutTimer = setTimeout(logoutHandler, autoLogout);
  };

  useEffect(() => {
    if (storageData) {
      logoutTimer = setTimeout(logoutHandler, storageData.remainingTime);
    }
  }, [storageData, logoutHandler]);

  const value = {
    authToken: authState.authToken,
    isAuthenticated: authState.isAuthenticated,
    loginSuccess,
    setLoginSuccess,
    logoutSuccess,
    setLogoutSuccess,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
