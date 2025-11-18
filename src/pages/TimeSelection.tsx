import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import {
  Clock,
  ChevronRight,
  ArrowLeft,
  Zap,
  Coffee,
  Utensils,
} from "lucide-react";
import { cookingTimeAtom } from "../store/atoms";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import styles from "./TimeSelection.module.scss";

export default function TimeSelection() {
  const navigate = useNavigate();
  const [cookingTime, setCookingTime] = useAtom(cookingTimeAtom);

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
