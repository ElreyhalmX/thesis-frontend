import { motion } from 'framer-motion'
import { ChefHat, Clock, DollarSign, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import PageTransition from '../components/PageTransition'
import { useStats } from '../hooks/useStats'
import styles from './Landing.module.scss'

export default function Landing() {
  const navigate = useNavigate()
  const stats = useStats()

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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.topNav}
            style={{ 
              position: 'absolute', 
              top: '2rem', 
              right: '2rem', 
              display: 'flex', 
              gap: '1.5rem', 
              zIndex: 50 
            }}
          >
             <button 
               onClick={() => navigate('/history')} 
               style={{ 
                 background: 'rgba(255,255,255,0.1)', 
                 border: '1px solid rgba(255,255,255,0.2)',
                 padding: '0.5rem 1rem',
                 borderRadius: '20px', 
                 color: '#fff', 
                 cursor: 'pointer',
                 fontSize: '0.9rem',
                 fontWeight: 500,
                 backdropFilter: 'blur(10px)'
               }}
             >
               📜 Historial
             </button>
             <button 
               onClick={() => navigate('/profile')} 
               style={{ 
                 background: 'rgba(255,255,255,0.1)', 
                 border: '1px solid rgba(255,255,255,0.2)',
                 padding: '0.5rem 1rem',
                 borderRadius: '20px', 
                 color: '#fff', 
                 cursor: 'pointer',
                 fontSize: '0.9rem',
                 fontWeight: 500,
                 backdropFilter: 'blur(10px)'
               }}
             >
               👤 Mi Perfil
             </button>
          </motion.div>

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className={styles.statsContainer}
          >
             <div className={styles.statItem}>
               <span className={styles.statValue}>
                 {stats.total_recipes > 0 ? stats.total_recipes : "-"}
               </span>
               <span className={styles.statLabel}>Recetas Generadas</span>
             </div>
             <div className={styles.statDivider} />
             <div className={styles.statItem}>
               <span className={styles.statValue}>
                 {stats.total_likes > 0 ? stats.total_likes : "-"}
               </span>
               <span className={styles.statLabel}>Likes Totales</span>
             </div>
          </motion.div>
          
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
