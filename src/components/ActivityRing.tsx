import {
  User,
  TrendingUp,
  FileText,
  Users,
  Target,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function ActivityRing() {
  const { formData, reportsGenerated, reportsShared, drafts } = useApp();
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
        ? "Good Afternoon"
        : "Good Evening";

  // Extract first name from the technician's full name, or use full name if no space
  const getTechnicianDisplayName = () => {
    if (!formData?.serviceCompletedBy) {
      return "User"; // Fallback if no technician name is available
    }
    const firstName = formData.serviceCompletedBy.split(' ')[0];
    return firstName;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 mx-4 mb-6 shadow-lg border border-green-100/50">
      {/* Time-based greeting */}
      <div className="text-gray-600 text-sm mb-3">
        {greeting}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Enhanced avatar with status indicator */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          <div className="flex-1">
            <div className="text-gray-600 text-sm">
              Welcome back,
            </div>
            <div className="text-black text-2xl font-medium">
              {getTechnicianDisplayName()}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Ready to generate reports today?
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats preview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-black font-medium">{reportsGenerated}</div>
          <div className="text-gray-500 text-xs">Reports</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-black font-medium">{reportsShared}</div>
          <div className="text-gray-500 text-xs">Shared</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-white/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-black font-medium">{drafts?.length || 0}</div>
          <div className="text-gray-500 text-xs">Drafts</div>
        </div>
      </div>
    </div>
  );
}
