import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'operator' | 'maintainer' | 'admin';
  pin: string;
}

interface AuthContextType {
  user: User | null;
  login: (pin: string, userId: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: 'OP001', name: 'OP001', role: 'operator', pin: '1234' },
  { id: 'MAINT002', name: 'MAINT002', role: 'maintainer', pin: '5678' },
  { id: 'ADM003', name: 'ADM003', role: 'admin', pin: '0000' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('minetrak_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (pin: string, userId: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const foundUser = mockUsers.find(u => u.id === userId && u.pin === pin);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('minetrak_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('minetrak_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { mockUsers };