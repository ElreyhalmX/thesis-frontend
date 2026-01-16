import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Ingredients from './pages/Ingredients'
import Landing from './pages/Landing'
import RecipeFeed from './pages/RecipeFeed'
import RecipeView from './pages/RecipeView'
import TimeSelection from './pages/TimeSelection'

import FloatingBackground from './components/FloatingBackground'

function App() {
  const location = useLocation()

  return (
    <>
      <FloatingBackground />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/time" element={<TimeSelection />} />
        <Route path="/recipes" element={<RecipeFeed />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
      </Routes>
    </AnimatePresence>
    </>
  )
}

export default App
