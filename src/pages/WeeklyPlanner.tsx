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
import { generateWeeklyPlan } from '../services/recipes';
import { ingredientsAtom, recipesAtom, weeklyPlanAtom } from '../store/atoms';
import styles from './WeeklyPlanner.module.scss';

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const [ingredients] = useAtom(ingredientsAtom);
  const setGlobalRecipes = useSetAtom(recipesAtom);
  
  const [plan, setPlan] = useAtom(weeklyPlanAtom);
  
  const [loading, setLoading] = useState(false);
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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    
    const container = document.getElementById('pdf-generator-container');
    if (!container) return;

    try {
      const recipeElements = container.getElementsByClassName('pdf-recipe-page');

      for (let i = 0; i < recipeElements.length; i++) {
         const element = recipeElements[i] as HTMLElement;
         
         // 1. Capture the full recipe (which might be tall) with reduced scale for compression
         const canvas = await html2canvas(element, {
             scale: 1.5,
             backgroundColor: '#1a1a1a',
             windowWidth: 794 // Exact A4 width at 96dpi
         });

         // Use JPEG compression (0.8 quality) for smaller file size
         const imgData = canvas.toDataURL('image/jpeg', 0.8);
         const imgHeight = (canvas.height * pageWidth) / canvas.width;
         
         let heightLeft = imgHeight;
         let position = 0;

         // Always start a new recipe on a new page (except the very first one)
         if (i > 0) pdf.addPage();

         // Add first chunk
         pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
         heightLeft -= pageHeight;

         // Add remaining chunks if it overflows (smart splitting)
         while (heightLeft > 0) {
             position -= pageHeight; // Move the image up
             pdf.addPage();
             pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
             heightLeft -= pageHeight;
         }
      }

      pdf.save('Sabores-Universitarios-Plan-Semanal.pdf');
    } catch (err) {
        console.error("PDF Generation Error", err);
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
                </motion.div>
              ))}
            </div>

            {/* Hidden container for PDF generation - One block per recipe */}
            <div 
                id="pdf-generator-container" 
                style={{ 
                    position: 'absolute', 
                    left: '-9999px',
                    top: 0,
                    width: '794px' // Fixed width for A4
                }}
            >
                {plan.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="pdf-recipe-page"
                        style={{ 
                            padding: '40px',
                            background: '#1a1a1a', 
                            color: '#e0e0e0',
                            fontFamily: 'Inter, sans-serif',
                            width: '794px',       
                            minHeight: '1123px',  // Start at A4 height but grow
                            height: 'auto',       
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #ff6b6b', paddingBottom: '20px' }}>
                            <h1 style={{ color: '#ff6b6b', margin: 0, fontSize: '28px' }}>Sabores Universitarios</h1>
                            <p style={{ margin: '5px 0 0', opacity: 0.7 }}>Plan Semanal Inteligente</p>
                        </div>

                        {/* Recipe Title & Day */}
                        <div style={{ marginBottom: '30px' }}>
                             <span style={{ 
                                 display: 'inline-block', 
                                 background: '#4ecdc4', 
                                 color: '#000', 
                                 padding: '5px 15px', 
                                 borderRadius: '20px', 
                                 fontWeight: 'bold', 
                                 marginBottom: '10px' 
                             }}>
                                {item.day}
                             </span>
                             <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#fff' }}>{item.recipe.title}</h2>
                             <div style={{ display: 'flex', gap: '20px', color: '#aaa', fontSize: '16px' }}>
                                <span>⏱️ {item.recipe.prepTime} min</span>
                                <span>👥 {item.recipe.servings} porciones</span>
                                <span>📊 {item.recipe.nutrition?.calories || 'N/A'} Kcal</span>
                             </div>
                        </div>

                        {/* Description */}
                        <p style={{ fontStyle: 'italic', color: '#ccc', lineHeight: '1.5', marginBottom: '30px', background: '#252525', padding: '15px', borderRadius: '8px' }}>
                            {item.recipe.description || item.rationale}
                        </p>

                        {/* Content Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
                            {/* Ingredients */}
                            <div>
                                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', color: '#4ecdc4' }}>Ingredientes</h3>
                                <ul style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                                    {item.recipe.ingredients.map((ing, i) => (
                                        <li key={i} style={{ marginBottom: '5px' }}>{ing}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Nutrition & Tips */}
                            <div>
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', color: '#4ecdc4' }}>Nutrición (por porción)</h3>
                                    {item.recipe.nutrition ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                            <div style={{ background: '#252525', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.recipe.nutrition.protein}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Proteína</div>
                                            </div>
                                            <div style={{ background: '#252525', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.recipe.nutrition.carbs}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Carbs</div>
                                            </div>
                                            <div style={{ background: '#252525', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.recipe.nutrition?.fat || 'N/A'}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Grasas</div>
                                            </div>
                                        </div>
                                    ) : <p style={{ opacity: 0.5 }}>Información no disponible.</p>}
                                </div>
                                
                                {item.recipe.tips && item.recipe.tips.length > 0 && (
                                    <div>
                                        <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', color: '#ffe66d' }}>Chef Tips</h3>
                                        <ul style={{ paddingLeft: '20px', marginTop: '15px', fontSize: '14px', fontStyle: 'italic', color: '#e0e0e0' }}>
                                            {item.recipe.tips.map((tip, i) => (
                                                <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Instructions - Full width at bottom */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', color: '#4ecdc4' }}>Instrucciones</h3>
                            <ol style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                                {item.recipe.instructions.map((inst, i) => (
                                    <li key={i} style={{ marginBottom: '10px' }}>{inst}</li>
                                ))}
                            </ol>
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
