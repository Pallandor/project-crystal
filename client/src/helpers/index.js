import axios from 'axios';
import injectTapEventPlugin from 'react-tap-event-plugin';
import each from 'lodash/each';
import { AUTH_USER } from './constants/types';

export const getTokenFromStorage = () => localStorage.getItem('token');
export const initializeAuth = (store) => {
  const token = getTokenFromStorage();
  if (token) {
    // RF: move to APIs folder in client dir
    axios.post('/verify', { token })
      .then(response => {
        store.dispatch({ type: AUTH_USER, payload: response.data });
      });
  }
};
export const initializeMaterialUIDependency = () => injectTapEventPlugin();
export const bindThis = (thisRef, functionsToBind) => {
  each(functionsToBind, (functionToBind => {
    thisRef[functionToBind] = thisRef[functionToBind].bind(thisRef);
  })); 
};
