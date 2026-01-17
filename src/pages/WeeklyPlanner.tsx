
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useAtom, useSetAtom } from 'jotai';
import jsPDF from 'jspdf';
import { ArrowLeft, Calendar, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';
import RecipeCard from '../components/RecipeCard';
import { generateWeeklyPlan, WeeklyPlanItem } from '../services/recipes';
import { ingredientsAtom, recipesAtom } from '../store/atoms';
import styles from './WeeklyPlanner.module.scss';

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
    const input = document.getElementById('weekly-plan-print-content');
    if (!input) return;

    // Temporarily make it visible for capture (opacity 0 -> 1 is not enough, needs to be rendered)
    // It's already rendered but off-screen.
    
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: '#121212', // Match dark theme
        useCORS: true,
        windowWidth: 1200 // Force width
      });
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('mi-plan-semanal.pdf');
      
      return true;
    } catch (err) {
      console.error("PDF Export failed", err);
      return false;
    }
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
             <Loader message="Diseñando tu menú semanal perfecto..." />
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
              <Button onClick={downloadPDF} variant="outline" className={styles.shareButton}>
                <Download size={18} /> Descargar Menú Semanal
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
                    onClick={() => navigate(`/recipe/${item.recipe.id}`, { state: { from: '/planner' } })}
                  />
                  {/* Eliminated the extra info lightbulb here */}
                </motion.div>
              ))}
            </div>

            {/* Hidden container for PDF generation */}
            <div 
                id="weekly-plan-print-content" 
                style={{ 
                    position: 'absolute', 
                    left: '-9999px',
                    top: 0,
                    width: '1000px', // Fixed width for consistent PDF layout
                    padding: '40px',
                    background: '#121212',
                    color: '#fff',
                    fontFamily: 'sans-serif'
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#ff6b6b' }}>Mi Plan Semanal - Culinary AI</h1>
                {plan.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '30px' }}>
                        <h2 style={{ color: '#4ecdc4', fontSize: '24px', marginBottom: '10px' }}>{item.day}: {item.recipe.title}</h2>
                        
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '14px', color: '#888' }}>
                            <span>⏱️ {item.recipe.prepTime} min</span>
                            <span>👥 {item.recipe.servings} porciones</span>
                        </div>

                        <p style={{ fontStyle: 'italic', marginBottom: '20px', color: '#ccc' }}>
                            {item.recipe.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Ingredientes</h3>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                                    {item.recipe.ingredients.map((ing, i) => (
                                        <li key={i} style={{ marginBottom: '5px' }}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Instrucciones</h3>
                                <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', marginTop: '10px' }}>
                                    {item.recipe.instructions.map((inst, i) => (
                                        <li key={i} style={{ marginBottom: '8px' }}>{inst}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </PageTransition>
  );
}
