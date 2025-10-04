import { Clock, FileText, CreditCard as Edit, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";

// Helper function to get relative time
const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'FileText':
      return FileText;
    case 'Edit':
      return Edit;
    case 'Mail':
      return Mail;
    default:
      return FileText;
  }
};

export function RecentActivity() {
  const { recentActivities } = useApp();

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="text-black font-medium">Recent Activity</h2>
      </div>
      
      <div className="space-y-3">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
            <p className="text-gray-400 text-xs">Generate reports or save drafts to see activity here</p>
          </div>
        ) : (
          recentActivities.map((activity) => {
            const IconComponent = getIconComponent(activity.icon);
            return (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50">
                  <IconComponent className={`w-5 h-5 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-black truncate">
                    {activity.filename ? activity.filename : activity.title}
                  </div>
                  <div className="text-gray-500 text-sm truncate">{activity.description}</div>
                </div>
                
                <div className="text-gray-400 text-xs">{getRelativeTime(activity.timestamp)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}