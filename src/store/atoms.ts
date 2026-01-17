import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  expiryDate?: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: string;
  servings: number;
  tips?: string[];
  nutrition?: Nutrition;
}

export const ingredientsAtom = atomWithStorage<Ingredient[]>(
  "culinary_ingredients_v2",
  []
);

export const legacyIngredientsAtom = atomWithStorage<string[]>(
  "culinary_ingredients",
  []
);
export const cookingTimeAtom = atomWithStorage<number>(
  "culinary_cooking_time",
  30
);
export const portionsAtom = atomWithStorage<number>(
  "culinary_portions",
  2
);
// Import WeaklyPlanItem or define a simple interface for storage if circular dependency is an issue.
// Ideally, we move types to a shared types file, but for now we'll imply the type or use 'any' if needed, 
// but let's try to do it right. We need to decouple types.
// For now, let's just use 'any[]' to avoid circular deps with services/recipes.ts if it imports atoms.
// Actually, services imports atoms. So atoms cannot import services.
// We will define the structure loosely or duplicate the interface here to avoid circular dependency.

export interface WeeklyPlanItemState {
  day: string;
  recipe: Recipe;
  rationale: string;
}

export const recipesAtom = atom<Recipe[]>([]);
export const weeklyPlanAtom = atom<WeeklyPlanItemState[]>([]);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Thesis Features: Profile & History
export interface UserProfile {
  name: string;
  budgetLevel: 'Bajo' | 'Medio' | 'Alto';
  dietaryRestrictions: string[];
  nutritionalGoal: 'Mantenimiento' | 'Pérdida de Peso' | 'Ganancia Muscular';
}

export interface HistoryItem {
  id: string;
  recipeId: string;
  recipeTitle: string;
  date: string;
  estimatedSavings: number; // in USD (simulated)
}

export const userProfileAtom = atomWithStorage<UserProfile>("culinary_profile", {
  name: "",
  budgetLevel: "Bajo",
  dietaryRestrictions: [],
  nutritionalGoal: "Mantenimiento"
});

export const historyAtom = atomWithStorage<HistoryItem[]>("culinary_history", []);
