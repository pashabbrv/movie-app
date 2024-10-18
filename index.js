const apiKey = "186f8212";

const moviesData = [
    {
        title: "Deadpool & Wolverine",
        year: 2024,
        score: 8.0,
        poster: "https://m.media-amazon.com/images/M/MV5BZmQxZWM5MzgtY2EzZC00OGUxLWE0Y2EtMDIwOTFlNmQ5MWMyXkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        title: "Rush Hour 3",
        year: 2007,
        score: 6.2,
        poster: "https://m.media-amazon.com/images/M/MV5BMTA0Nzg5NjQ0MDBeQTJeQWpwZ15BbWU3MDE4Mzg5NDE@._V1_SX300.jpg"
    },
    {
        title: "Inception",
        year: 2010,
        score: 8.8,
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
    },
    {
        title: "Guardians of the Galaxy Vol. 2",
        year: 2017,
        score: 7.6,
        poster: "https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg"
    },
    {
        title: "The Fast and the Furious: Tokyo Drift",
        year: 2006,
        score: 6.1,
        poster: "https://m.media-amazon.com/images/M/MV5BMTQ2NTMxODEyNV5BMl5BanBnXkFtZTcwMDgxMjA0MQ@@._V1_SX300.jpg"
    },
    {
        title: "Thor: Love and Thunder",
        year: 2022,
        score: 6.2,
        poster: "https://m.media-amazon.com/images/M/MV5BYmMxZWRiMTgtZjM0Ny00NDQxLWIxYWQtZDdlNDNkOTEzYTdlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg"
    },
    {
        title: "Borderlands",
        year: 2024,
        score: 4.5,
        poster: "https://m.media-amazon.com/images/M/MV5BOWZmOTM5YmMtNjliMi00OGRkLWIwNGUtNDI2NTE3NzZmMDdmXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg"
    },
    {
        title: "It Ends with Us",
        year: 2024,
        score: 6.7,
        poster: "https://m.media-amazon.com/images/M/MV5BYzM2NGMzNGQtZjNhMi00MTVkLTg2ZGQtN2M4OTllYzU1Y2Y0XkEyXkFqcGc@._V1_SX300.jpg"
    },
    {
        title: "Bad Boys: Ride or Die",
        year: 2024,
        score: 6.7,
        poster: "https://m.media-amazon.com/images/M/MV5BY2U5YmQ3YjgtM2I2OC00YmM5LTkyM2MtN2I5Zjg2MDE0ODkwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg"
    },
    {
        title: "Venom: Let There Be Carnage",
        year: 2021,
        score: 5.9,
        poster: "https://m.media-amazon.com/images/M/MV5BNDEwNDE5ZDUtMjQ0ZC00OTA0LTkyOTQtZGE0OTU4Njc0MjM5XkEyXkFqcGdeQXVyMzEyMDQzNzY@._V1_SX300.jpg"
    },
    {
        title: "The Hangover",
        year: 2009,
        score: 7.7,
        poster: "https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
    },
    {
        title: "The Iron Claw",
        year: 2023,
        score: 7.6,
        poster: "https://m.media-amazon.com/images/M/MV5BOGE5NjllZTEtMGJjNy00ZTFmLThlNDItNmNiZTgyOTQ4OTA2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg"
    }
];


function init() {
    const movieContainer = document.querySelector("main");

    moviesData.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        movieElement.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-description">
                <div id="title">${movie.title}</div>
                <div id="score">${movie.score}</div>
            </div>
            <div id="year">${movie.year}</div>
        `;

        movieContainer.appendChild(movieElement);
        updateScoreBackground(movieElement.querySelector("#score"));
    });
    
    updateMovies();
}


document.addEventListener("DOMContentLoaded", init);


// Handling searching
document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const title = document.getElementById("search").value.trim();
    if (!title) return;
    
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            displayNoResults();
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
});


async function displayMovies(movies) {
    const movieContainer = document.querySelector("main");
    const footer = document.querySelector("footer");
    footer.classList.add("hidden");
    movieContainer.innerHTML = "";

    const BATCH_SIZE = 4;
    
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
        const batch = movies.slice(i, i + BATCH_SIZE);
        
        const moviePromises = batch.map(async movie => {
            const detailUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            const detailRes = await fetch(detailUrl);
            return await detailRes.json();
        });

        const detailedMovies = await Promise.all(moviePromises);

        detailedMovies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie");

            movieElement.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <div class="movie-description">
                    <div id="title">${movie.Title}</div>
                    <div id="score">${movie.imdbRating ? movie.imdbRating : "N/A"}</div>
                </div>
                <div id="year">${movie.Year}</div>
            `;

            movieContainer.appendChild(movieElement);
            updateScoreBackground(movieElement.querySelector("#score"));
        });

        updateMovies();
    }

    footer.classList.remove("hidden");
}

function displayNoResults() {
    const movieContainer = document.querySelector("main");
    movieContainer.innerHTML = "<p>No results found</p>";
}


// Functions for sorting movies by year and personalize score background
function updateMovies() {
    const movieContainer = document.querySelector("main");
    const movies = Array.from(document.querySelectorAll(".movie"));

    const sortedMovies = movies.sort((a, b) => {
        const yearA = parseInt(a.querySelector("#year").textContent);
        const yearB = parseInt(b.querySelector("#year").textContent);
        return yearB - yearA;
    });

    movieContainer.innerHTML = "";

    sortedMovies.forEach(movie => {
        movieContainer.appendChild(movie);
    });
}


function updateScoreBackground(scoreElement) {
    const score = parseFloat(scoreElement.textContent);

    if (score <= 5) {
        scoreElement.style.backgroundColor = "red";
    } else if (score > 5 && score < 7) {
        scoreElement.style.backgroundColor = "orange";
    } else if (score >= 7) {
        scoreElement.style.backgroundColor = "green";
    }
}


const clearButton = document.querySelector('.clear-button');
const searchInput = document.getElementById('search');


window.onload = function() {
    searchInput.focus();
};

/* func for reset text in input */