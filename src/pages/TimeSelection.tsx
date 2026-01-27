import { motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import {
    ArrowLeft,
    ChevronRight,
    Clock,
    Coffee,
    Users,
    Utensils,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { cookingTimeAtom, portionsAtom, recipesAtom } from "../store/atoms";
import styles from "./TimeSelection.module.scss";

export default function TimeSelection() {
  const navigate = useNavigate();
  const [cookingTime, setCookingTime] = useAtom(cookingTimeAtom);
  const [portions, setPortions] = useAtom(portionsAtom);
  const setRecipes = useSetAtom(recipesAtom);

  const timeOptions = [
    {
      value: 15,
      label: "Rápido",
      subtitle: "15 minutos",
      icon: <Zap size={24} />,
      description: "Comidas express",
    },
    {
      value: 30,
      label: "Moderado",
      subtitle: "30 minutos",
      icon: <Coffee size={24} />,
      description: "Tiempo equilibrado",
    },
    {
      value: 60,
      label: "Elaborado",
      subtitle: "60+ minutos",
      icon: <Utensils size={24} />,
      description: "Recetas completas",
    },
  ];

  const handleContinue = async () => {
    setRecipes([]); // Clear previous recipes to force regeneration
    navigate("/recipes");
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/ingredients")}
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.header}
          >
            <div className={styles.iconWrapper}>
              <Clock size={32} />
            </div>
            <h1 className={styles.title}>¿Cuánto tiempo tienes?</h1>
            <p className={styles.description}>
              Selecciona el tiempo que puedes dedicar a cocinar y te
              recomendaremos recetas apropiadas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.options}
          >
            {timeOptions.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`${styles.option} ${
                  cookingTime === option.value ? styles.selected : ""
                }`}
                onClick={() => setCookingTime(option.value)}
              >
                <div className={styles.optionIcon}>{option.icon}</div>
                <div className={styles.optionContent}>
                  <h3 className={styles.optionLabel}>{option.label}</h3>
                  <p className={styles.optionSubtitle}>{option.subtitle}</p>
                  <p className={styles.optionDescription}>
                    {option.description}
                  </p>
                </div>
                <div
                  className={`${styles.radio} ${
                    cookingTime === option.value ? styles.radioSelected : ""
                  }`}
                >
                  {cookingTime === option.value && (
                    <div className={styles.radioInner} />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={styles.portionsSection}
          >
           <div className={styles.sectionHeader}>
              <Users size={24} color="var(--color-primary)" />
              <h2>¿Para cuántas personas?</h2>
           </div>
           <div className={styles.portionsInputWrapper}>
              <button 
                className={styles.portionsButton}
                onClick={() => setPortions(Math.max(1, portions - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={portions}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0 && val <= 20) setPortions(val);
                }}
                className={styles.portionsInput}
              />
              <span>personas</span>
              <button 
                className={styles.portionsButton}
                onClick={() => setPortions(Math.min(20, portions + 1))}
              >
                +
              </button>
           </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={styles.actions}
          >
            <Button
              size="lg"
              onClick={handleContinue}
              className={styles.continueButton}
            >
              Generar recetas
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
