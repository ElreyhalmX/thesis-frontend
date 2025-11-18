import apiClient from '../config/axios'
import { Recipe } from '../store/atoms'

export interface GenerateRecipesParams {
  ingredients: string[]
  cookingTime: number
}

export interface GenerateRecipesResponse {
  recipes: Recipe[]
}

export async function generateRecipes(
  params: GenerateRecipesParams
): Promise<Recipe[]> {
  try {
    const response = await apiClient.post<GenerateRecipesResponse>(
      '/recipes/generate',
      params
    )

    return response.data.recipes
  } catch (error: any) {
    console.error('Failed to generate recipes:', error)
    
    if (error.response?.status === 400) {
      throw new Error('Datos inválidos. Por favor verifica tus ingredientes.')
    }
    
    if (error.response?.status === 500) {
      throw new Error('Error del servidor. Por favor intenta de nuevo más tarde.')
    }
    
    throw new Error('No se pudieron generar las recetas. Verifica tu conexión.')
  }
}
