
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useAtom } from 'jotai';
import jsPDF from 'jspdf';
import { ArrowLeft, DollarSign, Download, History as HistoryIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import RecipePDF from '../components/RecipePDF';
import { historyAtom, recipesAtom } from '../store/atoms';
import styles from './History.module.scss';

export default function History() {
  const navigate = useNavigate();
  const [history] = useAtom(historyAtom);
  const [recipes] = useAtom(recipesAtom);
  const [pdfRecipe, setPdfRecipe] = useState<any>(null); // State to trigger PDF render

  const totalRecipes = history.length;
  const totalSavings = history.reduce((acc, item) => acc + item.estimatedSavings, 0);
  const BCV_RATE = 370.25;

  const handleDownload = async (recipeId: string) => {
    const targetRecipe = recipes.find(r => r.id === recipeId);
    if (!targetRecipe) {
        alert("Receta no encontrada (quizás fue eliminada)");
        return;
    }

    // Set recipe to state to render the hidden PDF component
    setPdfRecipe(targetRecipe);

    // Wait for render cycle
    setTimeout(async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        
        const element = document.getElementById('history-pdf-hidden');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
             scale: 1.5,
             backgroundColor: '#FFFFFF',
             windowWidth: 794 
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

            pdf.save(`${targetRecipe.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            setPdfRecipe(null); // Clear after download
        } catch (err) {
            console.error("PDF Generation Error", err);
            setPdfRecipe(null);
        }
    }, 100);
  };

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
                  <button 
                    onClick={() => handleDownload(item.recipeId)}
                    className={styles.downloadButton}
                    title="Descargar PDF nuevamente"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff9f1c', marginLeft: 'auto' }}
                  >
                    <Download size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Hidden container for PDF generation */}
      <RecipePDF recipe={pdfRecipe} id="history-pdf-hidden" />
    </PageTransition>
  );
}
