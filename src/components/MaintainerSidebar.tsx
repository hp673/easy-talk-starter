import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  Wrench,
  AlertTriangle,
  History,
  QrCode,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  HardHat,
  FileText,
  Calendar,
  MessageSquare,
  Package
} from 'lucide-react';
import minetrakLogo from '@/assets/minetrak-logo-icon.png';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  route?: string;
}

interface MaintainerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQrScan: () => void;
  notificationCount?: number;
}

export const MaintainerSidebar = ({ 
  activeTab, 
  onTabChange, 
  onQrScan,
  notificationCount = 2 
}: MaintainerSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainNavItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'tickets', label: 'Work Orders', icon: <Wrench className="h-5 w-5" />, badge: 3 },
    { id: 'inspections', label: 'Inspections', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'equipment', label: 'Assets', icon: <HardHat className="h-5 w-5" /> },
  ];

  const workflowItems: NavItem[] = [
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-5 w-5" /> },
    { id: 'parts', label: 'Parts & Inventory', icon: <Package className="h-5 w-5" /> },
    { id: 'history', label: 'History', icon: <History className="h-5 w-5" /> },
  ];

  const bottomItems: NavItem[] = [
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" />, badge: notificationCount },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const content = (
      <button
        onClick={() => item.onClick ? item.onClick() : onTabChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-sidebar-foreground/80",
          collapsed && "justify-center px-2"
        )}
      >
        <span className="flex-shrink-0 relative">
          {item.icon}
          {item.badge && item.badge > 0 && collapsed && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="secondary" className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && item.badge > 0 && (
              <Badge variant="secondary" className="bg-destructive text-destructive-foreground text-xs">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo & Brand */}
        <div className={cn(
          "h-16 border-b border-sidebar-border flex items-center px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3">
            <img src={minetrakLogo} alt="MineTrak" className="h-8 w-8" />
            {!collapsed && (
              <span className="font-rajdhani font-bold text-lg text-sidebar-foreground">MineTrak</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "absolute -right-3 top-6 bg-sidebar border border-sidebar-border shadow-sm rounded-full"
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* QR Scan Button */}
        <div className="p-3">
          <Button
            onClick={onQrScan}
            className={cn(
              "w-full btn-mining",
              collapsed ? "px-2" : "px-4"
            )}
          >
            <QrCode className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Scan QR</span>}
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {/* Primary Nav */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                Main
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavButton key={item.id} item={item} isActive={activeTab === item.id} />
            ))}
          </div>

          {/* Workflow Nav */}
          <div className="mt-6 space-y-1">
            {!collapsed && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                Workflow
              </p>
            )}
            {workflowItems.map((item) => (
              <NavButton key={item.id} item={item} isActive={activeTab === item.id} />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {bottomItems.map((item) => (
            <NavButton key={item.id} item={item} isActive={activeTab === item.id} />
          ))}

          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-3 px-3 py-2 mt-2 rounded-lg bg-sidebar-accent/50",
            collapsed && "justify-center px-2"
          )}>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">Maintainer</p>
              </div>
            )}
            {collapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-sidebar-foreground/60 hover:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/60 hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MaintainerSidebar;
