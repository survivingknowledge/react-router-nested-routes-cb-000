import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import rootReducer from './reducers'
import { Provider } from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './components/App';
import MoviesPage from './containers/MoviesPage';
import MoviesShow from './containers/MoviesShow';
import MoviesNew from './containers/MoviesNew';
import MoviesAbout from './components/MoviesAbout';

const store = createStore(rootReducer);

ReactDOM.render(
  (<Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} />
      <Route path='/movies' component={MoviesPage} />
    </Router>
  </Provider>),
document.getElementById('container'));
