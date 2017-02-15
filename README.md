# Nested Routes in React Router

## Objectives

1. Describe how __React Router__ allows nesting routes
2. Describe the benefits of rendering a route as a tree of components
3. Explain how to set up a redirect with __React Router__
4. Explain how to access parameters in __React Router__
5. Explain how to organize routes in a standard __React & React Router__ application
6. Describe how to set up a default component for a given path"


## Overview

In the previous lab, we briefly looked at setting up routes. We created a main component, __App__, which rendered a __NavBar__ component which contained __Links__ for our routes. In this lesson, we'll take this concept a step further and look at how we might set up other components as "nested routes" of their parents.

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about GMail? What about YouTube? All of those apps use some version of a "Master-Detail" interface. You'll have a list of items on portion of the screen, such as messages, videos, or emails, and some more detailed display of that item on another portion of the screen. Clicking on a new item in the list changes which item we have selected.

We can implement a version of this without __React Router__, but it's a bit of a pain - we have to manually change the selected item and pass it down into a different component. Also, when the selected item changes, it's not actually reflected in the URL. This is a big bummer - it means that there's no way to me to send a link directly to one item to someone else.

## Nesting

By using __React Router__, we can make our components children of each other. Take YouTube for example. Let's pretend that visiting `/videos` displays a list of videos. Clicking on any video keeps our list of videos on the page, but also displays details on the selected video. This should be updated by the URL - the URL should have changed to `/videos/:id`. The VideoDetail in this case is a 'Nested Component' of '/videos' - it will always have the list rendered before it.

## Code Along

### Rendering Our List

Let's start out with our __MoviesPage__ component that connects to the store and renders out a __MoviesList__. The movie list is presentation and just renders out. Explain that we're using Bootstrap columns for sizing but we could do this ourselves if we wanted to.

To begin, let's take a look at our starter code. First, we have a __MoviesPage__ component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in __Redux__ is to refer to these as __container__ components and put them in a __containers__ directory. Here we've named our container __MoviesPage__, a common naming pattern for container components.

```javascript
// ./src/containers/MoviesPage.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMovies } from '../actions'
import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {

  componentDidMount() {
    this.props.fetchMovies();
  }

  render() {
    return (
      <div>
        <MoviesList movies={this.props.movies} />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    movies: state.movies
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMovies: bindActionCreators(fetchMovies, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
```

We're using the __mapStateToProps()__ function to pull the movies property from our state and attach it to the props of this component. We're also pulling the __fetchMovies()__ action and attaching that to props as well, that way when our component mounts, we can fire off the action to get it some data.

Finally, our __MoviesPage__ container just renders out a __MoviesList__ component. Our __MoviesList__ component is purely presentational - here, we can decide what kind of styling to use.

```javascript
// ./src/components/MoviesList.js

import React from 'react';

export default (props) => {
  const movies = props.movies.map(movie => <li key={movie.id}>{movie.title}</li>);

  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies}
        </ul>
      </div>
    </div>
  );
};
```

Our __MoviesList__ component will be our 'master' list on the left side. We're using Bootstrap's column classes to define how  much of the screen our __MoviesList__ should take up, but we could easily write our own classes or use the columns from a different framework.

### Linking to the Show

Right now, we're using React Router to display the __MoviesPage__ component when the url is `/movies`. Let's add in our first nested route so that when we go to '/movies/:id' it should display details about a given movie.

First, let's create a `MoviesShow` component. This component will need to connect to the store in order to figure out which Movie it should render, so let's put it in our `containers` directory.

```javascript
// ./src/containers/MoviesShow.js

import React from 'react';

export default (props) => {
  return(
    <div>
      Movies Show Component!
    </div>
  );
}
```

Next, let's add a nested route in our `./src/index.js` file.

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import rootReducer from './reducers'
import { Provider } from 'react-redux';

import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './components/App'
import MoviePage from './containers/MoviePage'
import MoviesShow from './containers/MoviesShow'
...

ReactDOM.render(
  (<Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviePage} >
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```

Great, now, let's add links in our __MoviesList__ component so that we can click on different movies. To do this, we'll use the __Link__ component that __React Router__ gives us.

```javascript
// ./src/components/MoviesList.js

import React from 'react';
import { Link } from 'react-router';

export default (props) => {
  const movies = props.movies.map(movie => <li key={movie.id}><Link to={`/movies/${movie.id}`}>{movie.title}</Link></li>);

  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies}
        </ul>
      </div>
    </div>
  );
};
```
Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any differnet content. What gives? The problem is, we've setup a child component, but we never actually said *where* it should render on the screen.

In React, we can dynamically render child components by pulling them off of the __children__ property on our components props. Let's update our __MoviesPage__ component so that it renders it's child components underneath the __MoviesList__

```javascript
// ./src/containers/MoviesPage.js

...

render(){
  return(
    <div>
      <MoviesList movies={ this.props.movies } />
      { this.props.children }
    </div>)
}

