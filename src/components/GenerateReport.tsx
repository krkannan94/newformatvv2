import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Download, Save, Camera, Image as ImageIcon,
  X, Upload, Replace, Type, Trash2, Plus, Building2, Share
} from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { ImageData } from '../types';
import { generatePDF, downloadPDF, cleanupResources } from '../utils/pdfGenerator';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { isNative, pickImages, takePicture, requestCameraPermissions, sharePDF, savePDFToDevice, urlToFile } from '../utils/capacitor';

type TabType = 'before' | 'after' | 'upload';

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  if (!dataurl) return null;
  const arr = dataurl.split(',');
  if (arr.length < 2) return null;
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || !mimeMatch[1]) return null;
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const generateReportName = (formData: any) => {
    const cleanAccount = formData.account.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Account';
    const cleanSite = formData.site.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Site';
    const cleanTask = formData.pmTaskName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Task';
    return `${cleanAccount}_${cleanSite}_${cleanTask}_${format(new Date(), 'yyyy-MM-dd')}`;
};

const GenerateReport: React.FC = () => {
  const navigate = useNavigate();
  const { draftId } = useParams<{ draftId: string }>();
  const location = useLocation();
  const { formData, saveDraft, updateDraft, drafts, setFormData, incrementReportsGenerated, incrementReportsShared, addActivity } = useApp();

  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId || null);
  const [allImages, setAllImages] = useState<(ImageData | null)[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('before');

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [swapSourceIndex, setSwapSourceIndex] = useState<number | null>(null);
  const [isTextModalVisible, setIsTextModalVisible] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  
  // ... (All other functions and useEffects remain exactly the same)
  useEffect(() => {
    if (!draftId) return;
    const navStateDraft = location.state?.draftToLoad;
    const draftToLoad = navStateDraft || drafts.find(d => d.id === draftId);
    if (draftToLoad) {
      if (draftToLoad.formData) setFormData(draftToLoad.formData);
      const loadedImages: (ImageData | null)[] = [];
      const before = draftToLoad.beforeImages || [];
      const after = draftToLoad.afterImages || [];
      const uploads = draftToLoad.uploadImages || [];
      const numPairs = Math.max(before.length, after.length);
      for (let i = 0; i < numPairs; i++) {
        const beforeImgData = before[i];
        const afterImgData = after[i];
        const beforeFile = beforeImgData?.url ? dataURLtoFile(beforeImgData.url, `before-${beforeImgData.id}.jpg`) : undefined;
        const afterFile = afterImgData?.url ? dataURLtoFile(afterImgData.url, `after-${afterImgData.id}.jpg`) : undefined;
        const beforeImg = beforeImgData ? { ...beforeImgData, file: beforeFile } as ImageData : null;
        const afterImg = afterImgData ? { ...afterImgData, file: afterFile } as ImageData : null;
        loadedImages.push(beforeImg);
        loadedImages.push(afterImg);
      }
      for (const uploadImgData of uploads) {
        if (uploadImgData) {
          const uploadFile = uploadImgData.url ? dataURLtoFile(uploadImgData.url, `upload-${uploadImgData.id}.jpg`) : undefined;
          const uploadImg = { ...uploadImgData, file: uploadFile } as ImageData;
          loadedImages.push(uploadImg);
        }
      }
      setAllImages(loadedImages);
    }
  }, [draftId, drafts, setFormData, location.state]);

  useEffect(() => {
    if (editingImage) {
      setIsTextModalVisible(true);
      setTimeout(() => setIsTextModalOpen(true), 10);
    } else if (isTextModalVisible) {
      setIsTextModalOpen(false);
      setTimeout(() => setIsTextModalVisible(false), 300);
    }
  }, [editingImage]);

  const handleImageUpload = useCallback(async (files: FileList | null, type: 'before' | 'after' | 'upload') => {
    if (!files || files.length === 0) return;
    setActiveTab(type);
    const readPromises = Array.from(files).filter(file => file.type.startsWith('image/')).map(file => {
      return new Promise<ImageData>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData: ImageData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            url: e.target?.result as string,
            type,
          };
          resolve(imageData);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(newlyReadImages => {
      if (newlyReadImages.length === 0) return;
      setAllImages(prev => {
        const updatedImages = [...prev];
        if (type === 'before') {
          newlyReadImages.forEach(newImage => {
            let insertIndex = 0;
            while (updatedImages[insertIndex] != null) { insertIndex += 2; }
            updatedImages[insertIndex] = newImage;
          });
        } else if (type === 'after') {
          let unaddedCount = 0;
          newlyReadImages.forEach(newImage => {
            let foundSlot = false;
            for (let i = 0; i < updatedImages.length; i += 2) {
              if (updatedImages[i] && updatedImages[i]?.type === 'before' && !updatedImages[i+1]) {
                updatedImages[i + 1] = newImage;
                foundSlot = true;
                break;
              }
            }
            if (!foundSlot) { unaddedCount++; }
          });
          setValidationMessage(unaddedCount > 0 ? `${unaddedCount} after image(s) could not be paired.` : '');
        } else {
          newlyReadImages.forEach(newImage => updatedImages.push(newImage));
        }
        return updatedImages;
      });
    });
  }, []);

  const handleNativeImagePick = useCallback(async (type: 'before' | 'after' | 'upload') => {
    try {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        alert('Camera and photo permissions are required to add images.');
        return;
      }

      const imagePaths = await pickImages(true);

      const readPromises = imagePaths.map(async (path) => {
        if (!path) return null;
        const file = await urlToFile(path, `image-${Date.now()}.jpg`);
        return new Promise<ImageData>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData: ImageData = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              file,
              url: e.target?.result as string,
              type,
            };
            resolve(imageData);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const newlyReadImages = (await Promise.all(readPromises)).filter((img): img is ImageData => img !== null);

      if (newlyReadImages.length === 0) return;
      setActiveTab(type);
      setAllImages(prev => {
        const updatedImages = [...prev];
        if (type === 'before') {
          newlyReadImages.forEach(newImage => {
            let insertIndex = 0;
            while (updatedImages[insertIndex] != null) { insertIndex += 2; }
            updatedImages[insertIndex] = newImage;
          });
        } else if (type === 'after') {
          let unaddedCount = 0;
          newlyReadImages.forEach(newImage => {
            let foundSlot = false;
            for (let i = 0; i < updatedImages.length; i += 2) {
              if (updatedImages[i] && updatedImages[i]?.type === 'before' && !updatedImages[i+1]) {
                updatedImages[i + 1] = newImage;
                foundSlot = true;
                break;
              }
            }
            if (!foundSlot) { unaddedCount++; }
          });
          setValidationMessage(unaddedCount > 0 ? `${unaddedCount} after image(s) could not be paired.` : '');
        } else {
          newlyReadImages.forEach(newImage => updatedImages.push(newImage));
        }
        return updatedImages;
      });
    } catch (error) {
      console.error('Native image pick error:', error);
      alert('Failed to pick images. Please try again.');
    }
  }, []);

  const handleNativeCamera = useCallback(async (type: 'before' | 'after' | 'upload') => {
    try {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        alert('Camera permission is required to take photos.');
        return;
      }

      const imagePath = await takePicture();
      if (!imagePath) return;

      const file = await urlToFile(imagePath, `photo-${Date.now()}.jpg`);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData: ImageData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          url: e.target?.result as string,
          type,
        };

        setActiveTab(type);
        setAllImages(prev => {
          const updatedImages = [...prev];
          if (type === 'before') {
            let insertIndex = 0;
            while (updatedImages[insertIndex] != null) { insertIndex += 2; }
            updatedImages[insertIndex] = imageData;
          } else if (type === 'after') {
            let foundSlot = false;
            for (let i = 0; i < updatedImages.length; i += 2) {
              if (updatedImages[i] && updatedImages[i]?.type === 'before' && !updatedImages[i+1]) {
                updatedImages[i + 1] = imageData;
                foundSlot = true;
                break;
              }
            }
            if (!foundSlot) {
              setValidationMessage('This after image could not be paired.');
            }
          } else {
            updatedImages.push(imageData);
          }
          return updatedImages;
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Native camera error:', error);
      alert('Failed to take photo. Please try again.');
    }
  }, []);

  const triggerFileInput = (type: 'before' | 'after' | 'upload') => {
    if (isNative()) {
      handleNativeImagePick(type);
    } else {
      setActiveTab(type);
      const inputId = type === 'upload' ? 'upload-upload' : `${type}-upload`;
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) inputElement.click();
    }
  };
  
  const handleReplace = (index: number) => {
    setSwapSourceIndex(null);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const existingImage = allImages[index];
          const newImage: ImageData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            url: event.target?.result as string,
            type: existingImage?.type || 'upload',
            text: existingImage?.text,
          };
          const newImages = [...allImages];
          newImages[index] = newImage;
          setAllImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  const handleAddText = (imageId: string) => {
    setSwapSourceIndex(null);
    setEditingImage(imageId);
    const image = allImages.find(img => img?.id === imageId);
    setTextInput(image?.text || '');
  };
  const saveText = () => {
    if (editingImage) {
      const newImages = allImages.map(img => (img && img.id === editingImage) ? { ...img, text: textInput } : img);
      setAllImages(newImages as (ImageData | null)[]);
      setEditingImage(null);
      setTextInput('');
    }
  };
  const closeTextModal = () => {
    setIsTextModalOpen(false);
    setTimeout(() => {
      setIsTextModalVisible(false);
      setEditingImage(null);
      setTextInput('');
    }, 300);
  };
  const handleImageClickForSwap = (clickedIndex: number) => {
    if (swapSourceIndex === null) {
      if (allImages[clickedIndex]) setSwapSourceIndex(clickedIndex);
    } else {
      const newImages = [...allImages];
      const maxIndex = Math.max(swapSourceIndex, clickedIndex);
      while (newImages.length <= maxIndex) newImages.push(null);
      [newImages[swapSourceIndex], newImages[clickedIndex]] = [newImages[clickedIndex], newImages[swapSourceIndex]];
      setAllImages(newImages);
      setSwapSourceIndex(null);
    }
  };
  const handleDelete = (index: number) => {
    setSwapSourceIndex(null);
    const newImages = [...allImages];
    newImages[index] = null;
    while (newImages.length > 0 && newImages[newImages.length - 1] === null) newImages.pop();
    setAllImages(newImages);
  };
  const getTypeLabel = (type: 'before' | 'after' | 'upload') => {
    switch (type) {
      case 'before': return { text: 'Before', bgColor: 'bg-red-600', textColor: 'text-white' };
      case 'after': return { text: 'After', bgColor: 'bg-green-600', textColor: 'text-white' };
      case 'upload': return { text: 'Upload', bgColor: 'bg-blue-600', textColor: 'text-white' };
      default: return { text: '', bgColor: '', textColor: '' };
    }
  };
  
  const handleSaveOrUpdateDraft = () => {
    const beforeImages = allImages.filter((img): img is ImageData => !!img && img.type === 'before');
    const afterImages = allImages.filter((img): img is ImageData => !!img && img.type === 'after');
    const uploadImages = allImages.filter((img): img is ImageData => !!img && img.type === 'upload');
    const draftData = { formData, beforeImages, afterImages, uploadImages };
    if (currentDraftId) {
      updateDraft(currentDraftId, draftData);
      alert('Draft updated successfully!');
    } else {
      const newDraft = saveDraft(draftData);
      setCurrentDraftId(newDraft.id);
      alert('Draft saved successfully!');
    }
  };

  const handleSaveLocally = async () => {
    setIsGeneratingPDF(true);
    setShowExportOptions(false);
    try {
      const imagesWithFiles = allImages.filter((img): img is ImageData => !!img && !!img.file);
      if (imagesWithFiles.length === 0) {
        alert('Please add at least one image to generate a PDF.');
        setIsGeneratingPDF(false);
        return;
      }
      const pdfBlob = await generatePDF(formData, imagesWithFiles, 'standard');

      const reportName = generateReportName(formData);
      const filename = `${reportName}.pdf`;

      if (isNative()) {
        await savePDFToDevice(pdfBlob, filename);
        alert(`PDF saved successfully to Documents folder`);
      } else {
        await downloadPDF(pdfBlob, filename);
      }

      await incrementReportsGenerated();

      addActivity({
        type: 'report_generated',
        title: reportName,
        description: 'PDF report was generated',
        icon: 'FileText',
        color: 'text-emerald-600'
      });

      cleanupResources();
    } catch (error) {
      console.error("Failed to save PDF:", error);
      alert("An error occurred while saving the PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    setIsGeneratingPDF(true);
    setShowExportOptions(false);
    try {
      const imagesWithFiles = allImages.filter((img): img is ImageData => !!img && !!img.file);
      if (imagesWithFiles.length === 0) {
        alert('Please add at least one image to share.');
        setIsGeneratingPDF(false);
        return;
      }
      const pdfBlob = await generatePDF(formData, imagesWithFiles, 'standard');

      const reportName = generateReportName(formData);
      const filename = `${reportName}.pdf`;

      if (isNative()) {
        await sharePDF(pdfBlob, filename, `CBRE Report for ${formData.site}`);
      } else {
        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            title: `CBRE Report for ${formData.site}`,
            text: `Here is the PDF report for ${formData.site}.`,
            files: [pdfFile],
          });
        } else {
          await downloadPDF(pdfBlob, filename);
        }
      }

      await incrementReportsGenerated();
      await incrementReportsShared();

      addActivity({
        type: 'report_generated',
        title: reportName,
        description: 'PDF report was shared',
        icon: 'Share2',
        color: 'text-emerald-600'
      });

      cleanupResources();
    } catch (error) {
      console.error("Sharing failed:", error);
      alert(`Failed to share PDF: ${error instanceof Error ? error.message : 'Unknown error'}.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  let lastImageIndex = -1;
  allImages.forEach((img, index) => {
    if (img) lastImageIndex = index;
  });
  const minGridSize = 4;
  const gridSize = Math.max(minGridSize, Math.ceil((lastImageIndex + 1) / 2) * 2);
  const gridItems = Array(gridSize).fill(null).map((_, index) => allImages[index] || null);
  const beforeCount = allImages.filter(img => img?.type === 'before').length;
  const afterCount = allImages.filter(img => img?.type === 'after').length;
  const uploadCount = allImages.filter(img => img?.type === 'upload').length;

  if (!formData) {
    if (!draftId) { navigate('/'); return null; }
    return <div>Loading Draft...</div>;
  }
  
  return (
    <div className="min-h-screen bg-ios-background">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" className="text-ios-blue hover:text-ios-blue/80 hover:bg-ios-blue/10 p-3 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-1">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="font-semibold text-lg text-black">GENERATE REPORT</h1>
          </div>
          <div className="w-[80px]"></div>
        </div>
      </header>
      
      <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'before')} className="hidden" id="before-upload" />
      <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'after')} className="hidden" id="after-upload" />
      <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'upload')} className="hidden" id="upload-upload" />

      <main className="max-w-6xl mx-auto px-4 py-8 pt-24">
        <div className="bg-white/60 backdrop-blur-sm p-2 rounded-2xl mb-8 border border-gray-200/50 shadow-md">
          <div className="flex">
            <button onClick={() => triggerFileInput('before')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${activeTab === 'before' ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'text-gray-600 hover:text-black'}`}>
              <Camera className="h-4 w-4" /> Before
            </button>
            <button onClick={() => triggerFileInput('after')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${activeTab === 'after' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-gray-600 hover:text-black'}`}>
              <Camera className="h-4 w-4" /> After
            </button>
            <button onClick={() => triggerFileInput('upload')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${activeTab === 'upload' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-600 hover:text-black'}`}>
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>
        </div>

        {validationMessage && (
           <div className="mb-ios-lg p-ios-md bg-ios-orange bg-opacity-10 border border-ios-orange rounded-ios-lg text-center">
            <p className="text-ios-orange text-ios-subhead">{validationMessage}</p>
          </div>
        )}

        <Card className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-black/5 overflow-hidden mb-8">
          <CardContent className="p-0">
            <div>
              {swapSourceIndex !== null && (
                <div className="text-center p-2 m-4 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                  <p>Selected image at position <strong>{swapSourceIndex + 1}</strong>. Click another slot to swap.</p>
                </div>
              )}
              {allImages.filter(Boolean).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Images Yet</h3>
                  <p className="text-gray-500">Use the buttons above to upload your first images</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {gridItems.map((image, index) => {
                    const isSelectedForSwap = swapSourceIndex === index;
                    return (
                      <div key={index} onClick={() => handleImageClickForSwap(index)} tabIndex={0} className={`aspect-square bg-gray-50 rounded-xl border-2 border-dashed relative group overflow-hidden cursor-pointer ${isSelectedForSwap ? 'border-blue-500 ring-4 ring-blue-300' : 'border-gray-200'} ${swapSourceIndex !== null ? 'hover:border-blue-400' : ''}`}>
                        {image ? (
                          <>
                            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium z-10 ${getTypeLabel(image.type).bgColor} ${getTypeLabel(image.type).textColor}`}>{getTypeLabel(image.type).text}</div>
                            <img src={image.url} alt={`${image.type} ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                            {image.text && (<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">{image.text}</div>)}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => handleReplace(index)} className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors" title="Replace"><Replace className="w-3 h-3 text-gray-700" /></button>
                              <button onClick={() => handleAddText(image.id)} className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors" title="Add Text"><Type className="w-3 h-3 text-gray-700" /></button>
                              <button onClick={() => handleDelete(index)} className="p-1.5 bg-red-500/90 rounded-full hover:bg-red-500 shadow-sm transition-colors" title="Delete"><Trash2 className="w-3 h-3 text-white" /></button>
                            </div>
                          </>
                        ) : (
                          <button type="button" onClick={(e) => { e.stopPropagation(); triggerFileInput(index % 2 === 0 ? 'before' : 'after'); }} className="flex flex-col items-center justify-center h-full w-full text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Plus className="w-12 h-12 text-gray-300" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-white/60 backdrop-blur-sm p-2 rounded-2xl mb-8 border border-gray-200/50 shadow-md">
          <div className="flex gap-2">
            <button onClick={handleSaveOrUpdateDraft} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-600">
              <Save className="h-4 w-4" /> {currentDraftId ? 'Update Draft' : 'Save as Draft'}
            </button>
            <button onClick={() => setShowExportOptions(true)} disabled={isGeneratingPDF} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="h-4 w-4" /> {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </main>

      {showExportOptions && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in-0 duration-300"
            onClick={() => setShowExportOptions(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-center pb-2">
              <div className="w-10 h-1 bg-white/40 rounded-full" />
            </div>
            <div className="bg-white rounded-3xl p-6 mx-4 mb-8 shadow-2xl border border-gray-200/50">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-medium text-emerald-700 tracking-wide">CBRE</span>
                </div>
                <h2 className="text-lg text-gray-800 font-semibold">Export Options</h2>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={handleSaveLocally}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-700/25 disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{isGeneratingPDF ? 'Generating...' : 'Save locally'}</span>
                </button>
                {typeof navigator.share !== 'undefined' && (
                  <button 
                    onClick={handleShare}
                    disabled={isGeneratingPDF}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-700/25 disabled:opacity-50"
                  >
                    <Share className="w-5 h-5" />
                    <span className="font-medium">{isGeneratingPDF ? 'Preparing...' : 'Share'}</span>
                  </button>
                )}
                <button 
                  onClick={() => setShowExportOptions(false)}
                  className="w-full flex items-center justify-center gap-3 py-3 mt-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 active:scale-95"
                >
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {selectedImage && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedImage(null); setSwapSourceIndex(null); }}><div className="relative max-w-4xl max-h-full"><img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" /><button onClick={() => { setSelectedImage(null); setSwapSourceIndex(null); }} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"><X className="w-5 h-5 text-gray-700" /></button></div></div>)}
      
      {isTextModalVisible && (
        <>
            <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isTextModalOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeTextModal} />
            <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${isTextModalOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-center pb-2"><div className="w-10 h-1 bg-gray-400/40 rounded-full" /></div>
                <div className="bg-white rounded-3xl p-6 mx-4 mb-8 shadow-2xl border border-cbre-green/10">
                    <h3 className="text-lg font-semibold mb-4 text-center">Add Text to Image</h3>
                    <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg resize-none" rows={3} placeholder="Enter descriptive text..." />
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={saveText} 
                            className="flex-1 bg-emerald-700 text-white py-2 px-4 rounded-lg hover:bg-emerald-800 transition-colors">
                            Save
                        </button>
                        <button 
                            onClick={closeTextModal} 
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
      )}
      
      <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-gray-800 rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default GenerateReport;