
import { ChefHat, Clock, Users } from "lucide-react";
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

const RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", // General Food
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop", // Pancakes/Arepas like
  "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop", // Home cooked
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop", // Soup
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop", // Meat/Chicken
  "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?q=80&w=800&auto=format&fit=crop", // Rice/Grains
];

export default function RecipeCard({ recipe, onClick, dayBadge }: RecipeCardProps) {
  // Deterministic image selection based on ID
  const getImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % RECIPE_IMAGES.length;
    return RECIPE_IMAGES[index];
  };

  const image = getImage(recipe.id);

  return (
    <div className={styles.card} onClick={onClick}>
      {dayBadge && <div className={styles.dayBadge}>{dayBadge}</div>}
      
      <div className={styles.cardImageContainer}>
        <img src={image} alt={recipe.title} className={styles.cardImage} />
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
