
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { ArrowLeft, DollarSign, History as HistoryIcon, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { historyAtom } from '../store/atoms';
import styles from './History.module.scss';

export default function History() {
  const navigate = useNavigate();
  const [history] = useAtom(historyAtom);

  const totalRecipes = history.length;
  const totalSavings = history.reduce((acc, item) => acc + item.estimatedSavings, 0);
  const BCV_RATE = 363.66;

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Volver al Inicio
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <HistoryIcon size={32} />
          </div>
          <h1>Historial y Ahorro</h1>
          <p>Tus logros culinarios y simulación de impacto económico.</p>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><TrendingUp /></div>
            <h3>Recetas Cocinadas</h3>
            <p className={styles.statValue}>{totalRecipes}</p>
          </div>
          <div className={styles.statCard}>
             <div className={styles.statIcon} style={{ color: '#10b981' }}><DollarSign /></div>
            <h3>Ahorro Estimado</h3>
            <p className={styles.statValue} style={{ color: '#10b981' }}>${totalSavings.toFixed(2)}</p>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>~Bs. {(totalSavings * BCV_RATE).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <span className={styles.statSub}>vs. Comida en Calle (Tasa BCV: {BCV_RATE})</span>
          </div>
        </div>

        <div className={styles.timeline}>
          <h2>Actividad Reciente</h2>
          {history.length === 0 ? (
            <p className={styles.empty}>No has marcado ninguna receta como cocinada aún.</p>
          ) : (
            <div className={styles.list}>
              {history.slice().reverse().map((item) => (
                <motion.div 
                    key={item.id} 
                    className={styles.historyItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                  <div className={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</div>
                  <div className={styles.itemContent}>
                    <h4>{item.recipeTitle}</h4>
                    <span className={styles.itemSavings}>+${item.estimatedSavings} (~Bs. {(item.estimatedSavings * BCV_RATE).toFixed(2)}) ahorrados</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
