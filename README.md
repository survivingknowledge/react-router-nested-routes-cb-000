# Nested Routes in React Router

## Objectives

1. Describe React Router allows nesting routes
2. Explain how to organize routes in a standard React + React Router application

## Overview

In the previous lesson, we saw how to have routes dynamically render different components.  However, as you may have noticed, each time we rendered one component, our previous component disappeared.  In this lesson, we'll see how routes can be used to specify multiple components to render.  

## Master Detail Without Routes

Have you ever used Apple's Messages app for your Mac? How about GMail? What about YouTube? All of those apps use some version of a "Master-Detail" interface. This is when there is something pertaining to the entire resource, such as a list of all messages, videos, or emails, and some more detailed display of a specific item or action on another portion of the screen. Clicking on a new item in the list changes which item we have selected.

## Nesting

With React-Router, we can make accomplish the master detail pattern by making our components children of each other. Take YouTube for example. Let's pretend that visiting `/videos` displays a list of videos. Clicking on any video keeps our list of videos on the page, but also displays details on the selected video. This should be updated by the URL - the URL should have changed to `/videos/:id`. The VideoDetail in this case is a 'Nested Component' of '/videos' - it will always have the list rendered before it.

## Code Along

### Rendering Our List

To begin, let's take a look at our starter code. First, we have a `MoviesPage` component. This component is responsible for connecting to our store and loading our list of movies. A common pattern in Redux is to refer to these as `container` components and put them in a `containers` directory. Here we've named ours `MoviesPage` - again, a common naming pattern for container components.

```javascript
// src/containers/MoviesPage.js
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {fetchMovies} from '../actions'

import MoviesList from '../components/MoviesList';

class MoviesPage extends Component {
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

export default connect(mapStateToProps)(MoviesPage);
```

We using `mapStateToProps` to pull the `movies` property from our store's state and attach it to the `props` of this component. As you see, our `MoviesPage` just renders out a `MoviesList` component. Our `MoviesList` is purely presentational.

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

First, let's create a `MoviesShow` component. Later on, we will see that this component will need to connect to the store in order to figure out which Movie it should render, so let's put it in our `containers` directory.

>Note: Remember, containers are components that are directly connected to the store via the connect function.   

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
    <Route path="/" component={App} />
      <Route path='/movies' component={MoviesPage} >
        <Route path="/movies/:id" component={MoviesShow} />
      </Route>
    </Router>
  </Provider>),
document.getElementById('container'));
```

Let's take a look at what we did differently here.  Inside of the Route that points to  `/movies` is yet another Route called  `/movies/:id`.  One last step, and then we'll take a look at what this did.

Let's add links in our `MoviesList` component so that we can click on different movies. To do this, we'll use the `Link` component that React Router gives us.

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
              <Link to=`/movies/${movie.id}`>{movie.title}</Link>
            </li>)}
        </ul>
      </div>
    </div>
  )
}
```
Awesome! Refresh the page at `/movies`. Now, clicking a link changes the route, but we're not actually seeing any different content. What gives?

### Understanding Children

Well to understand why this is not working, we first need to take another look at `this.props.children` in react.  Bear with me on a quick sidebar.  But please take your time in understanding this.  It's crucial to understanding nested routes in a react-redux application.  Ok, let's go.

So far, every time that we have added a custom component, that component has been self-closing.  For example:

```javascript
  import React, { Component } from 'react'
  import ReactDOM from 'react-dom'

  class Users extends Component {
    render(
      return (
        <div>
          Users component
        </div>
      )
    )
  }
  class App extends Component {
    render(){
      return (
        <Users />
      )
    }
  }

  ReactDOM.render(<App />, document.getElementById('root'))
```

Now you can see that App has Users as its child component, and the component is self-closing.  Contrast it with the following code:
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

  ReactDOM.render(<App />, document.getElementById('root'))
```

Now the div with the word Hello will display in our Users component.  So children is a natural way to keep some of the content in our component the same, with the ability to pass through other content.  We use it the same way that we pass an argument to a function to allow the functions output to be flexible.  

### React Router takes advantage of this.props.children
Here's how react router ties in.  When you use nested routes with react-router, the component pointed to in the nested route is set as to be a child of the component referenced in the parent route.  So given the routes specified below, when you visit the url `/movies/3` react-router renders the MovieApp component, and sets the MoviesShow component as the MovieApp component's child.  

```javascript
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

// Here, MovieShow is a child of the MoviePage.  
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

So far we saw how to set up our nested routes.  We do so by making one route a child of the another route.  For example, in our application above the Route pointing to `/movies` is a parent of the route pointing to `/movies/:id`.  Similarly when a user visits the child url, the component from the parent route still displays, and the component from the child url is set as a child.  To display the child component, we must make use of `this.props.children`.

>Note: Understanding this.props.children frequently confounds students and pros alike.  So feel free to take a break, and then review this codealong again.
