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

To begin, let's take a look at our starter code. First, we have a `MoviesPage` component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in Redux is to refer to these as `container` components and put them in a `containers` directory. Here we've named ours `MoviesPage` - again, a common naming pattern for container components.

```javascript
// ./src/containers/MoviesPage.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchMovies } from '../actions'
import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {
  render(){
    return(
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

export default connect(mapStateToProps)(MoviePage);
```

We're using `mapStateToProps` to pull the `movies` property from our store's state and attach it to the `props` of this component. As you see, our `MoviesPage` just renders out a `MoviesList` component.

Our `MoviesList` is purely presentational.

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

First, let's create a `MoviesShow` component. Later on, we will see that this component will need to connect to the store in order to figure out which Movie it should render, so let's put it in our `containers` directory.

>Note: Remember, containers are components that are directly connected to the store via the connect function.   

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

Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any different content. What gives? The problem is, we've setup a child component, but we never actually said *where* it should render on the screen.

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

>>>>>>> d1be08236a63cf9891e13739411f039ac365f8e1
```javascript
class App extends Component {
  render(){
    return (
      <Users >
        <div> Hello</div>
      </Users>

    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Here, we changed things such that a child of users is the div component with the word hello in it.  This is equivalent to passing the children props a value of that component.  So if you prefer, you can think of the code as the following:

```javascript
<<<<<<< HEAD
...
class App extends Component {
  render(){
    const div = <div> Hello</div>
    return (
      <Users children={div}>

    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

Now we have set the children prop as the div specified above.  However just like every other prop that we pass through, we still need to tell the Users component how to use this information.  Currently, we are not doing that.  So we update our code to the following:

```javascript
  import React, { Component } from 'react'
  import ReactDOM from 'react-dom'

  class Users extends Component {
    render(
      return (
        <div>
          Users component
          {this.props.children}
        </div>
      )
    )
  }
  class App extends Component {
    render(){
      return (
        <Users >
          <div> Hello</div>
        </Users>
      )
    }
  }
=======
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


  ReactDOM.render(<App />, document.getElementById('root'))
```

Now the div with the word Hello will display in our Users component.  So children is a natural way to keep some of the content in our component the same, with the ability to pass through other content.  We use it the same way that we pass an argument to a function to allow the functions output to be flexible.  


### React Router takes advantage of this.props.children
Here's how react router ties in.  React router properly assumes that by using the nested routes that you would like to have the component pointed to in the nested route as a child of the component referenced in the parent route.  So given the routes specified below, when you visit the url `/movies/3` react-router renders the MovieApp component, and sets the MoviesShow component as its child.  

```javascript
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
        <Route path='/movies' component={MoviePage} >

        <Route path='/movies' component={MoviesPage}>
          <Route path="/movies/new" component={MoviesNew} />

          <Route path="/movies/:id" component={MoviesShow} />
        </Route>
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));

```

The problem is, we never actually said *where* the children should render on the screen.  Let's do this.  

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

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
```

Now, any child components provided by ReactRouter will be rendered there. So when we visit movies/3, the MoviesPages component should display along with the MoviesShow component. Awesome! Refresh again - now we see our `MoviesShow` component displayed at our dynamic route.

What we don't see is information particular to that movie, but we'll leave that for the next section.

### Summary
```

Note that we **must** define our `/movies/new` route first. Why? Because otherwise, the `/:id` route handler would catch it first and assessing `"new"` to be the id.

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


So far we saw how to set up our nested routes.  We do so by making one route a child of the another route.  For example, in our application above the Route pointing to `/movies` is a parent of the route pointing to `/movies/:id`.  Similarly when a user visits the child url, the component from the parent route still displays, and the component from the child url is set as a child.  To display the child component, we must make use of `this.props.children`.
