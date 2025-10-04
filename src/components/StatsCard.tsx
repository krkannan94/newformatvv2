import { ChevronRight, FileText, CreditCard as Edit, Mail, LogOut, Video as LucideIcon } from "lucide-react";

// Helper function to calculate time ago
const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

interface StatsCardProps {
  title: string;
  value?: string;
  unit?: string;
  subtitle?: string;
  showChart?: boolean;
  chartData?: number[];
  chartColor?: string;
  showChevron?: boolean;
  children?: React.ReactNode;
  count?: number;
  lastActivity?: string;
  // --- Navigation Prop Added ---
  onClick?: () => void;
  icon?: LucideIcon; 
  colorClass?: string; 
  description?: string;
  // *** NEW PROP FOR DYNAMIC COUNT ***
  dynamicCount?: number; 
  // *** NEW PROP FOR REAL TIMESTAMPS ***
  lastActionTimestamp?: number | null;
}

export function StatsCard({ 
  title, 
  value, 
  unit, 
  subtitle, 
  showChart = false, 
  chartData = [], 
  chartColor = "#10b981",
  showChevron = true,
  children,
  count,
  lastActivity,
  // --- Destructuring new/required props ---
  onClick,
  icon,
  colorClass,
  description,
  // *** DESTRUCTURING dynamicCount ***
  dynamicCount,
  // *** DESTRUCTURING lastActionTimestamp ***
  lastActionTimestamp
}: StatsCardProps) {
    
  // Centralized data based on card title (kept for internal consistency)
  const getCardData = (cardTitle: string) => {
    switch(cardTitle) {
      case 'PDF Report':
       return { count: 8, timestamp: lastActionTimestamp, description: 'Generate new report' };
      case 'Drafts':
       return { count: 3, timestamp: lastActionTimestamp, description: 'Resume editing' };
      case 'Feedback':
       return { count: 12, timestamp: lastActionTimestamp, description: 'View responses' };
      case 'Logout':
        return { count: 0, timestamp: 0, description: 'Sign out securely' };
      default:
        return { count: 0, timestamp: 0, description: '' };
    }
  };

  const cardData = getCardData(title);

  // *** FIX: Use dynamicCount if it's explicitly passed and valid (non-null/non-undefined), otherwise use the hardcoded cardData.count. ***
  // The logic is simpler now: if dynamicCount is passed, use it. Otherwise, rely on the original hardcoded value from getCardData.
  const finalCount = (typeof dynamicCount === 'number') ? dynamicCount : cardData.count;


  // --- Component for Large Icon and Activity Status ---
  const DashboardContent = () => {
    // If custom children are provided, render them
    if (children) return <>{children}</>;

    // Otherwise, render the specific dashboard content based on title
    let IconComponent: LucideIcon | null = null;
    let activityStatusText: string | null = null;
    let customText = null;

    // Calculate real-time timeAgo for each card
   const timeAgo = (cardData.timestamp && cardData.timestamp > 0) ? getTimeAgo(cardData.timestamp) : null;

    // Determine content based on title
    switch (title) {
        case 'PDF Report':
            IconComponent = FileText;
           activityStatusText = timeAgo ? `Last: ${timeAgo}` : 'No reports yet';
            break;
        case 'Drafts':
            IconComponent = Edit;
           activityStatusText = timeAgo ? `Modified: ${timeAgo}` : 'No drafts created yet';
            break;
        case 'Feedback':
            IconComponent = Mail;
           activityStatusText = timeAgo ? `Updated: ${timeAgo}` : 'No feedback sent yet';
            break;
        case 'Logout':
            IconComponent = LogOut;
            customText = <div className="text-xs text-gray-500">Secure session</div>;
            break;
        default:
            // Fallback for generic cards (retains original logic for other card types)
            if (subtitle || value || showChart) {
              return (
                <>
                    {subtitle && (<div className="text-gray-600 text-sm mb-2">{subtitle}</div>)}
                    {value && (<div className="text-black text-2xl font-medium mb-3">
                        {value}
                        {unit && <span style={{ color: chartColor }} className="text-lg ml-1">{unit}</span>}
                    </div>)}
                    {showChart && chartData.length > 0 && (<div className="flex items-end gap-1 h-12">
                        {chartData.map((height, index) => (
                            <div key={index} className="flex-1 rounded-sm opacity-80"
                                style={{ backgroundColor: chartColor, height: `${height}%`, minHeight: '8px' }}
                            />
                        ))}
                    </div>)}
                    {showChart && (<div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span>
                    </div>)}
                </>
              );
            }
            return null; // Render nothing if it's not a recognized action and has no data
    }

    // This block renders the content for the 4 main dashboard actions.
    if (IconComponent) {
      return (
          <div className="flex flex-col items-center justify-center py-6">
              <IconComponent className="w-12 h-12 text-green-600 mb-2" />
              {activityStatusText && (
                  <div className="text-xs text-gray-500">{activityStatusText}</div>
              )}
              {customText}
          </div>
      );
    }
    return null;
  };

  return (
    <button
        onClick={onClick}
        disabled={!onClick}
        // Combined the original div classes with button/click semantics
        className="rounded-3xl p-0 relative overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white border-gray-100 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-200 text-left w-full"
    >
      {/* Header Section */}
      <div className="p-4 pb-2 text-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
          </div>
          {showChevron && (
            <ChevronRight className="w-5 h-5 text-green-600" />
          )}
        </div>
        {cardData.description && (
          <div className="text-gray-500 text-sm mt-1">{cardData.description}</div>
        )}
        </div>

      {/* Content Section - NOW SIMPLIFIED TO USE DashboardContent */}
      <div className="px-4 pb-4 bg-gradient-to-br from-green-50 to-green-100">
        <DashboardContent />
        </div>
    </button>
  );
}
