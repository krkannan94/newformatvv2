import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Draft } from '../types';
import { FileText, Trash2, CreditCard as Edit, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const SavedDrafts: React.FC = () => {
  const { drafts, deleteDraft } = useApp();
  const navigate = useNavigate();

  const handleLoadDraft = (draft: Draft) => {
    // ✅ DEBUG: Log the draft object to ensure it exists before navigating.
    console.log("SAVED DRAFTS: Attempting to navigate with this draft object:", draft);

    navigate(`/generate-report/${draft.id}`, { state: { draftToLoad: draft } });
  };

  // Helper function to generate filename from draft data
  const generateFilename = (draft: Draft): string => {
    const { formData } = draft;
    const cleanAccount = formData.account.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Account';
    const cleanSite = formData.site.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Site';
    const cleanTask = formData.pmTaskName.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Task';
    const dateStr = format(new Date(draft.createdAt), 'yyyy-MM-dd');
    return `${cleanAccount}_${cleanSite}_${cleanTask}_${dateStr}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-4 border-b">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Saved Drafts</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {drafts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Drafts Found</h2>
            <p className="text-gray-500 mt-2">You haven't saved any drafts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between transition-shadow hover:shadow-lg overflow-hidden"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="p-3 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">
                      {generateFilename(draft)}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Last updated: {new Date(draft.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full"
                    title="Load Draft"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteDraft(draft.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDrafts;