export function fetchMovies(){
  return {
    type: 'FETCH_MOVIES',
    movies:  [ { id: 1, title: 'A River Runs Through It' } ]
  };
}

let counter = 1;
export function addMovie(movie) {
  movie.id = ++counter;
  return {
    type: 'ADD_MOVIE',
    movie
  };
}
