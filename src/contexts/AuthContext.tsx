import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRole = 'operator' | 'maintenance' | 'site_admin' | 'org_admin';

interface InspectorFlags {
  isPrimary: boolean;
  isBackup: boolean;
}

interface SiteRoles {
  siteId: string;
  siteName: string;
  roles: AppRole[];
  inspectorFlags?: InspectorFlags;
}

interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  siteRoles: SiteRoles[];
  pin: string;
}

interface AuthContextType {
  user: User | null;
  login: (pin: string, userId: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  currentSite: string | null;
  setCurrentSite: (siteId: string) => void;
  currentRoleView: AppRole | null;
  setCurrentRoleView: (role: AppRole) => void;
  getCurrentSiteRoles: () => AppRole[];
  hasRole: (role: AppRole, siteId?: string) => boolean;
  getInspectorFlags: (siteId?: string) => InspectorFlags | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users with multi-role support
const mockUsers: User[] = [
  {
    id: 'OP001',
    name: 'John Operator',
    email: 'operator@minetrak.com',
    organizationId: 'org-001',
    pin: '1234',
    siteRoles: [
      {
        siteId: 'site-001',
        siteName: 'North Mining Site',
        roles: ['operator'],
      },
    ],
  },
  {
    id: 'MAINT002',
    name: 'Sarah Maintenance',
    email: 'maintenance@minetrak.com',
    organizationId: 'org-001',
    pin: '5678',
    siteRoles: [
      {
        siteId: 'site-001',
        siteName: 'North Mining Site',
        roles: ['operator', 'maintenance'],
        inspectorFlags: { isPrimary: true, isBackup: false },
      },
    ],
  },
  {
    id: 'ADM003',
    name: 'Admin User',
    email: 'admin@minetrak.com',
    organizationId: 'org-001',
    pin: '0000',
    siteRoles: [
      {
        siteId: 'site-001',
        siteName: 'North Mining Site',
        roles: ['operator', 'maintenance', 'site_admin'],
        inspectorFlags: { isPrimary: false, isBackup: true },
      },
      {
        siteId: 'site-002',
        siteName: 'South Mining Site',
        roles: ['site_admin'],
      },
    ],
  },
  {
    id: 'ORGADM004',
    name: 'Organization Admin',
    email: 'orgadmin@minetrak.com',
    organizationId: 'org-001',
    pin: '9999',
    siteRoles: [
      {
        siteId: 'site-001',
        siteName: 'North Mining Site',
        roles: ['org_admin', 'site_admin', 'maintenance', 'operator'],
      },
      {
        siteId: 'site-002',
        siteName: 'South Mining Site',
        roles: ['org_admin', 'site_admin'],
      },
    ],
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSite, setCurrentSite] = useState<string | null>(null);
  const [currentRoleView, setCurrentRoleView] = useState<AppRole | null>(null);

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('minetrak_user');
    const savedSite = localStorage.getItem('minetrak_current_site');
    const savedRoleView = localStorage.getItem('minetrak_role_view');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      if (savedSite) {
        setCurrentSite(savedSite);
      } else if (parsedUser.siteRoles?.length > 0) {
        setCurrentSite(parsedUser.siteRoles[0].siteId);
      }
      
      if (savedRoleView) {
        setCurrentRoleView(savedRoleView as AppRole);
      }
    }
  }, []);

  const login = async (pin: string, userId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const foundUser = mockUsers.find(u => u.id === userId && u.pin === pin);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('minetrak_user', JSON.stringify(foundUser));
      
      // Set default site
      if (foundUser.siteRoles.length > 0) {
        const defaultSite = foundUser.siteRoles[0].siteId;
        setCurrentSite(defaultSite);
        localStorage.setItem('minetrak_current_site', defaultSite);
        
        // Set default role view to highest permission role
        const siteRole = foundUser.siteRoles[0];
        const defaultRole = siteRole.roles.includes('org_admin') ? 'org_admin' :
                           siteRole.roles.includes('site_admin') ? 'site_admin' :
                           siteRole.roles.includes('maintenance') ? 'maintenance' : 'operator';
        setCurrentRoleView(defaultRole);
        localStorage.setItem('minetrak_role_view', defaultRole);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentSite(null);
    setCurrentRoleView(null);
    localStorage.removeItem('minetrak_user');
    localStorage.removeItem('minetrak_current_site');
    localStorage.removeItem('minetrak_role_view');
  };

  const handleSetCurrentSite = (siteId: string) => {
    setCurrentSite(siteId);
    localStorage.setItem('minetrak_current_site', siteId);
    
    // Reset role view to highest available for new site
    if (user) {
      const siteRole = user.siteRoles.find(sr => sr.siteId === siteId);
      if (siteRole) {
        const defaultRole = siteRole.roles.includes('org_admin') ? 'org_admin' :
                           siteRole.roles.includes('site_admin') ? 'site_admin' :
                           siteRole.roles.includes('maintenance') ? 'maintenance' : 'operator';
        setCurrentRoleView(defaultRole);
        localStorage.setItem('minetrak_role_view', defaultRole);
      }
    }
  };

  const handleSetCurrentRoleView = (role: AppRole) => {
    setCurrentRoleView(role);
    localStorage.setItem('minetrak_role_view', role);
  };

  const getCurrentSiteRoles = (): AppRole[] => {
    if (!user || !currentSite) return [];
    const siteRole = user.siteRoles.find(sr => sr.siteId === currentSite);
    return siteRole?.roles || [];
  };

  const hasRole = (role: AppRole, siteId?: string): boolean => {
    if (!user) return false;
    const targetSite = siteId || currentSite;
    if (!targetSite) return false;
    
    const siteRole = user.siteRoles.find(sr => sr.siteId === targetSite);
    return siteRole?.roles.includes(role) || false;
  };

  const getInspectorFlags = (siteId?: string): InspectorFlags | null => {
    if (!user) return null;
    const targetSite = siteId || currentSite;
    if (!targetSite) return null;
    
    const siteRole = user.siteRoles.find(sr => sr.siteId === targetSite);
    return siteRole?.inspectorFlags || null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    currentSite,
    setCurrentSite: handleSetCurrentSite,
    currentRoleView,
    setCurrentRoleView: handleSetCurrentRoleView,
    getCurrentSiteRoles,
    hasRole,
    getInspectorFlags,
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
