import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionIssues, setConnectionIssues] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionIssues(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionIssues(true);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for fetch errors that might indicate network issues
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.ok) {
          setConnectionIssues(false);
        }
        return response;
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setConnectionIssues(true);
        }
        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, []);

  if (isOnline && !connectionIssues) {
    return null; // Don't show anything when connection is good
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center space-x-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4" />
            <span>網路連線已中斷</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>網路連線不穩定，請稍後再試</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;