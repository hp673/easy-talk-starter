import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Plus, Edit, Trash2, Calendar, Users, Mail, ExternalLink, AlertCircle } from 'lucide-react';

interface NotificationConfig {
  id?: string;
  form_id: string;
  form_name: string;
  form_type: 'equipment' | 'workplace';
  notification_type: 'pre_inspection' | 'due_reminder' | 'missed_reminder';
  rrule: string;
  recipients: string[];
  delivery_methods: string[];
  is_active: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

interface NotificationConfigModalProps {
  formId: string;
  formName: string;
  formType: 'equipment' | 'workplace';
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationConfigModal: React.FC<NotificationConfigModalProps> = ({
  formId,
  formName,
  formType,
  isOpen,
  onClose
}) => {
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingConfig, setEditingConfig] = useState<NotificationConfig | null>(null);
  const { toast } = useToast();

  // Wizard form state
  const [notificationType, setNotificationType] = useState<'pre_inspection' | 'due_reminder' | 'missed_reminder'>('pre_inspection');
  const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('DAILY');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [hour, setHour] = useState('9');
  const [minute, setMinute] = useState('0');
  const [rawRRule, setRawRRule] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>([]);
  const [nextOccurrences, setNextOccurrences] = useState<string[]>([]);

  const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Load configurations
  useEffect(() => {
    if (isOpen) {
      loadConfigurations();
    }
  }, [isOpen, formId]);

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_configs')
        .select('*')
        .eq('form_id', formId)
        .eq('form_type', formType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs((data || []) as NotificationConfig[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Build RRule from wizard inputs
  const buildRRule = () => {
    let rule = `FREQ=${frequency}`;
    
    if (selectedDays.length > 0) {
      rule += `;BYDAY=${selectedDays.join(',')}`;
    }
    
    rule += `;BYHOUR=${hour};BYMINUTE=${minute}`;
    
    return rule;
  };

  // Update RRule when inputs change
  useEffect(() => {
    if (wizardStep === 2 && !rawRRule) {
      setRawRRule(buildRRule());
    }
  }, [frequency, selectedDays, hour, minute, wizardStep]);

  // Calculate next occurrences (simplified preview)
  useEffect(() => {
    if (rawRRule) {
      // This is a simplified preview - in production, use rrule library
      const preview = [`Next run: ${new Date(Date.now() + 24*60*60*1000).toLocaleString()}`];
      setNextOccurrences(preview);
    }
  }, [rawRRule]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleRecipientToggle = (recipient: string) => {
    setRecipients(prev =>
      prev.includes(recipient) ? prev.filter(r => r !== recipient) : [...prev, recipient]
    );
  };

  const handleDeliveryMethodToggle = (method: string) => {
    setDeliveryMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const resetWizard = () => {
    setWizardStep(1);
    setNotificationType('pre_inspection');
    setFrequency('DAILY');
    setSelectedDays([]);
    setHour('9');
    setMinute('0');
    setRawRRule('');
    setRecipients([]);
    setDeliveryMethods([]);
    setEditingConfig(null);
  };

  const handleSaveConfiguration = async () => {
    if (recipients.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one recipient group',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryMethods.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one delivery method',
        variant: 'destructive',
      });
      return;
    }

    try {
      const configData = {
        form_id: formId,
        form_name: formName,
        form_type: formType,
        notification_type: notificationType,
        rrule: rawRRule,
        recipients: recipients as any,
        delivery_methods: deliveryMethods as any,
        is_active: true,
        created_by: 'Admin User', // TODO: Get from auth context
      };

      if (editingConfig?.id) {
        const { error } = await supabase
          .from('notification_configs')
          .update(configData)
          .eq('id', editingConfig.id);

        if (error) throw error;
        toast({ title: 'Notification updated successfully' });
      } else {
        const { error } = await supabase
          .from('notification_configs')
          .insert([configData]);

        if (error) throw error;
        toast({ title: 'Notification created successfully' });
      }

      await loadConfigurations();
      setShowWizard(false);
      resetWizard();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfiguration = async (configId: string) => {
    try {
      const { error } = await supabase
        .from('notification_configs')
        .delete()
        .eq('id', configId);

      if (error) throw error;
      toast({ title: 'Notification deleted successfully' });
      await loadConfigurations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditConfiguration = (config: NotificationConfig) => {
    setEditingConfig(config);
    setNotificationType(config.notification_type);
    setRawRRule(config.rrule);
    setRecipients(config.recipients);
    setDeliveryMethods(config.delivery_methods);
    setShowWizard(true);
    setWizardStep(4); // Go directly to review
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      pre_inspection: 'Pre-Inspection Reminder',
      due_reminder: 'Due Reminder',
      missed_reminder: 'Missed Reminder',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Configuration – {formName}
          </DialogTitle>
        </DialogHeader>

        {!showWizard ? (
          <div className="space-y-4">
            {/* Existing Notifications List */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Existing Notifications</h3>
              <Button onClick={() => setShowWizard(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Notification
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : configs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No notifications configured yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {configs.map((config) => (
                  <Card key={config.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getNotificationTypeLabel(config.notification_type)}
                            </Badge>
                            {config.is_active ? (
                              <Badge className="bg-success text-success-foreground">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Schedule:</strong> {config.rrule}
                            </p>
                            <p>
                              <strong>Recipients:</strong> {config.recipients.join(', ')}
                            </p>
                            <p>
                              <strong>Delivery:</strong> {config.delivery_methods.join(', ')}
                            </p>
                            {config.updated_at && (
                              <p className="text-xs text-muted-foreground">
                                Last updated: {new Date(config.updated_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditConfiguration(config)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => config.id && handleDeleteConfiguration(config.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Wizard Steps */
          <Tabs value={`step${wizardStep}`} onValueChange={(v) => setWizardStep(parseInt(v.replace('step', '')))}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="step1">1. Type</TabsTrigger>
              <TabsTrigger value="step2">2. Schedule</TabsTrigger>
              <TabsTrigger value="step3">3. Recipients</TabsTrigger>
              <TabsTrigger value="step4">4. Review</TabsTrigger>
            </TabsList>

            {/* Step 1: Notification Type */}
            <TabsContent value="step1" className="space-y-4">
              <div className="space-y-4">
                <Label>Select Notification Type</Label>
                <Select value={notificationType} onValueChange={(v: any) => setNotificationType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre_inspection">Pre-Inspection Reminder</SelectItem>
                    <SelectItem value="due_reminder">Due Reminder</SelectItem>
                    <SelectItem value="missed_reminder">Missed Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setWizardStep(2)}>Next</Button>
              </div>
            </TabsContent>

            {/* Step 2: Schedule (RRule Builder) */}
            <TabsContent value="step2" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Days of Week</Label>
                  <div className="flex gap-2 mt-2">
                    {daysOfWeek.map((day, idx) => (
                      <Button
                        key={day}
                        type="button"
                        variant={selectedDays.includes(day) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                      >
                        {daysLabels[idx]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Hour (0-23)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Minute (0-59)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center justify-between">
                    Raw RRule Pattern
                    <a
                      href="https://jkbrzt.github.io/rrule/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      Test Pattern <ExternalLink className="h-3 w-3" />
                    </a>
                  </Label>
                  <Textarea
                    value={rawRRule}
                    onChange={(e) => setRawRRule(e.target.value)}
                    placeholder="FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0"
                    rows={3}
                  />
                </div>

                {nextOccurrences.length > 0 && (
                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Preview:</strong>
                      <ul className="mt-2 space-y-1">
                        {nextOccurrences.map((occ, idx) => (
                          <li key={idx} className="text-xs">{occ}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setWizardStep(1)}>Back</Button>
                <Button onClick={() => setWizardStep(3)}>Next</Button>
              </div>
            </TabsContent>

            {/* Step 3: Recipients & Delivery */}
            <TabsContent value="step3" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Recipients (Select Groups)</Label>
                  <div className="space-y-2 mt-2">
                    {['operator', 'maintainer', 'admin'].map((group) => (
                      <div key={group} className="flex items-center gap-2">
                        <Checkbox
                          checked={recipients.includes(group)}
                          onCheckedChange={() => handleRecipientToggle(group)}
                        />
                        <Label className="capitalize cursor-pointer">{group}s</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Delivery Methods</Label>
                  <div className="space-y-2 mt-2">
                    {['email', 'sms'].map((method) => (
                      <div key={method} className="flex items-center gap-2">
                        <Checkbox
                          checked={deliveryMethods.includes(method)}
                          onCheckedChange={() => handleDeliveryMethodToggle(method)}
                        />
                        <Label className="capitalize cursor-pointer">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setWizardStep(2)}>Back</Button>
                <Button onClick={() => setWizardStep(4)}>Next</Button>
              </div>
            </TabsContent>

            {/* Step 4: Review & Save */}
            <TabsContent value="step4" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <strong>Notification Type:</strong>
                    <p className="text-sm text-muted-foreground">
                      {getNotificationTypeLabel(notificationType)}
                    </p>
                  </div>
                  <div>
                    <strong>Schedule Pattern:</strong>
                    <p className="text-sm text-muted-foreground font-mono">{rawRRule}</p>
                  </div>
                  <div>
                    <strong>Recipients:</strong>
                    <p className="text-sm text-muted-foreground capitalize">
                      {recipients.join(', ')}
                    </p>
                  </div>
                  <div>
                    <strong>Delivery Methods:</strong>
                    <p className="text-sm text-muted-foreground capitalize">
                      {deliveryMethods.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setShowWizard(false);
                  resetWizard();
                }}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setWizardStep(3)}>Back</Button>
                  <Button onClick={handleSaveConfiguration}>
                    {editingConfig ? 'Update' : 'Save'} Configuration
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
