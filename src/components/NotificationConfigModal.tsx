import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Plus, Edit, Trash2, Calendar, Users, Mail, ExternalLink, AlertCircle, Info, X, Clock, MessageSquare } from 'lucide-react';

interface ScheduleRule {
  id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  days?: string[];
  monthDay?: number;
  hour: string;
  minute: string;
  offsetMinutes: number;
  rrule: string;
}

interface NotificationConfig {
  id?: string;
  form_id: string;
  form_name: string;
  form_type: 'equipment' | 'workplace';
  notification_type: 'pre_inspection' | 'due_reminder' | 'missed_reminder' | 'event_based';
  scope: 'equipment' | 'equipment_class' | 'workplace';
  scope_id: string;
  apply_to_all: boolean;
  evidence_type?: 'inspection_started' | 'inspection_completed' | 'document_uploaded' | 'no_evidence';
  schedule_rules: ScheduleRule[];
  recipients: string[];
  recipient_groups: string[];
  custom_emails: string[];
  delivery_methods: string[];
  escalation_enabled: boolean;
  escalation_hours?: number;
  escalation_role?: string;
  message_template: string;
  is_active: boolean;
  created_by: string;
  timezone: string;
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
  const [notificationType, setNotificationType] = useState<'pre_inspection' | 'due_reminder' | 'missed_reminder' | 'event_based'>('pre_inspection');
  const [scope, setScope] = useState<'equipment' | 'equipment_class' | 'workplace'>(formType);
  const [scopeId, setScopeId] = useState(formId);
  const [applyToAll, setApplyToAll] = useState(false);
  const [evidenceType, setEvidenceType] = useState<'inspection_started' | 'inspection_completed' | 'document_uploaded' | 'no_evidence'>('no_evidence');
  
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientGroups, setRecipientGroups] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['email']);
  const [escalationEnabled, setEscalationEnabled] = useState(false);
  const [escalationHours, setEscalationHours] = useState('24');
  const [escalationRole, setEscalationRole] = useState('site_admin');
  const [messageTemplate, setMessageTemplate] = useState('Inspection due for {{equipment_name}} at {{workplace_name}} by {{due_time}}.');
  const [timezone] = useState('Site/Local');

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map old structure to new structure
      const mappedConfigs = (data || []).map((config: any) => ({
        ...config,
        scope: formType,
        scope_id: formId,
        apply_to_all: false,
        schedule_rules: config.rrule ? [{
          id: '1',
          frequency: 'DAILY' as const,
          hour: '9',
          minute: '0',
          offsetMinutes: 0,
          rrule: config.rrule,
        }] : [],
        recipient_groups: config.recipients || [],
        custom_emails: [],
        escalation_enabled: false,
        message_template: 'Inspection due for {{equipment_name}} at {{workplace_name}} by {{due_time}}.',
        timezone: 'Site/Local',
      }));
      setConfigs(mappedConfigs);
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

  // Build RRule from schedule rule
  const buildRRule = (rule: Partial<ScheduleRule>) => {
    let rrule = `FREQ=${rule.frequency || 'DAILY'}`;
    
    if (rule.days && rule.days.length > 0) {
      rrule += `;BYDAY=${rule.days.join(',')}`;
    }
    
    if (rule.monthDay) {
      rrule += `;BYMONTHDAY=${rule.monthDay}`;
    }
    
    rrule += `;BYHOUR=${rule.hour || '9'};BYMINUTE=${rule.minute || '0'}`;
    
    return rrule;
  };

  const addScheduleRule = () => {
    const newRule: ScheduleRule = {
      id: Date.now().toString(),
      frequency: 'DAILY',
      hour: '9',
      minute: '0',
      offsetMinutes: 0,
      rrule: 'FREQ=DAILY;BYHOUR=9;BYMINUTE=0',
    };
    setScheduleRules([...scheduleRules, newRule]);
  };

  const updateScheduleRule = (id: string, updates: Partial<ScheduleRule>) => {
    setScheduleRules(rules =>
      rules.map(rule => {
        if (rule.id === id) {
          const updated = { ...rule, ...updates };
          updated.rrule = buildRRule(updated);
          return updated;
        }
        return rule;
      })
    );
  };

  const deleteScheduleRule = (id: string) => {
    setScheduleRules(rules => rules.filter(rule => rule.id !== id));
  };

  const getNextRun = (rrule: string) => {
    // Simplified next run calculation
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddCustomEmail = () => {
    if (customEmailInput && customEmailInput.includes('@')) {
      setCustomEmails([...customEmails, customEmailInput]);
      setCustomEmailInput('');
    }
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
    setScope(formType);
    setScopeId(formId);
    setApplyToAll(false);
    setEvidenceType('no_evidence');
    setScheduleRules([]);
    setRecipients([]);
    setRecipientGroups([]);
    setCustomEmails([]);
    setCustomEmailInput('');
    setDeliveryMethods(['email']);
    setEscalationEnabled(false);
    setEscalationHours('24');
    setEscalationRole('site_admin');
    setMessageTemplate('Inspection due for {{equipment_name}} at {{workplace_name}} by {{due_time}}.');
    setEditingConfig(null);
  };

  const handleSaveConfiguration = async () => {
    if (recipientGroups.length === 0 && recipients.length === 0 && customEmails.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one recipient',
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

    if (scheduleRules.length === 0 && notificationType !== 'event_based') {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one schedule rule',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Store as legacy format for now
      const primaryRRule = scheduleRules[0]?.rrule || 'FREQ=DAILY;BYHOUR=9;BYMINUTE=0';
      
      const configData = {
        form_id: scopeId,
        form_name: formName,
        form_type: formType,
        notification_type: notificationType as any,
        rrule: primaryRRule,
        recipients: [...recipientGroups, ...recipients] as any,
        delivery_methods: deliveryMethods as any,
        is_active: true,
        created_by: 'Admin User',
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
    setScheduleRules(config.schedule_rules || []);
    setRecipientGroups(config.recipient_groups || []);
    setRecipients(config.recipients || []);
    setCustomEmails(config.custom_emails || []);
    setDeliveryMethods(config.delivery_methods || []);
    setMessageTemplate(config.message_template || '');
    setShowWizard(true);
    setWizardStep(4);
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
                              <strong>Schedule:</strong> {config.schedule_rules?.[0]?.rrule || 'N/A'}
                            </p>
                            <p>
                              <strong>Recipients:</strong> {[...config.recipient_groups, ...config.recipients].join(', ')}
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

            {/* Step 2: Schedule Rules (Multi-Rule Builder) */}
            <TabsContent value="step2" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Schedule Rules</Label>
                    <p className="text-sm text-muted-foreground">Add multiple schedules with RRULE patterns</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleRule}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                {scheduleRules.length === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Click "Add Rule" to create your first schedule. You can have multiple schedules (e.g., 27th, last Thursday, 5 days before month-end).
                    </AlertDescription>
                  </Alert>
                )}

                {scheduleRules.map((rule, index) => (
                  <Card key={rule.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Schedule Rule {index + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteScheduleRule(rule.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Frequency</Label>
                          <Select
                            value={rule.frequency}
                            onValueChange={(v: any) => updateScheduleRule(rule.id, { frequency: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DAILY">Daily</SelectItem>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Pre-reminder Offset (minutes)</Label>
                          <Input
                            type="number"
                            value={rule.offsetMinutes}
                            onChange={(e) =>
                              updateScheduleRule(rule.id, { offsetMinutes: parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {rule.frequency === 'WEEKLY' && (
                        <div>
                          <Label>Days of Week</Label>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {daysOfWeek.map((day, idx) => (
                              <Button
                                key={day}
                                type="button"
                                variant={(rule.days || []).includes(day) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  const currentDays = rule.days || [];
                                  const newDays = currentDays.includes(day)
                                    ? currentDays.filter(d => d !== day)
                                    : [...currentDays, day];
                                  updateScheduleRule(rule.id, { days: newDays });
                                }}
                              >
                                {daysLabels[idx]}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {rule.frequency === 'MONTHLY' && (
                        <div>
                          <Label>Day of Month</Label>
                          <Input
                            type="number"
                            min="1"
                            max="31"
                            value={rule.monthDay || ''}
                            onChange={(e) =>
                              updateScheduleRule(rule.id, { monthDay: parseInt(e.target.value) || undefined })
                            }
                            placeholder="e.g., 27"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Hour (0-23)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="23"
                            value={rule.hour}
                            onChange={(e) => updateScheduleRule(rule.id, { hour: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Minute (0-59)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={rule.minute}
                            onChange={(e) => updateScheduleRule(rule.id, { minute: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-muted-foreground">RRULE:</span>
                          <span className="text-foreground">{rule.rrule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Next run:</span>
                          <span className="text-foreground">{getNextRun(rule.rrule)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Timezone: {timezone}</p>
                      <p className="text-xs">All evaluations occur in site timezone</p>
                    </div>
                  </AlertDescription>
                </Alert>
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
                  <Label className="text-base">Role Hierarchy</Label>
                  <div className="space-y-2 mt-2">
                    {['operator', 'technician', 'site_admin', 'supervisor'].map((role) => (
                      <div key={role} className="flex items-center gap-2">
                        <Checkbox
                          checked={recipientGroups.includes(role)}
                          onCheckedChange={() => handleRecipientToggle(role)}
                        />
                        <Label className="capitalize cursor-pointer">{role.replace('_', ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base">Custom Emails</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={customEmailInput}
                        onChange={(e) => setCustomEmailInput(e.target.value)}
                        placeholder="Enter email address"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomEmail();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddCustomEmail} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {customEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {customEmails.map((email, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-1">
                            {email}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setCustomEmails(customEmails.filter((_, i) => i !== idx))}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base">Delivery Channels</Label>
                  <div className="space-y-2 mt-2">
                    {['email', 'sms'].map((method) => (
                      <div key={method} className="flex items-center gap-2">
                        <Checkbox
                          checked={deliveryMethods.includes(method)}
                          onCheckedChange={() => handleDeliveryMethodToggle(method)}
                        />
                        <div className="flex items-center gap-2">
                          {method === 'email' ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                          <Label className="capitalize cursor-pointer">{method}</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Switch
                      checked={escalationEnabled}
                      onCheckedChange={setEscalationEnabled}
                    />
                    <Label className="text-base">Enable Escalation</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Escalate if not acknowledged within specified hours</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {escalationEnabled && (
                    <div className="space-y-3 pl-6">
                      <div>
                        <Label>Escalation Time (hours)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={escalationHours}
                          onChange={(e) => setEscalationHours(e.target.value)}
                          placeholder="24"
                        />
                      </div>
                      <div>
                        <Label>Escalate To</Label>
                        <Select value={escalationRole} onValueChange={setEscalationRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="site_admin">Site Admin</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={() => toast({ title: 'Preview Recipients', description: 'Showing resolved recipient list...' })}>
                  <Users className="h-4 w-4 mr-2" />
                  Preview Recipients
                </Button>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setWizardStep(2)}>Back</Button>
                <Button onClick={() => setWizardStep(4)}>Next</Button>
              </div>
            </TabsContent>

            {/* Step 4: Message Template & Review */}
            <TabsContent value="step4" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Message Template</Label>
                  <Textarea
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    rows={4}
                    placeholder="Enter your notification message..."
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available placeholders: {'{{equipment_name}}'}, {'{{due_date}}'}, {'{{site_name}}'}, {'{{due_time}}'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Test Notification
                  </Button>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Configuration Summary</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="active-toggle">Active</Label>
                      <Switch id="active-toggle" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <strong className="text-sm">Notification Type:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getNotificationTypeLabel(notificationType)}
                      </p>
                    </div>

                    <div>
                      <strong className="text-sm">Scope:</strong>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">
                        {scope} - {formName}
                      </p>
                    </div>

                    <div>
                      <strong className="text-sm">Schedule Rules:</strong>
                      <div className="mt-1 space-y-2">
                        {scheduleRules.map((rule, idx) => (
                          <div key={rule.id} className="text-sm bg-background p-2 rounded border">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Rule {idx + 1}</span>
                              <Badge variant="outline">{rule.frequency}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono mt-1">{rule.rrule}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {getNextRun(rule.rrule)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Recipients:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recipientGroups.map((group) => (
                          <Badge key={group} variant="secondary" className="capitalize">
                            {group.replace('_', ' ')}
                          </Badge>
                        ))}
                        {customEmails.map((email) => (
                          <Badge key={email} variant="outline">
                            {email}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-sm">Delivery Methods:</strong>
                      <div className="flex gap-1 mt-1">
                        {deliveryMethods.map((method) => (
                          <Badge key={method} variant="default" className="capitalize">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {escalationEnabled && (
                      <div>
                        <strong className="text-sm">Escalation:</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          After {escalationHours}h → {escalationRole.replace('_', ' ')}
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <strong className="text-sm">Timezone:</strong>
                      <p className="text-sm text-muted-foreground mt-1">{timezone}</p>
                      <p className="text-xs text-muted-foreground mt-1">All evaluations occur in site timezone</p>
                    </div>
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
                  <Button onClick={handleSaveConfiguration} className="btn-mining">
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
