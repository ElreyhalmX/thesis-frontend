import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './ImageCarousel.module.scss'

interface CarouselImage {
  id: string
  url: string
  alt: string
  title: string
  description: string
}

const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
    alt: 'Empanadas venezolanas',
    title: 'Empanadas',
    description: 'Deliciosas empanadas rellenas de queso y carne',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
    alt: 'Arepas venezolanas',
    title: 'Arepas',
    description: 'Las arepas, símbolo de la gastronomía venezolana',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
    alt: 'Cachapas',
    title: 'Cachapas',
    description: 'Dulces cachapas con queso de mano y salsa',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1515182629504-727d32753b41?w=800&h=500&fit=crop',
    alt: 'Hallacas venezolanas',
    title: 'Hallacas',
    description: 'Tradición culinaria en cada hallaca',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
    alt: 'Tequeños',
    title: 'Tequeños',
    description: 'Tequeños crujientes, perfectos para cualquier ocasión',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop',
    alt: 'Pabellón criollo',
    title: 'Pabellón Criollo',
    description: 'El plato nacional por excelencia',
  },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1
    )
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    setAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoPlay(false)
  }

  const currentImage = CAROUSEL_IMAGES[currentIndex]

  return (
    <section className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.imageContainer}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className={styles.carouselImage}
              onLoad={() => setAutoPlay(true)}
            />
            <div className={styles.overlay} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={styles.imageCaption}
            >
              <h3 className={styles.imageTitle}>{currentImage.title}</h3>
              <p className={styles.imageDescription}>{currentImage.description}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={goToPrevious}
          className={styles.controlButton + ' ' + styles.prevButton}
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className={styles.controlButton + ' ' + styles.nextButton}
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={styles.dotsContainer}>
        {CAROUSEL_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={
              styles.dot + ' ' + (index === currentIndex ? styles.activeDot : '')
            }
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
