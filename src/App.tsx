import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Ingredients from './pages/Ingredients'
import TimeSelection from './pages/TimeSelection'
import RecipeFeed from './pages/RecipeFeed'
import RecipeView from './pages/RecipeView'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/time" element={<TimeSelection />} />
        <Route path="/recipes" element={<RecipeFeed />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
