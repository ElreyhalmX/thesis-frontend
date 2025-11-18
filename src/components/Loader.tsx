import { motion } from 'framer-motion'
import styles from './Loader.module.scss'

interface LoaderProps {
  message?: string
}

export default function Loader({ message = 'Cargando...' }: LoaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.loaderWrapper}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className={styles.spinnerInner} />
        </motion.div>
        <motion.p
          className={styles.message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}
