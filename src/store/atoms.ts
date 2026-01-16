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
export const recipesAtom = atom<Recipe[]>([]);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
