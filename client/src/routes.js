import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App/App';
import Signin from './components/Authentication/Signin';
import Signout from './components/Authentication/Signout';
import Signup from './components/Authentication/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Quiz from './components/Quiz/Quiz';
import TodoList from './components/ToDo/TodoList';
import DateNight from './components/DateNight/DateNight';
import requireAuth from './components/Authentication/RequireAuth';
import LandingPage from './components/LandingPage/LandingPage';
import LearnMore from './components/LandingPage/LearnMore';
import Meter from './components/Meter/Meter';
import Calendar from './components/Calendar/Calendar';

export default (
      <Route path="/" component={App}>
        <IndexRoute component={LandingPage} />
        <Route path="signin" component={Signin} />
        <Route path="signout" component={Signout} />
        <Route path="signup" component={Signup} />
        <Route path="learnmore" component={LearnMore} />
        <Route path="dashboard" component={requireAuth(Dashboard)} />
        <Route path="meter" component={Meter} />
        <Route path="quiz" component={Quiz} />
        <Route path="calendar(/:eventId)" component={Calendar} />
        <Route path="todo" component={TodoList} />
        <Route path="dateNight" component={DateNight} />
      </Route>
      );