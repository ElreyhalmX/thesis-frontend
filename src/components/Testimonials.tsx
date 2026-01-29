import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import styles from './Testimonials.module.scss'

interface Testimonial {
  id: string
  name: string
  country: string
  quote: string
  rating: number
  avatar: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Oriana Arias',
    country: 'Venezuela',
    quote: 'Como estudiante foranea de la carrera de odontologia en la que no me da mucho tiempo de organizar mis comidas me parece una excelente inciativa porque me permite  organizar mi plan semanal de comidas en poco tiempo',
    rating: 5,
    avatar: '👩‍🎓',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    country: 'Taiwán',
    quote: 'Vivía fuera de la cocina, pero con Sabores Universitarios aprendí que no es difícil. Las recetas son claras y los ingredientes están siempre disponibles.',
    rating: 5,
    avatar: '👨‍🎓',
  },
  {
    id: '3',
    name: 'Isabella Petrov',
    country: 'Rusia',
    quote: 'La comida venezolana es increíble y ahora puedo prepararla en mi apartamento. ¡El pabellón criollo quedó perfecto la primera vez!',
    rating: 5,
    avatar: '👩‍🎓',
  },
  {
    id: '4',
    name: 'Ahmed Karim',
    country: 'Marruecos',
    quote: 'La mejor app para estudiantes. No solo aprendo a cocinar, sino que también aprendo sobre la cultura venezolana a través de la comida.',
    rating: 5,
    avatar: '👨‍🎓',
  },
]

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className={styles.testimonialsSection}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={styles.header}
      >
        <h2 className={styles.title}>Lo que dicen nuestros estudiantes</h2>
        <p className={styles.subtitle}>
          Historias reales de estudiantes internacionales que transformaron su forma de cocinar
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={styles.testimonialGrid}
      >
        {TESTIMONIALS.map((testimonial) => (
          <motion.div key={testimonial.id} variants={itemVariants} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{testimonial.avatar}</div>
              <div className={styles.info}>
                <h3 className={styles.name}>{testimonial.name}</h3>
                <p className={styles.country}>{testimonial.country}</p>
              </div>
            </div>

            <div className={styles.rating}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill="#ff9f1c"
                  color="#ff9f1c"
                  className={styles.star}
                />
              ))}
            </div>

            <p className={styles.quote}>{testimonial.quote}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
