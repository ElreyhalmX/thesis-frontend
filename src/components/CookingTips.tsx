import { motion } from 'framer-motion'
import { Lightbulb, Flame, Clock, Utensils } from 'lucide-react'
import styles from './CookingTips.module.scss'

interface Tip {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  category: string
}

const COOKING_TIPS: Tip[] = [
  {
    id: '1',
    icon: <Flame size={32} />,
    title: 'Marinado de Arepas',
    description:
      'Para arepas más jugosas, marina la masa con caldo de pollo tibia 30 minutos antes de cocinar. Esto le dará más sabor y textura.',
    category: 'Venezuelan',
  },
  {
    id: '2',
    icon: <Clock size={32} />,
    title: 'Economía de Tiempo',
    description:
      'Prepara ingredientes base los domingos: sofrito, cebolla picada y ajíes. ¡Tendrás recetas listas en 15 minutos cualquier día!',
    category: 'Time-Saving',
  },
  {
    id: '3',
    icon: <Utensils size={32} />,
    title: 'Secreto del Sofrito',
    description:
      'El sofrito es la base de la cocina venezolana. Cocina cebolla, ajo y ajíes a fuego lento hasta que liberen sus aromas. Congela en cubetas.',
    category: 'Venezuelan',
  },
  {
    id: '4',
    icon: <Lightbulb size={32} />,
    title: 'Sustituciones Inteligentes',
    description:
      'Sin ingredientes exactos? El queso mozzarella funciona para tequeños, el plátano verde reemplaza al yuca, y la avena sustituye la harina de maíz.',
    category: 'Budget-Friendly',
  },
]

export default function CookingTips() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className={styles.tipsSection}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={styles.header}
      >
        <h2 className={styles.title}>Consejos Culinarios Prácticos</h2>
        <p className={styles.subtitle}>
          Tips de cocina venezolana y trucos generales para cocinar como un profesional
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={styles.tipsGrid}
      >
        {COOKING_TIPS.map((tip) => (
          <motion.div key={tip.id} variants={itemVariants} className={styles.tipCard}>
            <motion.div
              className={styles.iconWrapper}
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {tip.icon}
            </motion.div>
            <h3 className={styles.tipTitle}>{tip.title}</h3>
            <p className={styles.tipDescription}>{tip.description}</p>
            <div className={styles.badge}>{tip.category}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
