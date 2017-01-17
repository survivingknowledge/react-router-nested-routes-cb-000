# Nested Routes in React Router

## Objectives

1. Describe React Router allows nesting routes
2. Describe the benefits of rendering a route as a tree of components
3. Explain how to set up a redirect with React Router3
4. Explain how to access parameters in React Router
5. Explain how to organize routes in a standard React + React Router application
6. Describe how to set up a default component for a given path"


## Overview

In the previous lesson, we briefly looked at setting up nested routes. We created a main component, `App`, which rendered a `NavBar` component and then any *child components*. In this lesson, we'll take this concept a step further and look at how we might set up other components as "nested routes" of their parents.

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about GMail? What about YouTube? All of those apps use some version of a "Master-Detail" interface. You'll have a list of items on portion of the screen, such as messages, videos, or emails, and some more detailed display of that item on another portion of the screen. Clicking on a new item in the list changes which item we have selected.

We can implement a version of this without React-Router, but it's a bit of a pain - we have to manually change the selected item and pass it down into a different component. Also, when the selected item changes, it's not actually reflected in the URL. This is a big bummer - it means that there's no way to me to send a link directly to one item to someone else.

## Nesting

By using React-Router, we can make our components children of each other. Take YouTube for example. Let's pretend that visiting `/videos` displays a list of videos. Clicking on any video keeps our list of videos on the page, but also displays details on the selected video. This should be updated by the URL - the URL should have changed to `/videos/:id`. The VideoDetail in this case is a 'Nested Component' of '/videos' - it will always have the list rendered before it.

## Code Along

### Rendering Our List

Start out with a `MoviesPage` component that connects to the store and renders out a `MoviesList`. The movie list is presentation and just renders out. Explain that we're using Bootstrap columns for sizing but we could do this ourselves if we wanted to.

To begin, let's take a look at our starter code. First, we have a `MoviesPage` component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in Redux is to refer to these as `container` components and put them in a `containers` directory. Here we've named ours `MoviesPage` - again, a common naming pattern for container components.

```javascript
// src/containers/MoviesPage.js
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {fetchMovies} from '../actions'

import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {

  componentDidMount(){
    this.props.fetchMovies();
  }

  render(){
    return(
      <div>
        <MoviesList movies={this.props.movies} />
      </div>)
  }
}

function mapStateToProps(state){
  return {
    movies: state.movies
  }
}

function mapDispatchToProps(dispatch){
  return {
    fetchMovies: bindActionCreators(fetchMovies, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesPage);
```

We're using `mapStateToProps` to pull the `movies` property from our state and attach it to the `props` of this component. We're also pulling the `fetchMovies` action and attaching that to props as well, that way when our component mounts, we can fire off the action to get it some data.

Finally, our `MoviesPage` just renders out a `MoviesList` component. Our `MoviesList` is purely presentational - here, we can decide what kind of styling to use.

```javascript
// src/components/MoviesList.js

import React from 'react';

export default (props) => {
  const movies = props.movies;

  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies.map( movie => <li key={movie.id}>{movie.title}</li>)}
        </ul>
      </div>
    </div>
  )
}
```

 Our Movie list will be our 'master' list on the left side. We're using Bootstrap's column classes to define how  much of the screen our `MoviesList` should take up, but we could easily write our own classes or use the columns from a different framework.

### Linking to the Show

Right now, we're using React Router to display the `MoviesPage` component when the url is `/movies`. Let's add in our first nested route - going to '/movies/:id' should display details about a given movie.

First, let's create a `MoviesShow` component. This component will need to connect to the store in order to figure out which Movie it should render, so let's put it in our `containers` directory.

```javascript
// src/containers/MoviesShow.js
import React from 'react';

export default (props) => {
  return(
    <div>
      Movies Show Component!
    </div>
  )
}
```

Next, let's add a nested route in our `index.js` file.

```javascript
// src/index.js
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

Great, now, let's add links in our `MoviesList` component so that we can click on different movies. To do this, we'll use the `Link` component that React Router gives us.

```javascript
// src/components/MoviesList.js
import React from 'react';
import {Link} from 'react-router';
export default (props) => {
  const movies = props.movies;

  return (
    <div>
      <div className='col-md-4'>
        <ul>
          {movies.map( movie =>
            <li key={movie.id}>
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
            </li>)}
        </ul>
      </div>
    </div>
  )
}
```
Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any different content. What gives? The problem is, we've setup a child component, but we never actually said *where* it should render on the screen.

In React, we can dynamically render child components by pulling them off of the `children` property on our components props. Let's update our `MoviesPage` so that it renders it's child components underneath the `MoviesList`

```javascript
// src/containers/MoviesPage.js
import React, { Component } from 'react';
...

