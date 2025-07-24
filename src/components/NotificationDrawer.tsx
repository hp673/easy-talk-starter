import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, AlertTriangle, Clock, X } from 'lucide-react';

interface DefectAlert {
  id: string;
  equipmentId: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
  type: 'SMS' | 'Email' | 'System';
  isRead: boolean;
}

const mockAlerts: DefectAlert[] = [
  {
    id: 'A-001',
    equipmentId: 'CAT-789C-001',
    severity: 'Critical',
    message: 'Hydraulic system failure detected - immediate attention required',
    timestamp: '2024-01-22T14:30:00Z',
    type: 'SMS',
    isRead: false,
  },
  {
    id: 'A-002',
    equipmentId: 'KOM-PC5500-002',
    severity: 'High',
    message: 'Engine temperature exceeding safe limits',
    timestamp: '2024-01-22T13:15:00Z',
    type: 'Email',
    isRead: false,
  },
  {
    id: 'A-003',
    equipmentId: 'CAT-994K-003',
    severity: 'Medium',
    message: 'Scheduled maintenance reminder',
    timestamp: '2024-01-22T10:00:00Z',
    type: 'System',
    isRead: true,
  },
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTicket: (equipmentId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onViewTicket 
}) => {
  const [alerts, setAlerts] = useState<DefectAlert[]>(mockAlerts);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SMS': return '📱';
      case 'Email': return '📧';
      case 'System': return '⚙️';
      default: return '🔔';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md border-l bg-background shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Alerts</h2>
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`transition-all ${!alert.isRead ? 'border-primary' : 'opacity-70'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(alert.type)}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-1">{alert.equipmentId}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          onViewTicket(alert.equipmentId);
                          markAsRead(alert.id);
                        }}
                        className="flex-1"
                      >
                        View Ticket
                      </Button>
                      {!alert.isRead && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};