import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyFlights from './pages/MyFlights';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/myflights' element={<MyFlights />} />
      </Routes>
    </div>
  )
}

export default App
