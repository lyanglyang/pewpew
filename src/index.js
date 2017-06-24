import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import GameOver from './GameOver';
import { BrowserRouter, Route } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<BrowserRouter>
  <div>
    <Route exact path="/" component={App}/>
    <Route path="/login" component={Login}/>
    <Route path="/gameover" component={GameOver}/>
  </div>

</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
