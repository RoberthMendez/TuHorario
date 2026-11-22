import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/landing/Landing'
import Preferencias from './pages/preferencias/Preferencias'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/preferencias" element={<Preferencias />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
