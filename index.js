// Constants
const apiKey = "3d549a007f85a8c754b7d8d370f47daa";

const apiEndpoint = "https://api.themoviedb.org/3";
const imgSize = 'w500';
//const trending = "https://api.themoviedb.org/3/trending/all/week?api_key=3d549a007f85a8c754b7d8d370f47daa";
//const imgPath =  `${apiEndpoint}/trending/all/week?api_key=${apiKey}`
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
   
    fetchMovielist : (id)=>`${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genre=${id}`,
    fetchTrending: `${apiEndpoint}/discover/movie?${apiKey}&with_genres=28`
   // fetchTrending: `${apiEndpoint}/trending/movie/week?api_key=${apiKey}`

};
const imgPath = "http://image.tmdb.org/t/p/w300";
const imgPaths = "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg";


// Function to fetch data
function init(){
    //alert(' hii your app is up')
    fetchAndBuildAllSections(apiPaths.fetchTrending, 'Trending Now');
fetchTrendingMovies();

    fetchAndBuildAllSections();

}
    function fetchTrendingMovies (){
        fetchAndBuildAllSections(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {
            const randomIndex =parseInt(Math.random()* list.length);
            buildBannerSection(list[randomIndex]);
        })
        .catch(err => {
            console.error(err);
        });
    }
    function buildBannerSection(movie){
        const bannerCont = document.getElementById('banner-section');
        bannerCont.style.backgroundImage = `url('${imgPaths}${movie.backdrop_path}')`;

        const div = document.createElement('div');
    div.innerHTML = `
        <h2 class="banner_tittle">${movie.title}</h2>
        <p class="banner_info">Trending in Movies Today  Released.${movie.release_date}</p>
        <p class="banner_overview">${movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button" id="a"><img src="play-button-arrowhead.png" alt="">Play</button>
            <button class="action-button"><img src="info.png" alt=""> More Info</button>
        </div>
    </div>
    <div class="banner_fade"></div>
    `;
    div.className = "banner-content container";
    bannerCont.append(div);
    }

 function fetchAndBuildAllSections(){
    return fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            const fetchPromises = categories.map(category => {
                return fetchAndbuildMovieSection(apiPaths.fetchMovielist(category.id), category);
            });
            return Promise.all(fetchPromises);
        }
    })
    .catch(err => console.error(err));
}
 
 function fetchAndbuildMovieSection(fetchUrl,categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        console.table(res.results);
        const movies =res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies, categoryName.name);

        }
        return movies;
    })
    .catch(err => console.error(err))

 }
 function buildMoviesSection(list, categoryName){
    const moviesCont = document.getElementById('movies-cont');

            const moviesListHTML = list.map(item => {
                return `<img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.name}">`;
            }).join('');

            const moviesSectionHTML =`       
            <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
        </div>
        `


            const div = document.createElement('div');
            div.className= "movies-section"
            div.innerHTML = moviesSectionHTML;

            //append html into movies container
            moviesCont.append(div);

         
        }
     

// Event listener when window loads
window.addEventListener('load', function() {
    init();
    this.window.addEventListener('scroll',function(){
        // header
        const header = this.document.getElementById('header');
        if (this.window.scrollY>5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
});


