import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade-out to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-cbre-primary to-cbre-accent z-50 flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="text-center animate-ios-scale">
        <img src="/logowhite.png" alt="CBRE" className="h-8 mx-auto mb-ios-sm animate-pulse" />
        <div className="text-ios-title3 text-white/80 animate-ios-fade-in">
          Developed By Kannan
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;