...
```

Now, any child components provided by __React Router__ will be rendered there. Remember, child components are defined by the nested structure of our routes under __Router__. Awesome! Refresh again - now we see our __MoviesShow__ component displayed at our dynamic route.

### Dynamically finding the show

We've successfully created out first nested route. Next, let's wire up our __MoviesShow__ component to dynamically render the info about the movie based on the URL. The steps to do so will be as follows:

1. Connect our __MoviesShow__ component to the store so that it knows about the list of movies.
2. Find the movie where the movie's id matches the `:id` param of our route.
3. Make that movie available to the component via __props__.

First, let's import __connect()__ and use our __mapStateToProps()__ function to let our __MoviesShow__ component know about changes to the store.

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';

class MoviesShow extends Component {

  render(){
    return (
      <div>
        Movies Show Component
      </div>
    )
  }
}

function mapStateToProps(state){

}
export default connect(mapStateToProps)(MoviesShow);
```

Now, in `mapStateToProps`, we'd like to access the `:id` supplied to us via the URL. We need to understand two things for this to work.

1. `mapStateToProps` takes a second argument of props that were passed directly to the component. We usually refer to these as `ownProps`
2. React Router will supply any dynamic pieces of the URL to the component via an object called `routeParams`

This means that we can access the `:id` from the URL via `routeParams` on our `ownProps`

```javascript
// ./src/components/MoviesShow.js 

import React from 'react';
import { connect } from 'react-redux'; // code change

const MoviesShow = (props) => { // code change
  return(
    <div>
      Movies Show Component!
    </div>
  );
}

/* add mapStateToProps function */
const mapStateToProps = (state) => {

}

export default connect(mapStateToProps)(MoviesShow); // use connect() function
```

Note that we have a property called __id__ because of the way we defined our route. If we defined our dynamic portion to be `/movies/:dog`, we'd have a __dog__ property in our __routeParams__

Now, we can simply iterate through our list of movies and return the one where our __routeParams.id__ matches.

```javascript
// ./src/containers/MoviesShow.js

import React from 'react';
import { connect } from 'react-redux';

const MoviesShow = (props) => {
  return(
    <div className="col-md-8">
      {props.movie.title}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    movie: state.movies.find(movie => movie.id == ownProps.routeParams.id)
  }
};

export default connect(mapStateToProps)(MoviesShow);
```

Now, assuming we find a movie, we simply add it to the props. To account for the case where a movie isn't found, we return just an empty object as the movie.

### Adding the New Option

Let's add our second nested route. Going to '/movies/new' should display the __MoviesNew__ component.

We've already created out __MoviesNew__ component file so we now need to connect that to our __Router__. Our __MoviesNew__ component is simply a form that dispatches the __addMovie()__ action on submission. Let's add that as a __Route__ component, the same way we did with our __MoviesShow__ component.

```javascript
// ./src/index.js

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
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviesPage}>
          <Route path="/movies/new" component={MoviesNew} />
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```

Note that we **must** define our `/movies/new` route first. Why? Because otherwise, the `/:id` route handler would catch it first and assing `"new"` to be the id.

Let's add a link to our Movies List to add a new movie.

```javascript
// ./src/components/MoviesList

import React from 'react';
import { Link } from 'react-router';

export default (props) => {
  const movies = props.movies.map(movie => <li key={movie.id}><Link to={`/movies/${movie.id}`}>{movie.title}</Link></li>);

  return (
    <div>
      <div className='col-md-4'>
        <Link to="/movies/new">Add A Movie</Link>
        <ul>
          {movies}
        </ul>
      </div>
    </div>
  );
};
```

Now, we can easily link between our new movie list and our MoviesShow component!

### Redirecting

Finally, it would be nice if after creating the new Movie, we could "redirect" the user back to the '/movies' route. Luckily, React Router gives us a nice interface to do this using __browserHistory()__.

In our __MoviesNew__ component, let's import __browserHistory__ and use it's __push()__ function to change the route.

```javascript
// ./src/containers/MoviesNew

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMovie } from '../actions';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router'; // code change

class MoviesNew extends Component {

  constructor() {
    super();

    this.state = {
      title: ''
    };
  }

  handleOnSubmit(event) {
    event.preventDefault();
    this.props.addMovie(this.state);
    browserHistory.push('/movies'); // code change
  }

  handleOnChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  render(){
    return (
      <form onSubmit={(event) => this.handleOnSubmit(event)} >
        <input 
          type="text" 
          onChange={(event) => this.handleOnChange(event)} 
          placeholder="Add a Movie" />
        <input type="submit" value="Add Movie" />
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMovie: bindActionCreators(addMovie, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(MoviesNew);
```

We are now using __browserHistory__ to update the URL after we dispatch our __addMovie()__ action. Now, after submitting our form, we're sent back to the index route. Awesome! Try it out in the browser. 

## Resources
