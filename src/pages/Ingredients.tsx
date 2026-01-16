"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { AlertCircle, ArrowLeft, ChevronRight, Plus, X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import PageTransition from "../components/PageTransition";
import { ingredientsAtom } from "../store/atoms";
import styles from "./Ingredients.module.scss";

export default function Ingredients() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useAtom(ingredientsAtom);
  const [inputValue, setInputValue] = useState("");

  const addIngredient = () => {
    if (inputValue.trim()) {
      const exists = ingredients.some(i => i.name.toLowerCase() === inputValue.trim().toLowerCase());
      if (!exists) {
        setIngredients([
          ...ingredients, 
          { 
            id: Date.now().toString(), 
            name: inputValue.trim() 
            // Quantity and Expiry could be added here later via modal
          }
        ]);
        setInputValue("");
      }
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  const handleContinue = () => {
    if (ingredients.length >= 3) {
      navigate("/time");
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
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
            transition={{ delay: 0.15 }}
            className={styles.infoBox}
          >
            <AlertCircle size={20} />
            <div>
              <h3 className={styles.infoTitle}>Cómo funcionan las recetas</h3>
              <p className={styles.infoText}>
                Usaremos{" "}
                <strong>únicamente los ingredientes que agregues</strong> más
                condimentos básicos (sal, aceite, ajo, pimienta, , comino y
                agua). No necesitas agregar estos.
              </p>
              <p className={styles.recommendedText}>
                Te recomendamos agregar <strong>al menos 3 ingredientes</strong>{" "}
                para mejores resultados.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.inputSection}
          >
            <div className={styles.inputWrapper}>
              <Input
                placeholder="Escribe un ingrediente (ej. Pollo)"
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.ingredientsList}
              >
                <h3 className={styles.listTitle}>
                  Ingredientes ({ingredients.length})
                </h3>
                <div className={styles.tags}>
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      className={styles.tag}
                    >
                      <span>{ingredient.name}</span>
                      <button
                        onClick={() => removeIngredient(ingredient.id)}
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

          {ingredients.length > 0 && ingredients.length < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.warningText}
            >
              Agrega al menos {3 - ingredients.length} ingrediente
              {3 - ingredients.length !== 1 ? "s" : ""} más para continuar.
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.actionsGroup}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap' }}
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={ingredients.length < 3}
              className={styles.continueButton}
            >
              Continuar
              <ChevronRight size={20} />
            </Button>
            
            <button 
              className={styles.plainButton} 
              onClick={() => navigate('/planner')}
              style={{ background: 'transparent', border: '1px solid var(--color-primary)', borderRadius: '99px', padding: '0.75rem 1.5rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              o Plan Semanal
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
