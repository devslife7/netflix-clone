import React, {useState, useEffect} from 'react'
import axios from './axios'
import './Row.css'
import Youtube from "react-youtube"
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow}) {
  const [movies, setMovies] = useState([])
  const [trailerUrl, setTrailerUrl] = useState("")
  const [trailerNotFound, setTrailerNotFound] = useState(false)

  useEffect(() => {

    async function fetchData() {
      const request = await axios.get(fetchUrl)
      setMovies(request.data.results)
      return request
    }
    fetchData()
    
  }, [fetchUrl])


  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1
    }
  }

  const handleClick = (movie) => {
    setTrailerNotFound(false)
    if (trailerUrl) {
      setTrailerUrl("")
    } else {
      movieTrailer(movie?.name || movie?.title || "")
      .then((url) => {
      console.log("URL HERE: ", url)
      console.log("TRAILER URL: ", trailerUrl)
      const urlParams = new URLSearchParams(new URL(url).search)
      console.log("URL SET AS TRAILERURL: ", urlParams)
      setTrailerUrl(urlParams.get('v'))
      })
      .catch(error => {
        setTrailerNotFound(true)
        console.log(error)
      })
    }
  }

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
          {movies.map(movie => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name} />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
      {console.log("TRAILER URL: ", trailerUrl)}
      {trailerNotFound && <div style={{marginLeft: '45vw'}}>TRAILER NOT FOUND</div>}
    </div>
  )
}

export default Row