import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';

import App from './components/App/App';
import Signin from './components/Authentication/Signin';
import Signout from './components/Authentication/Signout';
import Signup from './components/Authentication/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Quiz from './components/Quiz/Quiz';
import TodoList from './components/ToDo/TodoList';
import requireAuth from './components/Authentication/RequireAuth';
import LandingPage from './components/LandingPage/LandingPage';
import Meter from './components/Meter/Meter';
import Calendar from './components/Calendar/Calendar';

import io from 'socket.io-client';
let socket = io.connect();
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

import reducers from './helpers/rootReducer/rootReducer';
import { AUTH_USER } from './helpers/constants/types';

import './index.css';

const createStoreWithMiddleware = applyMiddleware(reduxThunk, socketIoMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers, window.devToolsExtension && window.devToolsExtension());

const token = localStorage.getItem('token');
// If we have a token then consider user to be signed in
if (token) {
  // need to update application state
  console.log('----- before sending token up, it is: ');
  console.log(token); 
  console.log('-------')
  axios.post('/verify', {
    token: token,
  })
    .then(response => {
      if (!response.data.success) {
        console.log(`The passed message from server, which you could dispatch using an AUTH USER error in other instances is: ${response.data.data}`);
      } else {
        console.log('dispatching response.data to store...');
        console.dir(response.data); 
        console.log('-------------------');
        store.dispatch({ type: AUTH_USER, payload: response.data });
        window.location = 'http://localhost:3000/dashboard'; // it doesnet success, if your clearing user tables on erver populateDb
      }
    })
    .catch(err => console.log('Silently fail other errors re: JWT localStorage login attempt'));
  // store.dispatch({ type: AUTH_USER });
}

injectTapEventPlugin();

// The provider Communicates with the connected components *
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={LandingPage} />
        <Route path="signin" component={Signin} />
        <Route path="signout" component={Signout} />
        <Route path="signup" component={Signup} />
        <Route path="dashboard" component={requireAuth(Dashboard)} />
        <Route path="meter" component={Meter} />
        <Route path="quiz" component={Quiz} />
        <Route path="calendar" component={Calendar} />
        <Route path="todo" component={TodoList} />
      </Route>
    </Router>
  </Provider>, document.getElementById('app'));
