import { ChefHat, Clock, Users } from "lucide-react";
import { getRecipeImage } from "../utils/imageMapper";
import Button from "./Button";
import styles from "./RecipeCard.module.scss";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    difficulty: string;
    description: string;
    prepTime: number;
    servings: number;
    ingredients: string[];
  };
  onClick: () => void;
  dayBadge?: string;
}

export default function RecipeCard({ recipe, onClick, dayBadge }: RecipeCardProps) {
  // Use mapped Real Stock Images (Photography)
  const image = getRecipeImage(recipe.title, recipe.id);

  return (
    <div className={styles.card} onClick={onClick}>
      {dayBadge && <div className={styles.dayBadge}>{dayBadge}</div>}
      
      <div className={styles.cardImageContainer}>
        <img 
          src={image} 
          alt={recipe.title} 
          className={styles.cardImage} 
          loading="lazy"
        />
        <span className={styles.difficultyBadge}>{recipe.difficulty}</span>
      </div>

      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{recipe.title}</h2>
        <p className={styles.cardDescription}>{recipe.description}</p>

        <div className={styles.cardMeta}>
            <div className={styles.metaItem}>
            <Clock size={16} />
            <span>{recipe.prepTime} min</span>
            </div>
            <div className={styles.metaItem}>
            <Users size={16} />
            <span>{recipe.servings} porciones</span>
            </div>
            <div className={styles.metaItem}>
            <ChefHat size={16} />
            <span>{recipe.ingredients.length} ingr.</span>
            </div>
        </div>

        <Button variant="outline" className={styles.cardButton}>
            Ver receta completa
        </Button>
      </div>
    </div>
  );
}
