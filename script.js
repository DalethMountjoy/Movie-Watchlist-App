class Movie {
    constructor(title, director, year) {
        this.title = title
        this.director = director
        this.year = year
    }
}


const defaultMovies = [
    {
        title: 'Jurrasic Park',
        director: 'John Doe',
        year: '1990'
    },
    {
        title: 'The Dead Pool',
        director: 'Mathew Albison',
        year: '2014'
    }
]

class UI {
    static movies = JSON.parse(localStorage.getItem('movies')) || [];

    static displayMovies = () => {
        let movies = JSON.parse(localStorage.getItem('movies'))
        if (!movies) {
            movies = defaultMovies
        }
        UI.movies = movies;
        movies.forEach(movie => UI.addMovieToList(movie))
        //defaultMovies.forEach(movie => UI.addMovieToList(movie))
    }
    static addMovieToList = (movie) => {
        const list = document.getElementById('movie-list')
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.year}</td>
            <td><ion-icon class="ion-icon" name="close-circle-outline"></ion-icon> </td>`
        list.appendChild(row)

        //new event listener for the icon
        const deleteIcon = row.querySelector('.ion-icon')
        deleteIcon.addEventListener('click', () => {
            UI.showAlert("Movie Removed", 'success')
            UI.deleteMovie(deleteIcon);
        })
        UI.saveMovies()
    }
    static deleteMovie(deleteIcon) {
        const row = deleteIcon.parentElement.parentElement;
        const title = row.querySelector('td:first-child').textContent;
        const director = row.querySelector('td:nth-child(2)').textContent;
        const year = row.querySelector('td:nth-child(3)').textContent;

        //remove the movie object from local storage
        const index = UI.movies.findIndex(
            (movie) =>
                movie.title === title &&
                movie.director === director &&
                movie.year === year
        );
        if (index !== -1) {
            UI.movies.splice(index, 1);
            localStorage.setItem('movies', JSON.stringify(UI.movies));
        }
        row.remove();
    }
    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#director').value = "";
        document.querySelector('#year').value = "";
    }
    static showAlert(message, className) {
        const div = document.createElement('div')
        div.innerText = message
        div.className = `alert alert-${className}`
        document.getElementById('movie-form').prepend(div)
        setTimeout(() => document.querySelector('.alert').remove(), 1500)
    }
    static saveMovies() {
        const movieList = document.querySelectorAll('#movie-list tr')
        const movies = []
        movieList.forEach((row) => {
            const movie = {
                title: row.cells[0].textContent,
                director: row.cells[1].textContent,
                year: row.cells[2].textContent
            }
            movies.push(movie)
        })
        localStorage.setItem('movies', JSON.stringify(movies))
    }
}

UI.displayMovies()


// Event: Add a movie
// document.querySelector('#movie-form').addEventListener('submit', addAMovie, false)
document.querySelector('#movie-form button[type="submit"]').addEventListener('click', addAMovie, false)
function addAMovie(e) {
    //prevent actual submission
    e.preventDefault()
    //get form values
    const title = document.querySelector('#title').value;
    const director = document.querySelector('#director').value;
    const year = document.querySelector('#year').value;

    if (!title || !director || !year) {
        UI.showAlert("Please enter correct details", "danger")
        return
    }
    // instantiate a new book object
    const movie = new Movie(title, director, year)
    // Add book object to UI
    UI.addMovieToList(movie)
    UI.showAlert("Movie Added", 'success')
    UI.clearFields();
}