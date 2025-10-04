import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import EntryPage from './components/EntryPage';
import Dashboard from './components/Dashboard';
import GenerateReport from './components/GenerateReport';
import SavedDrafts from './components/SavedDrafts';
import PreviewPage from './components/PreviewPage';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen as CapSplash } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#047857' });

      CapSplash.hide();

      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <Router>
        <ScrollToTop /> {/* <-- This component now resets the scroll position on every navigation */}
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate-report" element={<GenerateReport />} />
            <Route path="/generate-report/:draftId" element={<GenerateReport />} />
            <Route path="/drafts" element={<SavedDrafts />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;