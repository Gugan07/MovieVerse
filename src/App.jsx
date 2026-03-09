import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
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
      <div className="bg-[#14181c] min-h-screen text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
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
