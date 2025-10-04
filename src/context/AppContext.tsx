import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db'; // Import your new database instance
import { AppContextType, Draft, EntryFormData, ImageData, Activity } from '../types';
import { format } from 'date-fns';

// Extend the global window type to allow using custom attributes.
declare global {
  interface Window {
    db?: any; 
  }
}

// This compression function is still useful to save space in IndexedDB
const compressImage = (file: File, quality: number = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context error'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedUrl = ctx.canvas.toDataURL('image/jpeg', quality);
        resolve(compressedUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

// Define a key for the metrics document in Dexie
const METRICS_KEY = 'report_metrics';


const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // --- CHANGE 1: Initialize formData state from localStorage ---
  // This function now runs when the app starts, checking for a saved session.
  const [formData, setFormData] = useState<EntryFormData | null>(() => {
    try {
        const savedSession = localStorage.getItem('currentSessionFormData');
        return savedSession ? JSON.parse(savedSession) : null;
    } catch (error) {
        console.error("Could not parse session form data from localStorage", error);
        return null;
    }
  });

  // --- NEW STATE: Tracks if Dexie has finished connecting ---
  const [isDbReady, setIsDbReady] = useState(false);
  // Add timestamp tracking state
  const [lastPdfGenerated, setLastPdfGenerated] = useState<number | null>(null);
  const [lastDraftModified, setLastDraftModified] = useState<number | null>(null);
  const [lastFeedbackReceived, setLastFeedbackReceived] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  
  // Wait for Dexie to open (which defines the table properties)
  useEffect(() => {
    // db.open() returns a promise that resolves when the connection is established and tables are available.
    db.open().then(() => {
        if (db.metrics) { // Double-check table existence
             setIsDbReady(true);
        } else {
             // This indicates db.ts needs the metrics table added (as noted previously)
             console.error("Dexie is open, but db.metrics table is still undefined. Please check db.ts schema.");
        }
    }).catch(e => {
        console.error("Dexie failed to open database:", e);
    });
  }, []);

  // Load initial timestamps from localStorage
  useEffect(() => {
    const savedPdfTimestamp = localStorage.getItem('lastPdfGenerated');
    const savedDraftTimestamp = localStorage.getItem('lastDraftModified');
    const savedFeedbackTimestamp = localStorage.getItem('lastFeedbackReceived');
    
    if (savedPdfTimestamp) setLastPdfGenerated(parseInt(savedPdfTimestamp));
    if (savedDraftTimestamp) setLastDraftModified(parseInt(savedDraftTimestamp));
    if (savedFeedbackTimestamp) setLastFeedbackReceived(parseInt(savedFeedbackTimestamp));
  }, []);
  
  // --- CHANGE 2: Add useEffect to save formData to localStorage on any change ---
  useEffect(() => {
    if (formData) {
        // If formData exists (user is "logged in"), save it.
        localStorage.setItem('currentSessionFormData', JSON.stringify(formData));
    } else {
        // If formData is null (user logged out), remove it from storage.
        localStorage.removeItem('currentSessionFormData');
    }
  }, [formData]); // This effect runs whenever the `formData` state changes.

  // Load activities from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('recentActivities');
    if (savedActivities) {
      try {
        const activities = JSON.parse(savedActivities);
        setRecentActivities(activities);
      } catch (error) {
        console.error('Failed to parse saved activities:', error);
      }
    }
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (recentActivities.length > 0) {
      localStorage.setItem('recentActivities', JSON.stringify(recentActivities));
    }
  }, [recentActivities]);

  // Function to add new activity
  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setRecentActivities(prev => {
      // Add new activity and keep only the 3 most recent
      const updated = [newActivity, ...prev];
      return updated.slice(0, 3); // Keep only the 3 most recent
    });
  }, []);

  // --- FIX: Only query if the database is confirmed ready ---
  const metrics = useLiveQuery(
    () => isDbReady && db.metrics ? db.metrics.get(METRICS_KEY) : undefined, 
    [isDbReady] // Re-run query when readiness changes
  );

  // Default to 0 if metrics is undefined/loading/missing
  const reportsGenerated = metrics?.reportsGenerated || 0;
  const reportsShared = metrics?.reportsShared || 0;
  // --- END FIX ---

  // Move increment functions inside the provider component
  const incrementReportsGenerated = useCallback(async (): Promise<void> => {
    try {
      if (!db.metrics) {
        console.error("Dexie table 'metrics' not available for counting.");
        return;
      }
      
      const metrics = await db.metrics.get(METRICS_KEY);
      const currentGenerated = metrics?.reportsGenerated || 0;
      const currentShared = metrics?.reportsShared || 0;
      
      await db.metrics.put({ 
        id: METRICS_KEY, 
        reportsGenerated: currentGenerated + 1,
        reportsShared: currentShared,
        updatedAt: new Date().toISOString() 
      });
      
     // Update PDF generation timestamp
     const now = Date.now();
     setLastPdfGenerated(now);
     localStorage.setItem('lastPdfGenerated', now.toString());
    } catch (e) {
      console.error("Failed to increment reports generated count in Dexie:", e);
    }
  }, []);

  const incrementReportsShared = useCallback(async (): Promise<void> => {
    try {
      if (!db.metrics) {
        console.error("Dexie table 'metrics' not available for counting.");
        return;
      }
      
      const metrics = await db.metrics.get(METRICS_KEY);
      const currentShared = metrics?.reportsShared || 0;
      const currentGenerated = metrics?.reportsGenerated || 0;
      
      await db.metrics.put({ 
        id: METRICS_KEY, 
        reportsGenerated: currentGenerated,
        reportsShared: currentShared + 1,
        updatedAt: new Date().toISOString() 
      });
      
     // Update both PDF generation and sharing timestamps
     const now = Date.now();
     setLastPdfGenerated(now);
     localStorage.setItem('lastPdfGenerated', now.toString());
    } catch (e) {
      console.error("Failed to increment reports shared count in Dexie:", e);
    }
  }, []);

  // This hook automatically fetches and updates your drafts in real-time!
  const drafts = useLiveQuery(
    () => db.drafts.orderBy('createdAt').reverse().toArray(),
    [] // dependency array
  );

  const saveDraft = async (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>): Promise<Draft> => {
    const { formData, beforeImages, afterImages, uploadImages } = draftData;
    
    const processImages = async (images: (ImageData | null)[]) => {
      return Promise.all(
        (images || []).map(async (img) => {
          if (!img || !img.file) return img;
          const compressedUrl = await compressImage(img.file);
          // Return a version without the File object for storage
          return { id: img.id, type: img.type, text: img.text, url: compressedUrl };
        })
      );
    };

    const newDraft: Draft = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData,
      beforeImages: await processImages(beforeImages) as any,
      afterImages: await processImages(afterImages) as any,
      uploadImages: await processImages(uploadImages) as any,
    };

    await db.drafts.add(newDraft);
    
    // Update draft modification timestamp
    const now = Date.now();
    setLastDraftModified(now);
    localStorage.setItem('lastDraftModified', now.toString());
    
    // Generate filename using same logic as PDF generation
    const cleanAccount = formData.account.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Account';
    const cleanSite = formData.site.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Site';
    const cleanTask = formData.pmTaskName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Task';
    const filename = `${cleanAccount}_${cleanSite}_${cleanTask}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    // Add activity
    addActivity({
      type: 'draft_saved',
      title: filename,
      description: 'Report draft saved successfully',
      filename: filename,
      icon: 'Edit',
      color: 'text-green-600'
    });
    return newDraft;
  };

  const updateDraft = async (id: string, draftData: Partial<Draft>) => {
    // Get the existing draft to access formData
    const existingDraft = await db.drafts.get(id);
    const formData = draftData.formData || existingDraft?.formData;
    
    // Dexie's update will merge the changes automatically
    await db.drafts.update(id, {
      ...draftData,
      updatedAt: new Date().toISOString(),
    });
    
    // Update draft modification timestamp
    const now = Date.now();
    setLastDraftModified(now);
    localStorage.setItem('lastDraftModified', now.toString());
    
    // Generate filename using same logic as PDF generation
    if (formData) {
      const cleanAccount = formData.account.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Account';
      const cleanSite = formData.site.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Site';
      const cleanTask = formData.pmTaskName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Task';
      const filename = `${cleanAccount}_${cleanSite}_${cleanTask}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      // Add activity  
      addActivity({
        type: 'draft_updated',
        title: filename,
        description: 'Report draft updated successfully',
        filename: filename,
        icon: 'Edit',
        color: 'text-green-600'
      });
    } else {
      // Fallback if formData is not available
      addActivity({
        type: 'draft_updated',
        title: 'Draft Updated',
        description: 'Report draft updated successfully',
        icon: 'Edit',
        color: 'text-green-600'
      });
    }
  };

  const deleteDraft = async (id: string) => {
    await db.drafts.delete(id);
  };
  
  // No change needed here. Calling setFormData(null) will now trigger the
  // useEffect hook to clear localStorage automatically.
  const clearSession = () => { setFormData(null); };

  // Use useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    formData,
    setFormData,
    drafts: drafts || [], 
    saveDraft,
    updateDraft,
    deleteDraft,
    clearSession,
    reportsGenerated,
    reportsShared,
    incrementReportsGenerated,
    incrementReportsShared,
    lastPdfGenerated,
    lastDraftModified,
    lastFeedbackReceived,
    recentActivities,
    addActivity,
  }), [
    formData,
    drafts,
    // Note: useCallback is now used for functions, so they don't need to be in the dependency array
    reportsGenerated,
    reportsShared,
    incrementReportsGenerated,
    incrementReportsShared,
    lastPdfGenerated,
    lastDraftModified,
    lastFeedbackReceived,
    recentActivities,
    addActivity,
  ]);

  // Update draft timestamp when drafts change
  useEffect(() => {
    if (drafts && drafts.length > 0) {
      const mostRecent = Math.max(...drafts.map(d => new Date(d.updatedAt || d.createdAt).getTime()));
      if (!lastDraftModified || mostRecent > lastDraftModified) {
        setLastDraftModified(mostRecent);
        localStorage.setItem('lastDraftModified', mostRecent.toString());
      }
    }
  }, [drafts, lastDraftModified]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};