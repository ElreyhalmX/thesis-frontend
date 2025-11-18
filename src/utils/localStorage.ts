const STORAGE_KEYS = {
  INGREDIENTS: 'culinary_ingredients',
  COOKING_TIME: 'culinary_cooking_time',
  RECIPES: 'culinary_recipes',
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return defaultValue
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

export const storage = {
  saveIngredients: (ingredients: string[]) =>
    saveToLocalStorage(STORAGE_KEYS.INGREDIENTS, ingredients),
  loadIngredients: () =>
    loadFromLocalStorage<string[]>(STORAGE_KEYS.INGREDIENTS, []),
  
  saveCookingTime: (time: number) =>
    saveToLocalStorage(STORAGE_KEYS.COOKING_TIME, time),
  loadCookingTime: () =>
    loadFromLocalStorage<number>(STORAGE_KEYS.COOKING_TIME, 30),
  
  saveRecipes: (recipes: any[]) =>
    saveToLocalStorage(STORAGE_KEYS.RECIPES, recipes),
  loadRecipes: () =>
    loadFromLocalStorage<any[]>(STORAGE_KEYS.RECIPES, []),
  
  clearAll: () => {
    removeFromLocalStorage(STORAGE_KEYS.INGREDIENTS)
    removeFromLocalStorage(STORAGE_KEYS.COOKING_TIME)
    removeFromLocalStorage(STORAGE_KEYS.RECIPES)
  },
}
