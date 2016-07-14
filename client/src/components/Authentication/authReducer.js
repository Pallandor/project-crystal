import * as constants from '../../helpers/constants/types';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case constants.AUTH_USER:
      return { ...state, error:'', authenticated: true, user: action.payload };
    case constants.UNAUTH_USER:
      return { ...state, authenticated: false };
    case constants.AUTH_ERROR:
      return { ...state, error: action.payload };
    case constants.FETCH_MESSAGE:
    return { ...state, message: action.payload }
  }
  return state;
}

/*** Selectors for extracting slices of state as required by Components */
export const getUser = state => state.auth.user;
export const getIsAuthenticated = state => state.auth.authenticated;