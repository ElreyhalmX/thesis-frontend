import { ChefHat, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../config/axios";
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
  // Strategy: 
  // 1. Show Instant Real Stock Photo (mapped) initially for zero perceived latency.
  // 2. Async fetch the "Authentic AI" image from backend if requested.
  // 3. Swap when ready.
  
  const [image, setImage] = useState(getRecipeImage(recipe.title, recipe.id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchAIImage = async () => {
        try {
            // Check if we already have it cached to avoid duplicate gens
            const cached = sessionStorage.getItem(`img_gen_${recipe.id}`);
            if (cached) {
                if (mounted) setImage(cached);
                return;
            }

            const response = await apiClient.post('/images/generate', { title: recipe.title });
            if (response.data && response.data.image && mounted) {
                setImage(response.data.image);
                sessionStorage.setItem(`img_gen_${recipe.id}`, response.data.image);
            }
        } catch (error) {
            console.error("AI Image Gen failed, keeping stock photo", error);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    // Trigger AI generation
    fetchAIImage();

    return () => { mounted = false; };
  }, [recipe.title, recipe.id]);

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
