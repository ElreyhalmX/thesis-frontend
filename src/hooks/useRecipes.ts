import { useAtom } from 'jotai'
import { recipesAtom, ingredientsAtom, cookingTimeAtom, isLoadingAtom } from '../store/atoms'
import { generateRecipes } from '../services/recipes'

export function useRecipes() {
  const [recipes, setRecipes] = useAtom(recipesAtom)
  const [ingredients] = useAtom(ingredientsAtom)
  const [cookingTime] = useAtom(cookingTimeAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)

  const fetchRecipes = async () => {
    if (ingredients.length === 0) {
      throw new Error('No hay ingredientes seleccionados')
    }

    setIsLoading(true)

    try {
      const newRecipes = await generateRecipes({
        ingredients,
        cookingTime,
      })

      setRecipes(newRecipes)
      return newRecipes
    } catch (error: any) {
      console.error('Error fetching recipes:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearRecipes = () => {
    setRecipes([])
  }

  return {
    recipes,
    isLoading,
    fetchRecipes,
    clearRecipes,
  }
}
