import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EventNotificationConfig } from './EventNotificationConfig';
import { GeneralNotificationModal } from './GeneralNotificationModal';
import { 
  Bell, Plus, Settings, FileText, Ticket, AlertTriangle, 
  Wrench, Activity, CheckCircle2, Mail, MessageSquare
} from 'lucide-react';

interface EventNotification {
  id: string;
  name: string;
  description: string;
  icon: any;
  isActive: boolean;
  eventType: string;
  deliveryMethods: string[];
  recipientCount: number;
}

interface NotificationConfig {
  id: string;
  form_id: string;
  form_name: string;
  form_type: string;
  notification_type: string;
  is_active: boolean;
  delivery_methods: string[];
  recipients: any[];
}

export const NotificationExecutionMonitor: React.FC = () => {
  const [eventNotifications, setEventNotifications] = useState<EventNotification[]>([
    {
      id: '1',
      name: 'Form Submitted',
      description: 'Notify when an inspection or workplace exam form is submitted',
      icon: FileText,
      isActive: true,
      eventType: 'form_submitted',
      deliveryMethods: ['email', 'sms'],
      recipientCount: 3,
    },
    {
      id: '2',
      name: 'Ticket Created',
      description: 'Notify when a new maintenance ticket is created',
      icon: Ticket,
      isActive: true,
      eventType: 'ticket_created',
      deliveryMethods: ['email'],
      recipientCount: 5,
    },
    {
      id: '3',
      name: 'Critical Defect Reported',
      description: 'Immediate notification for critical safety issues',
      icon: AlertTriangle,
      isActive: true,
      eventType: 'critical_defect',
      deliveryMethods: ['email', 'sms'],
      recipientCount: 2,
    },
    {
      id: '4',
      name: 'Maintenance Due',
      description: 'Remind operators when scheduled maintenance is approaching',
      icon: Wrench,
      isActive: false,
      eventType: 'maintenance_due',
      deliveryMethods: ['email'],
      recipientCount: 8,
    },
    {
      id: '5',
      name: 'Equipment Status Changed',
      description: 'Notify when equipment operational status changes',
      icon: Activity,
      isActive: true,
      eventType: 'status_changed',
      deliveryMethods: ['email'],
      recipientCount: 4,
    },
    {
      id: '6',
      name: 'Inspection Completed',
      description: 'Notify supervisors when inspections are completed',
      icon: CheckCircle2,
      isActive: false,
      eventType: 'inspection_completed',
      deliveryMethods: ['email'],
      recipientCount: 2,
    },
  ]);
  
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventNotification | null>(null);
  const [showEventConfig, setShowEventConfig] = useState(false);
  const [showGeneralModal, setShowGeneralModal] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs((data || []) as NotificationConfig[]);
    } catch (error: any) {
      toast({
        title: 'Error loading configurations',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEvent = async (eventId: string) => {
    setEventNotifications(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, isActive: !event.isActive } : event
      )
    );

    toast({
      title: 'Event Status Updated',
      description: 'Notification event has been toggled successfully.',
    });
  };

  const handleConfigureEvent = (event: EventNotification) => {
    setSelectedEvent(event);
    setShowEventConfig(true);
  };

  const handleCreateGeneral = () => {
    setShowGeneralModal(true);
  };

  const handleSaveEventConfig = (config: any) => {
    console.log('Saving event config:', config);
    toast({ title: 'Event notification updated successfully' });
  };

  const handleSaveGeneralNotification = (config: any) => {
    console.log('Saving general notification:', config);
    toast({ title: 'General notification created successfully' });
  };

  const getActiveCount = () => eventNotifications.filter(e => e.isActive).length;
  const getTotalCount = () => eventNotifications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notification Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure event-based notifications and general alerts
          </p>
        </div>
        <Button onClick={handleCreateGeneral} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create General Notification
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getActiveCount()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              out of {getTotalCount()} total events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivery Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                SMS
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              General Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{configs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              scheduled notifications configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Notifications List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Event-Based Notifications</h3>
        <div className="grid grid-cols-1 gap-4">
          {eventNotifications.map((event) => {
            const IconComponent = event.icon;
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${event.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                        <IconComponent className={`h-6 w-6 ${event.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-base">{event.name}</h4>
                          {event.isActive && (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              Active
                            </Badge>
                          )}
                          {!event.isActive && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {event.deliveryMethods.join(', ')}
                          </span>
                          <span>•</span>
                          <span>
                            {event.recipientCount} recipient{event.recipientCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigureEvent(event)}
                        className="gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Configure
                      </Button>
                      
                      <Switch
                        checked={event.isActive}
                        onCheckedChange={() => handleToggleEvent(event.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* General Notifications Section */}
      {configs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">General Notifications</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduled Notifications</CardTitle>
              <CardDescription>
                Time-based notifications configured for forms and workplace exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{config.form_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {config.notification_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.is_active ? (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Configuration Modal */}
      {selectedEvent && (
        <EventNotificationConfig
          event={selectedEvent}
          isOpen={showEventConfig}
          onClose={() => {
            setShowEventConfig(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEventConfig}
        />
      )}

      {/* General Notification Modal */}
      <GeneralNotificationModal
        isOpen={showGeneralModal}
        onClose={() => setShowGeneralModal(false)}
        onSave={handleSaveGeneralNotification}
      />
    </div>
  );
};