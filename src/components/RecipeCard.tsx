```typescript
import { ChefHat, Clock, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../config/axios";
import Button from "./Button";
import styles from "./RecipeCard.module.scss";
import Skeleton from "./Skeleton";

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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check session storage first
    const cached = sessionStorage.getItem(`img_gen_${recipe.id}`);
    if (cached) {
        setImage(cached);
        setLoading(false);
        return;
    }

    const fetchAIImage = async () => {
        try {
            const response = await apiClient.post('/images/generate', { title: recipe.title });
            if (response.data && response.data.image && mounted) {
                setImage(response.data.image);
                sessionStorage.setItem(`img_gen_${recipe.id}`, response.data.image);
            }
        } catch (error) {
            console.error("AI Image Gen failed", error);
        } finally {
            if (mounted) setLoading(false);
        }
    };

    fetchAIImage();

    return () => { mounted = false; };
  }, [recipe.title, recipe.id]);

  return (
    <div className={styles.card} onClick={onClick}>
      {dayBadge && <div className={styles.dayBadge}>{dayBadge}</div>}
      
      <div className={styles.cardImageContainer}>
        {loading ? (
             <Skeleton height="100%" />
        ) : image ? (
            <img 
            src={image} 
            alt={recipe.title} 
            className={styles.cardImage} 
            loading="lazy"
            />
        ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
                <ChefHat size={32} color="#ccc" />
            </div>
        )}
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
