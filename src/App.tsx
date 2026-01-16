import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Ingredients from './pages/Ingredients'
import Landing from './pages/Landing'
import RecipeFeed from './pages/RecipeFeed'
import RecipeView from './pages/RecipeView'
import TimeSelection from './pages/TimeSelection'
import WeeklyPlanner from './pages/WeeklyPlanner'

import FloatingBackground from './components/FloatingBackground'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <FloatingBackground />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/time" element={<TimeSelection />} />
        <Route path="/recipes" element={<RecipeFeed />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/planner" element={<WeeklyPlanner />} />
      </Routes>
    </AnimatePresence>
    </>
  )
}

export default App
