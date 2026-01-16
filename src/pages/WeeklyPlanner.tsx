
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { ArrowLeft, Calendar, Loader2, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { generateWeeklyPlan, WeeklyPlanItem } from '../services/recipes';
import { ingredientsAtom } from '../store/atoms';
import styles from './WeeklyPlanner.module.scss';

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const [ingredients] = useAtom(ingredientsAtom);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeeklyPlanItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateWeeklyPlan(ingredients.map(i => i.name), 1);
      setPlan(result);
    } catch (err) {
      setError('No se pudo generar el plan semanal. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sharePlan = () => {
    const text = "📅 *Mi Plan Semanal - Culinary AI*\n\n" + 
      plan.map(d => `*${d.day}*: ${d.meal}`).join("\n") + 
      "\n\nDescubre más en Culinary AI!";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Volver
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <Calendar size={32} />
          </div>
          <h1>Planificador Semanal Inteligente</h1>
          <p>Genera un menú de 5 días basado en tus ingredientes para ahorrar dinero y tiempo.</p>
        </header>

        {plan.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Usaremos tus {ingredients.length} ingredientes para crear el plan perfecto.</p>
            <Button onClick={handleGeneratePlan} disabled={loading || ingredients.length === 0} size="lg">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generar Plan Semanal
            </Button>
            {ingredients.length === 0 && <span className={styles.hint}>Agrega ingredientes primero</span>}
          </div>
        ) : (
          <div className={styles.results}>
            <div className={styles.actions}>
              <h3>Tu Menú Semanal</h3>
              <Button onClick={sharePlan} variant="outline" className={styles.shareButton}>
                <Share2 size={18} /> Compartir
              </Button>
            </div>
            
            <div className={styles.grid}>
              {plan.map((item, idx) => (
                <motion.div 
                  key={idx}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={styles.dayBadge}>{item.day}</div>
                  <h4>{item.meal}</h4>
                  <p className={styles.rationale}>{item.rationale}</p>
                  <div className={styles.miniIngredients}>
                    {item.ingredientsNeeded.slice(0, 3).map((ing, i) => (
                      <span key={i}>{ing}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </PageTransition>
  );
}
