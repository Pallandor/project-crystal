import { createStore, applyMiddleware } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import io from 'socket.io-client';

import reducers from '../helpers/rootReducer/rootReducer';

let socket = io.connect();
let socketIoMiddleware = createSocketIoMiddleware(socket, '../server/'); // if this is apath, may need modifying..
const createStoreWithMiddleware = applyMiddleware(reduxThunk, socketIoMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers, window.devToolsExtension && window.devToolsExtension());

export default store;