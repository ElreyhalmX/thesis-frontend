import { useState, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ChevronRight, ArrowLeft } from 'lucide-react'
import { ingredientsAtom } from '../store/atoms'
import Button from '../components/Button'
import Input from '../components/Input'
import PageTransition from '../components/PageTransition'
import styles from './Ingredients.module.scss'

export default function Ingredients() {
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useAtom(ingredientsAtom)
  const [inputValue, setInputValue] = useState('')

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addIngredient()
    }
  }

  const handleContinue = () => {
    if (ingredients.length > 0) {
      navigate('/time')
    }
  }

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.header}
          >
            <h1 className={styles.title}>¿Qué ingredientes tienes?</h1>
            <p className={styles.description}>
              Lista los ingredientes que tienes disponibles. Puedes escribir en
              español coloquial venezolano.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.inputSection}
          >
            <div className={styles.inputWrapper}>
              <Input
                placeholder="ej: tomate, cebolla, ají dulce..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={addIngredient} className={styles.addButton}>
                <Plus size={20} />
                Agregar
              </Button>
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.ingredientsList}
              >
                <h3 className={styles.listTitle}>
                  Ingredientes ({ingredients.length})
                </h3>
                <div className={styles.tags}>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      className={styles.tag}
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className={styles.removeButton}
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.actions}
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={ingredients.length === 0}
              className={styles.continueButton}
            >
              Continuar
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
