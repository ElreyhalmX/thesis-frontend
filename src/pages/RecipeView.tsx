import { useParams, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Users, ChefHat, Lightbulb } from 'lucide-react'
import { recipesAtom } from '../store/atoms'
import Button from '../components/Button'
import PageTransition from '../components/PageTransition'
import styles from './RecipeView.module.scss'

export default function RecipeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipes] = useAtom(recipesAtom)

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <PageTransition>
        <div className={styles.errorContainer}>
          <h2>Receta no encontrada</h2>
          <Button onClick={() => navigate('/recipes')}>
            Volver a las recetas
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/recipes')}>
          <ArrowLeft size={20} />
          Volver a las recetas
        </button>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.header}
          >
            <div className={styles.headerTop}>
              <h1 className={styles.title}>{recipe.title}</h1>
              <span className={styles.difficulty}>{recipe.difficulty}</span>
            </div>
            <p className={styles.description}>{recipe.description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Clock size={20} />
                <div>
                  <span className={styles.metaLabel}>Tiempo</span>
                  <span className={styles.metaValue}>{recipe.prepTime} min</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <Users size={20} />
                <div>
                  <span className={styles.metaLabel}>Porciones</span>
                  <span className={styles.metaValue}>{recipe.servings}</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <ChefHat size={20} />
                <div>
                  <span className={styles.metaLabel}>Ingredientes</span>
                  <span className={styles.metaValue}>{recipe.ingredients.length}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className={styles.sections}>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>Ingredientes</h2>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={styles.ingredient}
                  >
                    <span className={styles.ingredientBullet}></span>
                    {ingredient}
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>Preparación</h2>
              <ol className={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={styles.instruction}
                  >
                    <span className={styles.instructionNumber}>{index + 1}</span>
                    <span className={styles.instructionText}>{instruction}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.section>

            {recipe.tips && recipe.tips.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={styles.section}
              >
                <div className={styles.tipsHeader}>
                  <Lightbulb size={20} />
                  <h2 className={styles.sectionTitle}>Tips y recomendaciones</h2>
                </div>
                <ul className={styles.tipsList}>
                  {recipe.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={styles.tip}
                    >
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
