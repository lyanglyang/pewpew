import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import GameOver from './GameOver';
import NotFoundRoute from './NotFoundRoute';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<Router>
  <Switch>
    <Route exact path="/" component={App}/>
    <Route path="/login" component={Login}/>
    <Route path="/gameover" component={GameOver}/>
    <Route path="*" component={NotFoundRoute}/>
  </Switch>
</Router>, document.getElementById('root'));

registerServiceWorker();
