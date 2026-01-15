import { useAtom } from 'jotai'
import { generateRecipes } from '../services/recipes'
import { cookingTimeAtom, ingredientsAtom, isLoadingAtom, portionsAtom, recipesAtom } from '../store/atoms'

export function useRecipes() {
  const [recipes, setRecipes] = useAtom(recipesAtom)
  const [ingredients] = useAtom(ingredientsAtom)
  const [cookingTime] = useAtom(cookingTimeAtom)
  const [portions] = useAtom(portionsAtom)
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
        portions,
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
