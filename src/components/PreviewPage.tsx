import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Printer, ArrowLeft } from 'lucide-react';
import { EntryFormData, ImageData } from '../types';

interface PreviewState {
  formData: EntryFormData;
  allImages: (ImageData | null)[];
}

type ComparisonImage = {
  beforeImage: ImageData | null;
  afterImage: ImageData | null;
};

const PreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;
  const reportData = state as PreviewState | null;

  if (!reportData || !reportData.formData) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg text-red-500">No data found for preview.</p>
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
                Go to Dashboard
            </button>
        </div>
    );
  }

  const { formData, allImages } = reportData;

  const pairImages = (): ComparisonImage[] => {
    const beforeImages = allImages.filter(img => img?.type === 'before');
    const afterImages = allImages.filter(img => img?.type === 'after');
    const comparisons: ComparisonImage[] = [];
    const count = Math.max(beforeImages.length, afterImages.length);
    for (let i = 0; i < count; i++) {
      comparisons.push({
        beforeImage: beforeImages[i] || null,
        afterImage: afterImages[i] || null,
      });
    }
    return comparisons;
  };

  const pairedImages = pairImages();
  const firstComparison = pairedImages.slice(0, 1);
  const subsequentComparisons = pairedImages.slice(1);
  const subsequentPages = [];
  for (let i = 0; i < subsequentComparisons.length; i += 2) {
    subsequentPages.push(subsequentComparisons.slice(i, i + 2));
  }

  return (
    <>
      <div className="print-hide p-4 bg-gray-800 text-white flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-lg font-semibold">Report Preview</h2>
        <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500">
          <Printer className="w-5 h-5 mr-2" />
          Save as PDF
        </button>
      </div>

      <main className="printable-area bg-white">
        <style>{`
          @media print { .print-hide { display: none; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { page-break-after: always; box-shadow: none; margin: 0; } }
          @page { size: A4; margin: 0; }
        `}</style>
        
        <div className="page">
          <div className="header"><div className="logo">CBRE</div></div>
          <div className="details-table">
            <table className="details-table-content">
              <tbody>
                <tr className="detail-row"><td className="detail-label">Account:</td><td className="detail-value">{formData.account}</td></tr>
                <tr className="detail-row"><td className="detail-label">Site:</td><td className="detail-value">{formData.site}</td></tr>
                <tr className="detail-row"><td className="detail-label">PM Task Name:</td><td className="detail-value">${formData.pmTaskName}</td></tr>
                <tr className="detail-row"><td className="detail-label">Service Provider:</td><td className="detail-value">${formData.serviceProvider}</td></tr>
                <tr className="detail-row"><td className="detail-label">Date:</td><td className="detail-value">${format(new Date(formData.dateOfMaintenance), 'MMMM dd, yyyy')}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="first-page-grid">
            {firstComparison.map((comp, index) => (
              <React.Fragment key={`first-${index}`}>
                <div className="image-container">
                  <div className="comparison-label">Before</div>
                  {comp.beforeImage ? <img src={comp.beforeImage.url} alt="Before" /> : <div className="no-image">No Before Image</div>}
                  {comp.beforeImage?.text && <div className="image-text">{comp.beforeImage.text}</div>}
                </div>
                <div className="image-container">
                  <div className="comparison-label">After</div>
                  {comp.afterImage ? <img src={comp.afterImage.url} alt="After" /> : <div className="no-image">No After Image</div>}
                  {comp.afterImage?.text && <div className="image-text">{comp.afterImage.text}</div>}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {subsequentPages.map((pagePairs, pageIndex) => (
          <div key={`page-${pageIndex}`} className="page">
            <div className="subsequent-page-grid">
              {pagePairs.map((comp, pairIndex) => (
                <React.Fragment key={`pair-${pairIndex}`}>
                  <div className="image-container">
                    <div className="comparison-label">Before</div>
                    {comp.beforeImage ? <img src={comp.beforeImage.url} alt="Before" /> : <div className="no-image">No Image</div>}
                    {comp.beforeImage?.text && <div className="image-text">{comp.beforeImage.text}</div>}
                  </div>
                  <div className="image-container">
                    <div className="comparison-label">After</div>
                    {comp.afterImage ? <img src={comp.afterImage.url} alt="After" /> : <div className="no-image">No Image</div>}
                    {comp.afterImage?.text && <div className="image-text">{comp.afterImage.text}</div>}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        
        <style>{`
          .page { width: 210mm; min-height: 297mm; padding: 10mm; box-sizing: border-box; display: flex; flex-direction: column; background: white; margin: 20px auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 4px solid #00573F; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 35px; font-weight: bold; color: #00573F; }
          .details-table { width: 100%; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f8f9fa; margin-bottom: 20px; padding: 15px; box-sizing: border-box; }
          .details-table-content { width: 100%; border-collapse: collapse; }
          .detail-label { text-align: left; font-weight: bold; color: #00573F; font-size: 16px; padding: 8px; width: 30%; }
          .detail-value { text-align: left; font-size: 16px; padding: 8px; width: 70%; }
          .first-page-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; flex-grow: 1; }
          .subsequent-page-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(2, 1fr); gap: 10mm; flex-grow: 1; }
          .image-container { position: relative; width: 100%; height: 100%; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f0f0f0; }
          .image-container img { width: 100%; height: 100%; object-fit: cover; }
          .comparison-label { position: absolute; top: 10px; left: 10px; background: rgba(0, 87, 63, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 1; }
          .image-text { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); color: white; padding: 8px; font-size: 12px; text-align: center; }
          .no-image { color: #999; font-style: italic; }
        `}</style>
      </main>
    </>
  );
};

export default PreviewPage;