import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Horarios from './pages/horarios/Horarios'
import Landing from './pages/landing/Landing'
import Preferencias from './pages/preferencias/Preferencias'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/preferencias" element={<Preferencias />} />
        <Route path="/horarios" element={<Horarios />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
