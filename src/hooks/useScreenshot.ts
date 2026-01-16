import html2canvas from 'html2canvas';
import { useState } from 'react';

export function useScreenshot() {
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async (elementId: string, fileName: string = 'recipe-screenshot') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      setIsCapturing(true);
      
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, // Better resolution
        backgroundColor: '#ffffff', // Ensure white background
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return { capture, isCapturing };
}
