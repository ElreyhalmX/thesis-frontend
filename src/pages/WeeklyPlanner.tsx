
import { motion } from 'framer-motion';
import { useAtom, useSetAtom } from 'jotai';
import { ArrowLeft, Calendar, Download, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import RecipeCard from '../components/RecipeCard';
import { generateWeeklyPlan, WeeklyPlanItem } from '../services/recipes';
import { ingredientsAtom, recipesAtom } from '../store/atoms';
import styles from './WeeklyPlanner.module.scss';
// PDF export will be added here
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const [ingredients] = useAtom(ingredientsAtom);
  const setGlobalRecipes = useSetAtom(recipesAtom);
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeeklyPlanItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateWeeklyPlan(ingredients.map(i => i.name), 1);
      
      // Augment recipe IDs to ensure uniqueness and navigation
      const augmentedPlan = result.map((item, idx) => ({
        ...item,
        recipe: { ...item.recipe, id: `weekly-${Date.now()}-${idx}` }
      }));

      setPlan(augmentedPlan);
      
      // Update global recipe store so RecipeView can find them
      setGlobalRecipes(prev => {
        const newRecipes = augmentedPlan.map(p => p.recipe);
        // Avoid duplicates if possible, or just append
        return [...newRecipes, ...prev];
      });

    } catch (err) {
      setError('No se pudo generar el plan semanal. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById('weekly-plan-content');
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: '#121212', // Match dark theme
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('mi-plan-semanal.pdf');
      
      return true;
    } catch (err) {
      console.error("PDF Export failed", err);
      return false;
    }
  };

  const handleShare = async () => {
    // Prompt download first
    await downloadPDF();
    
    // Then open WhatsApp with text
    const text = "📅 *Mi Plan Semanal - Culinary AI*\n\n" + 
      "He generado mi menú semanal personalizado. ¡Descarga el PDF para verlo!\n\n" +
      "Descubre más en: culinary-ai-app.com"; // Placeholder URL
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/ingredients')}>
          <ArrowLeft size={20} />
          Volver a Ingredientes
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <Calendar size={32} />
          </div>
          <h1>Planificador Semanal Inteligente</h1>
          <p>Genera un menú de 5 días basado en tus {ingredients.length} ingredientes.</p>
        </header>

        {loading ? (
             <div className={styles.loadingState}>
                <Loader2 className={`${styles.spinner} animate-spin`} size={48} />
                <p>Diseñando tu menú semanal perfecto...</p>
                <small>Esto puede tomar unos segundos.</small>
             </div>
        ) : plan.length === 0 ? (
          <div className={styles.emptyState}>
            {ingredients.length === 0 ? (
                <>
                <p>Necesitas ingredientes para generar un plan.</p>
                <Button onClick={() => navigate('/ingredients')}>Ir a agregar ingredientes</Button>
                </>
            ) : (
                <>
                <p>Genera recetas completas para toda tu semana.</p>
                <Button onClick={handleGeneratePlan} size="lg">
                <Sparkles /> Generar Plan Semanal
                </Button>
                </>
            )}
          </div>
        ) : (
          <div className={styles.results} id="weekly-plan-content">
            <div className={styles.actions}>
              <h3>Tu Menú Semanal</h3>
              <Button onClick={handleShare} variant="outline" className={styles.shareButton}>
                <Download size={18} /> Descargar y Compartir
              </Button>
            </div>
            
            <div className={styles.grid}>
              {plan.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <RecipeCard 
                    recipe={item.recipe}
                    dayBadge={item.day}
                    onClick={() => navigate(`/recipe/${item.recipe.id}`)}
                  />
                  <p className={styles.rationaleSmall}>💡 {item.rationale}</p>
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
