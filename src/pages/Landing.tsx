import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, Sparkles, Clock, DollarSign } from 'lucide-react'
import Button from '../components/Button'
import PageTransition from '../components/PageTransition'
import styles from './Landing.module.scss'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'IA Personalizada',
      description: 'Recomendaciones adaptadas a tus ingredientes y preferencias venezolanas',
    },
    {
      icon: <Clock size={24} />,
      title: 'Rápido y Práctico',
      description: 'Recetas según tu tiempo disponible, desde 15 minutos',
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Económico',
      description: 'Optimiza tu presupuesto con ingredientes accesibles',
    },
  ]

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.hero}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={styles.iconWrapper}
          >
            <ChefHat size={48} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.title}
          >
            Sabores Universitarios
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={styles.subtitle}
          >
            Tu asistente culinario inteligente. Transforma tus ingredientes en
            recetas deliciosas, económicas y adaptadas al contexto venezolano.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/ingredients')}
              className={styles.ctaButton}
            >
              Comenzar a cocinar
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={styles.features}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className={styles.featureCard}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  )
}
