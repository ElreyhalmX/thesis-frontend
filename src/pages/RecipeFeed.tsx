import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Loader from "../components/Loader";
import PageTransition from "../components/PageTransition";
import { generateRecipes } from "../services/recipes";
import {
    cookingTimeAtom,
    ingredientsAtom,
    isLoadingAtom,
    portionsAtom,
    recipesAtom,
} from "../store/atoms";
import styles from "./RecipeFeed.module.scss";

export default function RecipeFeed() {
  const navigate = useNavigate();
  const [ingredients] = useAtom(ingredientsAtom);
  const [cookingTime] = useAtom(cookingTimeAtom);
  const [portions] = useAtom(portionsAtom);
  const [recipes, setRecipes] = useAtom(recipesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useState<string | null>(null);
  const setIngredients = useSetAtom(ingredientsAtom);

  useQuery({
    queryKey: ["generateRecipes"],
    queryFn: fetchRecipes,
    enabled: recipes.length === 0 && !isLoading && !error,
  });

  async function fetchRecipes() {
    if (ingredients.length === 0) {
      navigate("/ingredients");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newRecipes = await generateRecipes({
        ingredients,
        cookingTime,
        portions,
      });

      setRecipes(newRecipes);
      setIngredients([]); // Clear ingredients after generating recipes
    } catch (err: any) {
      console.error("Error fetching recipes:", err);
      setError(
        err.message ||
          "No pudimos generar las recetas. Por favor intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    setRecipes([]);
    setError(null);
  };

  const handleStartAgain = () => {
    handleRetry();
    setRecipes([]);
    setIngredients([]);
    navigate("/ingredients");
  };

  if (isLoading) {
    return <Loader message="Generando recetas personalizadas con IA..." />;
  }

  if (error) {
    return (
      <PageTransition>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>Algo salió mal</h2>
            <p className={styles.errorMessage}>{error}</p>
            <div className={styles.errorActions}>
              <Button
                variant="outline"
                onClick={() => navigate("/ingredients")}
              >
                Probar con otros ingredientes
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.headerContent}
          >
            <div className={styles.iconWrapper}>
              <Sparkles size={24} />
            </div>
            <h1 className={styles.title}>Recetas recomendadas</h1>
            <p className={styles.subtitle}>
              {recipes.length} recetas generadas basadas en tus ingredientes
            </p>
          </motion.div>
        </div>

        <div className={styles.grid}>
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={styles.card}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{recipe.title}</h2>
                <span className={styles.difficulty}>{recipe.difficulty}</span>
              </div>

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
                  <span>{recipe.ingredients.length} ingredientes</span>
                </div>
              </div>

              <Button variant="outline" className={styles.cardButton}>
                Ver receta completa
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.actions}
        >
          <Button variant="outline" onClick={handleStartAgain}>
            Probar con otros ingredientes
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
