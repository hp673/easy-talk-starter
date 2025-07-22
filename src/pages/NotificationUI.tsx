import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { 
  Bell, AlertTriangle, Info, CheckCircle, Clock, 
  Wifi, WifiOff, LogOut, ArrowLeft, X, Check
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  equipmentId?: string;
  priority: 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Critical Equipment Failure',
    message: 'CAT-789C-001 hydraulic system failure detected. Immediate maintenance required.',
    timestamp: '2024-01-22T09:15:00Z',
    read: false,
    actionRequired: true,
    equipmentId: 'CAT-789C-001',
    priority: 'high',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Maintenance Due',
    message: 'Scheduled maintenance for KOM-PC5500-002 is due within 24 hours.',
    timestamp: '2024-01-22T08:30:00Z',
    read: false,
    actionRequired: true,
    equipmentId: 'KOM-PC5500-002',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'info',
    title: 'Inspection Completed',
    message: 'Pre-shift inspection for CAT-994K-003 completed successfully by John Operator.',
    timestamp: '2024-01-22T07:45:00Z',
    read: true,
    actionRequired: false,
    equipmentId: 'CAT-994K-003',
    priority: 'low',
  },
  {
    id: '4',
    type: 'success',
    title: 'Maintenance Completed',
    message: 'Oil change and filter replacement completed for HIT-EH5000AC-004.',
    timestamp: '2024-01-21T16:20:00Z',
    read: true,
    actionRequired: false,
    equipmentId: 'HIT-EH5000AC-004',
    priority: 'low',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Form Submission Failed',
    message: 'Inspection form submission failed due to network issues. Data saved offline.',
    timestamp: '2024-01-21T14:10:00Z',
    read: false,
    actionRequired: true,
    priority: 'medium',
  },
];

const NotificationUI = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'critical' : 'warning',
          title: 'New Alert',
          message: 'Equipment monitoring system detected an anomaly.',
          timestamp: new Date().toISOString(),
          read: false,
          actionRequired: true,
          priority: 'high',
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 60000); // New notification every minute (for demo)

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'info': return 'text-primary bg-primary/10';
      case 'success': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'critical') return notif.type === 'critical';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread, {criticalCount} critical alerts
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isOnline ? (
              <div className="status-online">
                <Wifi className="h-4 w-4" />
                Online
              </div>
            ) : (
              <div className="status-offline">
                <WifiOff className="h-4 w-4" />
                Offline - {notifications.filter(n => !n.read).length} queued
              </div>
            )}
            
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-warning">{unreadCount}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('critical')}
                >
                  Critical ({criticalCount})
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    
                    {notification.equipmentId && (
                      <Badge variant="outline" className="text-xs">
                        Equipment: {notification.equipmentId}
                      </Badge>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      
                      {notification.actionRequired && (
                        <Button size="sm" className="btn-mining">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' ? 'All caught up!' : `No ${filter} notifications at this time.`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Push Notification Status */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time alerts for critical equipment issues
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationUI;