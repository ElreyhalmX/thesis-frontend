import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import styles from './Toast.module.scss'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
}

export default function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
}: ToastProps) {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`${styles.toast} ${styles[type]}`}
        >
          <div className={styles.icon}>{icons[type]}</div>
          <p className={styles.message}>{message}</p>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
