
import React, { useEffect, useState } from 'react'
import Search from './component/Search'


const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

 const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const[errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([]) 
  const [isLoading, setIsLoading] = useState(false)
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(()=> setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')
   try {
   const endpoint = query? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

   const response = await fetch (endpoint, API_OPTIONS)

if(!response.ok) {
   throw new Error('Failed to fetch movies')
}
const data = await response.json()

if(data.Response === 'False') {
  setErrorMessage(data.Error || 'Failed to Fetch movies')
  setMovieList([])
  return;
}
 setMovieList(data.results || [])

if(query && data.results.length > 0) {
  await  updateSearchCount(query, data.results[0])
}

   } catch (error) {
    console.log(`Error fetching movies: ${error}`)
    setErrorMessage('Error fetching movies. Please try again later.')
   } finally {
    setIsLoading(false)
   }
  }

  const loadTrendingMovies = async () => {
    try {
    const movies = await getTrendingMovies()
     setTrendingMovies(movies)
    } catch(error) {
      console.error(`Error fetching trending movies: ${error}`)
    }
  }
  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
         <h1>Find <span className='text-gradient'>Movies</span> you'll enjoy</h1>
        </header>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </main>
  )
}

export default App