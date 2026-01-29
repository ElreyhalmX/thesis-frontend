import { motion } from 'framer-motion';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({ width = '100%', height = '100%', className = '' }: SkeletonProps) {
  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={{ width, height }}
    >
      <motion.div
        className={styles.shimmer}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
      <div className={styles.iconContainer}>
          <span className={styles.loadingText}>Generando imagen IA...</span>
      </div>
    </div>
  );
}
