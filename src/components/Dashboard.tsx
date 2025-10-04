import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FileText, Save, Mail, LogOut, Video as LucideIcon } from 'lucide-react';

// New UI Components integrated from app.tsx
import { StatusBar } from "../components/StatusBar";
import { ActivityRing } from "../components/ActivityRing";
import { StatsCard } from "../components/StatsCard";
import { SearchBar } from "../components/SearchBar";
import { RecentActivity } from "../components/RecentActivity";
import { BottomNavigation } from "../components/BottomNavigation";

const cbreLogoPath = '/logogreen.png';

// Define the shape of the component data
interface DashboardOption {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
    color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const handleEmailFeedback = () => {
    // NOTE: Using window.location.href works in standard React apps
    window.location.href = 'mailto:krkannan94@gmail.com?subject=CBRE Report Generator Feedback';
    
    // Add feedback activity
    const { addActivity } = useApp();
    addActivity({
      type: 'feedback_sent',
      title: 'Feedback Sent',
      description: 'Feedback email opened',
      icon: 'Mail',
      color: 'text-purple-600'
    });
  };
  const { clearSession, drafts, lastPdfGenerated, lastDraftModified, lastFeedbackReceived, addActivity } = useApp();
  const dashboardOptions: DashboardOption[] = [
    {
      title: 'PDF Report',
      description: 'Create a new report',
      icon: FileText,
      onClick: () => navigate('/generate-report'),
      color: 'bg-emerald-600',
    },
    {
      title: 'Drafts',
      description: `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} available`,
      icon: Save,
      onClick: () => navigate('/drafts'),
      color: 'bg-indigo-600',
    },
    {
      title: 'Feedback',
      description: 'Send us your feedback',
      icon: Mail,
      onClick: handleEmailFeedback,
      color: 'bg-yellow-600',
    },
    {
      title: 'Logout',
      description: 'End current session',
      icon: LogOut,
      onClick: handleLogout,
      color: 'bg-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Status Bar (from app.tsx) */}
      <StatusBar />

      {/* Header (from app.tsx) */}
          <div className="text-center mt-8 mb-8">
            <div className="mb-6">
              {/* Logo */}
                <img src={cbreLogoPath} alt="CBRE Logo" className="w-20 h-auto mx-auto mb-4" />
            </div>  
          </div> 
      
      {/* Search Bar (from app.tsx) */}
      <SearchBar />
      
      {/* Activity Ring Section (from app.tsx) */}
      <ActivityRing />
      
      {/* Quick Actions Section Header */}
      <div className="px-4 mb-4 mt-4">
        <h2 className="text-black text-lg font-semibold">Quick Actions</h2>
        <div className="text-gray-500 text-sm">Tap to access reports and tools</div>
      </div>
      
      {/* Action Cards Grid (Mapped from dashboardOptions into StatsCard structure) */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        {dashboardOptions.map((option) => (
            // NOTE: Assuming StatsCard accepts title, onClick, and possibly an icon prop
          <StatsCard
            key={option.title}
            title={option.title}
            description={option.description}
            icon={option.icon}
            onClick={option.onClick}
            colorClass={option.color} // Using colorClass to pass the background color
            showChevron={true}
            lastActionTimestamp={
              option.title === 'PDF Report' ? lastPdfGenerated :
              option.title === 'Drafts' ? lastDraftModified :
              option.title === 'Feedback' ? lastFeedbackReceived :
              null
            }
          />
        ))}
      </div>
      
      {/* Recent Activity (from app.tsx) */}
      <RecentActivity />
      
      {/* iOS Home indicator */}
      <div className="flex justify-center pb-6 mt-4">
        <div className="w-32 h-1 bg-gray-800 rounded-full opacity-60"></div>
      </div>
      
      {/* Bottom Navigation (from app.tsx) */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
