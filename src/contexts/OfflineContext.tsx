import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineData {
  forms: any[];
  photos: any[];
  signatures: any[];
}

interface OfflineContextType {
  isOnline: boolean;
  offlineData: OfflineData;
  saveOfflineData: (type: keyof OfflineData, data: any) => void;
  syncData: () => Promise<void>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    forms: [],
    photos: [],
    signatures: [],
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    const savedData = localStorage.getItem('minetrak_offline_data');
    if (savedData) {
      setOfflineData(JSON.parse(savedData));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = (type: keyof OfflineData, data: any) => {
    const newOfflineData = {
      ...offlineData,
      [type]: [...offlineData[type], { ...data, timestamp: Date.now() }],
    };
    setOfflineData(newOfflineData);
    localStorage.setItem('minetrak_offline_data', JSON.stringify(newOfflineData));
  };

  const syncData = async (): Promise<void> => {
    if (!isOnline) return;

    setIsSyncing(true);
    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear offline data after successful sync
      const clearedData = { forms: [], photos: [], signatures: [] };
      setOfflineData(clearedData);
      localStorage.setItem('minetrak_offline_data', JSON.stringify(clearedData));
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    isOnline,
    offlineData,
    saveOfflineData,
    syncData,
    isSyncing,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};