import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ArrowLeft, CheckCircle, ChefHat, Clock, Download, Heart, Lightbulb, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import PageTransition from '../components/PageTransition'
import Skeleton from '../components/Skeleton'
import apiClient from '../config/axios'
// import { useScreenshot } from '../hooks/useScreenshot' // Removed
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { historyAtom, recipesAtom } from '../store/atoms'
import styles from './RecipeView.module.scss'

export default function RecipeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [recipes] = useAtom(recipesAtom)
  const [, setHistory] = useAtom(historyAtom)
  const [liked, setLiked] = useState(false)
  const [cooked, setCooked] = useState(false)
  const [aiImage, setAiImage] = useState<string | null>(null)
  // const { capture, isCapturing } = useScreenshot()

  const recipe = recipes.find((r) => r.id === id)

  useEffect(() => {
    if (recipe) {
        // Try cache first
        const cached = sessionStorage.getItem(`img_gen_${recipe.id}`);
        if (cached) {
            setAiImage(cached);
        } else {
            // Fetch if not cached
             apiClient.post('/images/generate', { title: recipe.title, ingredients: recipe.ingredients })
                .then(res => {
                    if (res.data?.image) {
                        setAiImage(res.data.image);
                        sessionStorage.setItem(`img_gen_${recipe.id}`, res.data.image);
                    }
                })
                .catch(err => console.error("View Image Gen Error", err));
        }
    }
  }, [recipe]);

  // ... (existing useEffect)

  // downloadPDF removed as it was unused after removing share functionality.


  const handleMarkCooked = () => {
    if (!recipe || cooked) return;
    
    // Simulate savings: Restaurant ($13) - Home ($3) = $10 saved per serving * servings
    // User feedback: Street food is expensive (> $8). Using conservative $10 saving.
    const estimatedSavings = 10 * recipe.servings;
    
    const newItem = {
      id: `history-${Date.now()}`,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      date: new Date().toISOString(),
      estimatedSavings: estimatedSavings
    };
    
    setHistory(prev => [...prev, newItem]);
    
    // Toggle cooked state locally and persist (simple version)
    setCooked(true);
    const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes') || '[]');
    if (!cookedRecipes.includes(recipe.id)) {
        cookedRecipes.push(recipe.id);
        localStorage.setItem('cookedRecipes', JSON.stringify(cookedRecipes));
    }
  };

  useEffect(() => {
    if (id) {
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
      if (likedRecipes.includes(id)) {
        setLiked(true)
      }
      
      const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes') || '[]')
      if (cookedRecipes.includes(id)) {
        setCooked(true)
      }
    }
  }, [id])

  // Determine back destination
  const backDestination = location.state?.from === '/planner' ? '/planner' : '/recipes';
  const backLabel = location.state?.from === '/planner' ? 'Volver al Plan Semanal' : 'Volver a las recetas';

  if (!recipe) {
    return (
      <PageTransition>
        <div className={styles.errorContainer}>
          <h2>Receta no encontrada</h2>
          <Button onClick={() => navigate('/recipes')}>
            Volver a las recetas
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleLike = async () => {
    if (liked || !id) return

    try {
      await apiClient.post('/metrics/like')
      setLiked(true)
      const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
      if (!likedRecipes.includes(id)) {
        likedRecipes.push(id)
        localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes))
      }
    } catch (error) {
      console.error('Error liking recipe:', error)
    }
  }

  const downloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    
    const element = document.getElementById('recipe-pdf-container');
    if (!element) return;

    try {
         const canvas = await html2canvas(element, {
             scale: 1.5,
             backgroundColor: '#FFFFFF',
             windowWidth: 794 // Exact A4 width at 96dpi
         });

         const imgData = canvas.toDataURL('image/jpeg', 0.8);
         const imgHeight = (canvas.height * pageWidth) / canvas.width;
         
         let heightLeft = imgHeight;
         let position = 0;

         pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
         heightLeft -= pageHeight;

         while (heightLeft > 0) {
             position -= pageHeight;
             pdf.addPage();
             pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
             heightLeft -= pageHeight;
         }

         pdf.save(`${recipe.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
        console.error("PDF Generation Error", err);
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(backDestination)}>
          <ArrowLeft size={20} />
          {backLabel}
        </button>

        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.heroImageContainer}
            style={{ marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', height: '300px' }}
          >
             {aiImage ? (
                <img 
                src={aiImage}
                alt={recipe.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
             ) : (
                <Skeleton height="100%" />
             )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.header}
          >
            <div className={styles.headerTop}>
              <div className={styles.titleContainer}>
                <h1 className={styles.title}>{recipe.title}</h1>
                <span className={styles.difficulty}>{recipe.difficulty}</span>
              </div>
              
              <div className={styles.headerActions}>
                <button 
                  className={`${styles.actionButton} ${liked ? styles.active : ''}`}
                  onClick={handleLike}
                  disabled={liked}
                  title={liked ? "Liked!" : "Like recipe"}
                >
                  <Heart size={20} fill={liked ? "currentColor" : "none"} />
                </button>
                <button 
                  className={`${styles.actionButton} ${cooked ? styles.active : ''}`}
                  onClick={handleMarkCooked}
                  disabled={cooked}
                  title={cooked ? "Ya cocinaste esto" : "Marcar como cocinada"}
                >
                  <CheckCircle size={20} fill={cooked ? "currentColor" : "none"} />
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={downloadPDF}
                  title="Descargar PDF"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
            <p className={styles.description}>{recipe.description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Clock size={20} />
                <div>
                  <span className={styles.metaLabel}>Tiempo</span>
                  <span className={styles.metaValue}>{recipe.prepTime} min</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <Users size={20} />
                <div>
                  <span className={styles.metaLabel}>Porciones</span>
                  <span className={styles.metaValue}>{recipe.servings}</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <ChefHat size={20} />
                <div>
                  <span className={styles.metaLabel}>Ingredientes</span>
                  <span className={styles.metaValue}>{recipe.ingredients.length}</span>
                </div>
              </div>
            </div>

            {recipe.nutrition && (
              <div className={styles.nutritionCard}>
                <div className={styles.nutritionHeader}>
                  Información Nutricional <span className={styles.nutritionSub}>(estimada por porción)</span>
                </div>
                <div className={styles.macros}>
                  <div className={styles.macro}>
                    <span className={styles.macroValue}>{recipe.nutrition.calories}</span>
                    <span className={styles.macroLabel}>Kcal</span>
                  </div>
                  <div className={styles.macro}>
                    <span className={styles.macroValue}>{recipe.nutrition.protein}</span>
                    <span className={styles.macroLabel}>Proteínas</span>
                  </div>
                  <div className={styles.macro}>
                    <span className={styles.macroValue}>{recipe.nutrition.carbs}</span>
                    <span className={styles.macroLabel}>Carbohidratos</span>
                  </div>
                  <div className={styles.macro}>
                    <span className={styles.macroValue}>{recipe.nutrition.fat}</span>
                    <span className={styles.macroLabel}>Grasas</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <div className={styles.sections}>
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>Ingredientes</h2>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={styles.ingredient}
                  >
                    <span className={styles.ingredientBullet}></span>
                    {ingredient}
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>Preparación</h2>
              <ol className={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={styles.instruction}
                  >
                    <span className={styles.instructionNumber}>{index + 1}</span>
                    <span className={styles.instructionText}>{instruction}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.section>

            {recipe.tips && recipe.tips.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={styles.section}
              >
                <div className={styles.tipsHeader}>
                  <Lightbulb size={20} />
                  <h2 className={styles.sectionTitle}>Tips y recomendaciones</h2>
                </div>
                <ul className={styles.tipsList}>
                  {recipe.tips.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={styles.tip}
                    >
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>
        </div>

        {/* Hidden PDF Container */}
        <div 
            id="recipe-pdf-container" 
            style={{ 
                position: 'absolute', 
                left: '-9999px',
                top: 0,
                width: '794px',
                padding: '40px',
                background: '#FFFFFF', 
                color: '#1a1a1a', 
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #ff9f1c', paddingBottom: '20px' }}>
                <h1 style={{ color: '#ff9f1c', margin: 0, fontSize: '28px' }}>Sabores Universitarios</h1>
                <p style={{ margin: '5px 0 0', opacity: 0.7, color: '#ffbf69' }}>Receta Individual</p>
            </div>

            {/* Recipe Title & Meta */}
            <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '32px', margin: '10px 0', color: '#ff9f1c' }}>{recipe.title}</h2>
                    <div style={{ display: 'flex', gap: '20px', color: '#555', fontSize: '16px' }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>⏱️ {recipe.prepTime} min</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>👥 {recipe.servings} porciones</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>📊 {recipe.difficulty}</span>
                    </div>
            </div>

            {/* Description */}
            <p style={{ fontStyle: 'italic', color: '#444', lineHeight: '1.5', marginBottom: '30px', background: '#cbf3f0', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2ec4b6' }}>
                {recipe.description}
            </p>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
                {/* Ingredients */}
                <div>
                    <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Ingredientes</h3>
                    <ul style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} style={{ marginBottom: '5px' }}>{ing}</li>
                        ))}
                    </ul>
                </div>

                {/* Nutrition */}
                <div>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Nutrición (por porción)</h3>
                        {recipe.nutrition ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition.protein}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Proteína</div>
                                </div>
                                <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition.carbs}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Carbs</div>
                                </div>
                                <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition?.fat || 'N/A'}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Grasas</div>
                                </div>
                                <div style={{ background: '#cbf3f0', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ec4b6' }}>{recipe.nutrition?.calories || 'N/A'}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Calorías</div>
                                </div>
                            </div>
                        ) : <p style={{ opacity: 0.5 }}>Información no disponible.</p>}
                    </div>
                </div>
            </div>

            {/* Instructions - Full width at bottom */}
            <div style={{ flex: 1 }}>
                <h3 style={{ borderBottom: '2px solid #2ec4b6', paddingBottom: '10px', color: '#2ec4b6' }}>Instrucciones</h3>
                <ol style={{ paddingLeft: '20px', marginTop: '15px', lineHeight: '1.6' }}>
                    {recipe.instructions.map((inst, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>{inst}</li>
                    ))}
                </ol>
            </div>
            
             {recipe.tips && recipe.tips.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #ff9f1c', paddingBottom: '10px', color: '#ff9f1c' }}>Chef Tips</h3>
                    <ul style={{ paddingLeft: '20px', marginTop: '15px', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
                        {recipe.tips.map((tip, i) => (
                            <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </PageTransition>
  )
}
