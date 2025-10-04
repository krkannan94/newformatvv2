import { Battery, Signal, Wifi } from "lucide-react";

export function StatusBar() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="flex justify-between items-center px-6 pt-3 pb-1 text-black">
      
    </div>
  );
}