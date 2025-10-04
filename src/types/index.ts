export interface EntryFormData {
  account: string;
  site: string;
  pmTaskName: string;
  serviceProvider: string;
  dateOfMaintenance: string;
  serviceCompletedBy: string;
}

export interface ImageData {
  id: string;
  file: File;
  url: string;
  text?: string;
  type: 'before' | 'after';
}

export interface Draft {
  id: string;
  formData: EntryFormData;
  beforeImages: ImageData[];
  afterImages: ImageData[];
  createdAt: string;
  updatedAt: string;
}

export interface AppContextType {
  formData: EntryFormData | null;
  setFormData: (data: EntryFormData) => void;
  drafts: Draft[];
  saveDraft: (draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDraft: (id: string, draft: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  clearSession: () => void;
  reportsGenerated: number;
  reportsShared: number;
  incrementReportsGenerated: () => Promise<void>;
  incrementReportsShared: () => Promise<void>;
  lastPdfGenerated: number | null;
  lastDraftModified: number | null;
  lastFeedbackReceived: number | null;
  recentActivities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export interface Activity {
  id: string;
  type: 'pdf_generated' | 'draft_saved' | 'draft_updated' | 'feedback_sent';
  title: string;
  description: string;
  filename?: string;
  timestamp: number;
  icon: 'FileText' | 'Edit' | 'Mail';
  color: string;
}