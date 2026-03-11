import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import TmdbMovieDetails from './pages/TmdbMovieDetails'
import Categories from './pages/Categories'
import Articles from './pages/Articles'
import ShortFilms from './pages/ShortFilms'
import Masterclass from './pages/Masterclass'
import FilmFestivals from './pages/FilmFestivals'
import FilmSchools from './pages/FilmSchools'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <div className="bg-[#0d0f12] min-h-screen text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Editorial reviewed movies */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          {/* Live TMDB movies */}
          <Route path="/tmdb/:id" element={<TmdbMovieDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/shortfilms" element={<ShortFilms />} />
          <Route path="/masterclass" element={<Masterclass />} />
          <Route path="/festivals" element={<FilmFestivals />} />
          <Route path="/filmschools" element={<FilmSchools />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
