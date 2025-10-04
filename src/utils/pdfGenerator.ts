import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { EntryFormData, ImageData } from '../types';
import { format } from 'date-fns';

// Helper to preload an image and convert it to a Base64 string
const preloadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => reject(new Error(`Failed to load image at path: ${url}`));
    img.src = url;
  });
};

// HIGH quality conversion (minimal compression for good quality)
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        // Limit max dimensions while maintaining aspect ratio
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// STANDARD quality conversion (aggressive compression for mobile stability)
const compressAndConvertImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        // More aggressive compression for mobile devices
        const MAX_WIDTH = 600; // Reduced from 800
        const MAX_HEIGHT = 600;
        
        let { width, height } = img;
        
        // Calculate scaling to fit within max dimensions
        const widthScale = MAX_WIDTH / width;
        const heightScale = MAX_HEIGHT / height;
        const scale = Math.min(widthScale, heightScale, 1); // Don't upscale
        
        const finalWidth = Math.floor(width * scale);
        const finalHeight = Math.floor(height * scale);
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        // Enable better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        
        // More aggressive compression
        const compressedUrl = ctx.canvas.toDataURL('image/jpeg', 0.5); // Reduced from 0.6
        resolve(compressedUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

export const generatePDF = async (
  formData: EntryFormData,
  allImages: (ImageData | null)[],
  quality: 'high' | 'standard' = 'standard'
): Promise<Blob> => {
  const allImagesFlat = allImages.filter((img): img is ImageData => !!img && !!img.file);

  // Preload cover and end pages
  const coverPageBase64 = await preloadImageAsBase64('/coverpage.jpg');
  const endPageBase64 = await preloadImageAsBase64('/endpage.jpg');

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    precision: 2,
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const drawImageContainer = async (
    x: number,
    y: number,
    containerWidth: number,
    containerHeight: number,
    imageData: ImageData | null
  ) => {
    if (!imageData?.file) return;
    
    const borderRadius = 3;
    const borderThickness = 2.5;

    try {
      // Use appropriate compression based on quality setting
      const base64Img = quality === 'high'
        ? await convertImageToBase64(imageData.file)
        : await compressAndConvertImage(imageData.file);
        
      const img = new Image();
      img.src = base64Img;
      
      // Wait for image to load
      await new Promise<void>((resolve, reject) => { 
        img.onload = () => resolve(); 
        img.onerror = () => reject(new Error('Failed to load processed image'));
        
        // Add timeout to prevent hanging
        setTimeout(() => reject(new Error('Image load timeout')), 5000);
      });
      
      // Calculate scaled dimensions to fit container
      const fixedWidth = containerWidth;
      const aspectRatio = img.height / img.width;
      let scaledWidth = fixedWidth;
      let scaledHeight = scaledWidth * aspectRatio;
      
      if (scaledHeight > containerHeight) {
        scaledHeight = containerHeight;
        scaledWidth = scaledHeight / aspectRatio;
      }
      
      const drawX = x + (containerWidth - scaledWidth) / 2;
      const drawY = y + (containerHeight - scaledHeight) / 2;
      
      // Add image to PDF
      pdf.addImage(base64Img, 'JPEG', drawX, drawY, scaledWidth, scaledHeight);
      
      // Draw border
      pdf.setDrawColor('#FFFFFF');
      pdf.setLineWidth(borderThickness);
      pdf.roundedRect(x, y, containerWidth, containerHeight, borderRadius, borderRadius, 'S');
      
      // Add type label
      if (imageData.type === 'before' || imageData.type === 'after') {
        const label = imageData.type.toUpperCase();
        if (imageData.type === 'before') { 
          pdf.setFillColor(220, 38, 38); 
        } else { 
          pdf.setFillColor(0, 87, 63); 
        }
        pdf.setTextColor('#FFFFFF');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        const labelWidth = 20;
        const labelHeight = 7;
        const radius = 1;
        pdf.roundedRect(x + 3, y + 3, labelWidth, labelHeight, radius, radius, 'F');
        const textX = x + 3 + labelWidth / 2;
        const textY = y + 3 + labelHeight / 2 + 1.5;
        pdf.text(label, textX, textY, { align: 'center' });
      }
      
      // Add text overlay if present
      if (imageData.text) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(15);
        pdf.setTextColor(0, 0, 0);
        const maxWidth = 80;
        const textLines = pdf.splitTextToSize(imageData.text, maxWidth - 4);
        const lineHeight = 10;
        const rectHeight = textLines.length * lineHeight;
        const rectWidth = maxWidth;
        const radius = 2;
        const rectX = x + (containerWidth - rectWidth) / 2;
        const rectY = y + containerHeight - rectHeight - 5;
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(rectX, rectY, rectWidth, rectHeight, radius, radius, 'F');
        const textStartY = rectY + lineHeight * 0.7;
        pdf.text(textLines, rectX + rectWidth / 2, textStartY, { align: 'center' });
      }
    } catch (error) {
      console.warn('Failed to process image:', error);
      // Draw placeholder for failed images
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(x, y, containerWidth, containerHeight, borderRadius, borderRadius, 'F');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(12);
      pdf.text('Image Load Failed', x + containerWidth / 2, y + containerHeight / 2, { align: 'center' });
    }
  };

  try {
    // ---------- COVER PAGE (PAGE 1) ----------
    pdf.addImage(coverPageBase64, 'JPEG', 0, 0, pageWidth, pageHeight);

    // ---------- Details on Cover Page ----------
    const details = [
      ['ACCOUNT', formData.account],
      ['SITE', formData.site],
      ['PM TASK NAME', formData.pmTaskName],
      ['SERVICE PROVIDER', formData.serviceProvider],
      ['SERVICED BY', formData.serviceCompletedBy],
      ['DATE', format(new Date(formData.dateOfMaintenance), 'MMMM dd, yyyy')],
    ];

    const rowHeight = 12;
    let currentY = 200;
    const leftMargin = 10;
    const rightMargin = 20;
    const colonX = 95;

    details.forEach(([label, value]) => {
      const textY = currentY + (rowHeight / 2) + 1.5;
      pdf.setTextColor('#FFFFFF');
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, leftMargin, textY);
      pdf.text(':', colonX, textY, { align: 'center' });
      pdf.setFont('helvetica', 'bold');
      const valueX = colonX + 20; 
      const valueMaxWidth = (pageWidth - rightMargin) - valueX;
      const splitValue = pdf.splitTextToSize(String(value).toUpperCase(), valueMaxWidth);
      pdf.text(splitValue, valueX, textY, { align: 'left' });
      currentY += rowHeight;
    });

    // ---------- Images (Starting on Page 2) ----------
    if (allImagesFlat.length > 0) {
      pdf.addPage();
      const imgWidth = 90;
      const imgHeight = 120;
      const imgGap = 10;
      const leftX = (pageWidth - (imgWidth * 2 + imgGap)) / 2;
      const rightX = leftX + imgWidth + imgGap;
      let imageY = 20;
      let cursor = 0;

      while (cursor < allImagesFlat.length) {
        const pageBottomMargin = 297 - 20;
        if (imageY + imgHeight > pageBottomMargin) {
          pdf.addPage();
          imageY = 20;
        }

        const img1 = allImagesFlat[cursor];
        const img2 = allImagesFlat[cursor + 1];
        const isUploadPair = img1?.type === 'upload' && img2?.type === 'upload';
        const isBeforeAfterPair = img1?.type === 'before' && img2?.type === 'after';
        
        if (isUploadPair || isBeforeAfterPair) {
          await Promise.all([
            drawImageContainer(leftX, imageY, imgWidth, imgHeight, img1),
            drawImageContainer(rightX, imageY, imgWidth, imgHeight, img2)
          ]);
          cursor += 2;
        } else {
          await drawImageContainer(leftX, imageY, imgWidth, imgHeight, img1);
          cursor += 1;
        }
        imageY += imgHeight + imgGap;
      }
    }

    // ---------- END PAGE ----------
    pdf.addPage();
    pdf.addImage(endPageBase64, 'JPEG', 0, 0, pageWidth, pageHeight);

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Cross-platform PDF download using FileSaver.js
export const downloadPDF = async (blob: Blob, filename = 'report.pdf') => {
  try {
    // Use FileSaver.js for reliable cross-platform downloads
    saveAs(blob, filename);
  } catch (error) {
    console.error('FileSaver failed, attempting fallback:', error);
    
    // Fallback method for older browsers
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (fallbackError) {
      console.error('Both download methods failed:', fallbackError);
      throw new Error('Failed to download PDF. Please try again.');
    }
  }
};

// Memory cleanup utility
export const cleanupResources = () => {
  // Force garbage collection if available (mainly for development)
  if (typeof window !== 'undefined' && 'gc' in window) {
    try {
      (window as any).gc();
    } catch (e) {
      // gc() not available in production
    }
  }
};