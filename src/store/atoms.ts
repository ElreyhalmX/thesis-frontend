import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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
}

export const ingredientsAtom = atomWithStorage<string[]>(
  "culinary_ingredients",
  []
);
export const cookingTimeAtom = atomWithStorage<number>(
  "culinary_cooking_time",
  30
);
export const recipesAtom = atom<Recipe[]>([]);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