class MoviesPage extends Component {
...

  render(){
    return(
      <div>
        <MoviesList movies={ this.props.movies } />
        { this.props.children }
      </div>)
  }
}

...

export default connect(mapStateToProps, mapDispatchToProps)(MoviesPage);
```

Now, any child components provided by ReactRouter will be rendered there. Remember, child components are defined by the nested structure of our routes under `Router`. Awesome! Refresh again - now we see our `MoviesShow` component displayed at our dynamic route.


### Dynamically finding the show

We've successfully created out nested route. Next, let's wire up our `MoviesShow` component to dynamically render the info about the movie based on the URL. The steps to do so will be as follows:

1. Connect our MoviesShow component to the store so that it knows about the list of movies.
2. Find the movie where the movie's id matches the `:id` param of our route.
3. Make that movie available to the component via `props`.

First, let's import `connect` and use our `mapStateToProps` function to let our `MoviesShow` component know about changes to the store.

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

function mapStateToProps(state, ownProps){
  ownProps.routeParams.id // this will return the dynamic portion of the url.
}

export default connect(mapStateToProps)(MoviesShow);
```

Note that we have a property called `id` because of the way we defined our route. If we defined our dynamic portion to be `/movies/:dog`, we'd have a `dog` property in our `routeParams`.

Now, we can simply iterate through our list of movies and return the one where our `route` matches.

```javascript
import React, {Component} from 'react';
import {connect} from 'react-redux';

class MoviesShow extends Component {

  render(){
    const movie = this.props.movie; // This just makes our JSX a little more readable
    return (
      <div className='col-md-8'>
        { movie.title }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
   const movie = state.movies.find( ( movie ) => movie.id == ownProps.routeParams.id  )
   if (movie) {
     return {
       movie: movie
     }
   } else {
     return {
       movie: {}
     }
   }
}

export default connect(mapStateToProps)(MoviesShow);
```

Now, assuming we find a movie, we simply add it to the props. To account for the case where a movie isn't found, we return just an empty object as the movie.

### Adding the New Option

Let's add our second nested route. Going to '/movies/new' should display the `MoviesNew` component.

We've already created out `MoviesNew` component - it's a simple form that dispatches the `addMovie` action on submission. Let's add that into our Route, the same way we did with our `Show` component.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import rootReducer from './reducers'
import { Provider } from 'react-redux';

import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './components/App'
import MoviesPage from './containers/MoviesPage'
import MoviesShow from './containers/MoviesShow'
...

ReactDOM.render(
  (<Provider store={store} >
    <Router history={browserHistory} >
      <Route path="/" component={App} >
        <Route path='/movies' component={MoviesPage} >
          <Route path="/movies/new" component={MoviesNew} />
          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```
Note that we **must** define our `/movies/new` route first. Why? Because otherwise, the `/:id` route handler would catch it first and assessing `"new"` to be the id.

Let's add a link to our Movies List to add a new movie.

```javascript
// src/components/MoviesList
import React from 'react';
import {Link} from 'react-router';
import MoviesListItem from './MoviesListItem';

export default (props) => {
  const movies = props.movies;

  return (
    <div>
      <div className='col-md-4'>
        <ul>
        {movies.map( movie =>
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>)}
        </ul>
        <Link to="/movies/new">Add a Movie</Link>
      </div>
    </div>
  )
}
```

Now, we can easily link between our new movie list and our MoviesShow component!

### Redirecting

Finally, it would be nice if after creating the new Movie, we could "redirect" the user back to the '/movies' route. Luckily, React Router gives us a nice interface to do this using `browserHistory`.

In our `MoviesNew` component, let's import `browserHistory` and use it's `push` method to change the route.

```javascript
//src/containers/MoviesNew
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {addMovie} from '../actions'
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';

class MoviesNew extends Component {

  handleSubmit(e){
    e.preventDefault();
    const movie = {
      title: this.refs.movieTitle.value
    }
    this.props.addMovie(movie);
    this.refs.movieTitle.value = "";
    browserHistory.push('/movies');
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit.bind(this)} >
        <input type="text" ref="movieTitle" placeholder="Add a Movie" />
      </form>
    )
  }
}

function mapDispatchToProps(dispatch){
  return {
    addMovie: bindActionCreators(addMovie, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(MoviesNew)
```

We can use `browserHistory` to update the URL in any component lifecycle method or any event handler. Now, after submitting our form, we're sent back to the index route. Awesome!

## Resources
