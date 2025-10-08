import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Plus, Edit, Trash2, Calendar, Users, Mail, Clock, Info, AlertCircle, Send, Eye, X, CheckCircle2 } from 'lucide-react';

interface ScheduleRule {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  pattern: {
    days?: number[]; // 0-6 for weekly, 1-31 for monthly
    time: string; // HH:mm format
  };
  offsetMinutes: number;
  rrule: string;
  nextRun?: string;
}

interface NotificationConfig {
  id?: string;
  form_id: string;
  form_name: string;
  form_type: 'equipment' | 'workplace';
  notification_type: 'pre_inspection' | 'due_reminder' | 'missed_reminder';
  recipients: string[];
  delivery_methods: string[];
  rrule: string;
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

  // Step 1: Type & Scope
  const [notificationType, setNotificationType] = useState<'pre_inspection' | 'due_reminder' | 'missed_reminder'>('pre_inspection');
  const [scope, setScope] = useState<'equipment' | 'equipment_class' | 'workplace'>('equipment');
  const [scopeId, setScopeId] = useState<string>(formId || '');
  const [applyToClass, setApplyToClass] = useState(false);
  const [evidenceType, setEvidenceType] = useState<string>('inspection_completed');

  // Step 2: Schedule Rules
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([{
    id: crypto.randomUUID(),
    frequency: 'weekly',
    pattern: { days: [1, 2, 3, 4, 5], time: '09:00' },
    offsetMinutes: 0,
    rrule: ''
  }]);

  // Step 3: Recipients & Delivery
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['operator']);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string>('');
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['email']);
  const [escalationEnabled, setEscalationEnabled] = useState(false);
  const [escalationHours, setEscalationHours] = useState(24);
  const [escalateTo, setEscalateTo] = useState<string>('supervisor');
  const [showRecipientPreview, setShowRecipientPreview] = useState(false);

  // Step 4: Message & Review
  const [messageTemplate, setMessageTemplate] = useState<string>(
    'Inspection due for {{equipment_name}} at {{workplace_name}} by {{due_time}}.'
  );
  const [isActive, setIsActive] = useState(true);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Load configurations
  useEffect(() => {
    if (isOpen && formId) {
      setScopeId(formId);
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

  const buildRRule = (rule: ScheduleRule): string => {
    const [hour, minute] = rule.pattern.time.split(':');
    let rrule = '';

    if (rule.frequency === 'daily') {
      rrule = `FREQ=DAILY;BYHOUR=${hour};BYMINUTE=${minute}`;
    } else if (rule.frequency === 'weekly' && rule.pattern.days) {
      const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
      const byDay = rule.pattern.days.map(d => days[d]).join(',');
      rrule = `FREQ=WEEKLY;BYDAY=${byDay};BYHOUR=${hour};BYMINUTE=${minute}`;
    } else if (rule.frequency === 'monthly' && rule.pattern.days) {
      const byMonthDay = rule.pattern.days.join(',');
      rrule = `FREQ=MONTHLY;BYMONTHDAY=${byMonthDay};BYHOUR=${hour};BYMINUTE=${minute}`;
    }

    return `RRULE:${rrule}`;
  };

  const addScheduleRule = () => {
    setScheduleRules([
      ...scheduleRules,
      {
        id: crypto.randomUUID(),
        frequency: 'weekly',
        pattern: { days: [1], time: '09:00' },
        offsetMinutes: 0,
        rrule: ''
      }
    ]);
  };

  const updateScheduleRule = (id: string, updates: Partial<ScheduleRule>) => {
    setScheduleRules(scheduleRules.map(rule => {
      if (rule.id === id) {
        const updated = { ...rule, ...updates };
        return { ...updated, rrule: buildRRule(updated) };
      }
      return rule;
    }));
  };

  const deleteScheduleRule = (id: string) => {
    if (scheduleRules.length > 1) {
      setScheduleRules(scheduleRules.filter(rule => rule.id !== id));
    }
  };

  const handleDayToggle = (ruleId: string, day: number) => {
    const rule = scheduleRules.find(r => r.id === ruleId);
    if (!rule) return;

    const currentDays = rule.pattern.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);

    updateScheduleRule(ruleId, {
      pattern: { ...rule.pattern, days: newDays }
    });
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleGroupToggle = (group: string) => {
    setSelectedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
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
    setScope('equipment');
    setScopeId(formId || '');
    setApplyToClass(false);
    setEvidenceType('inspection_completed');
    setScheduleRules([{
      id: crypto.randomUUID(),
      frequency: 'weekly',
      pattern: { days: [1, 2, 3, 4, 5], time: '09:00' },
      offsetMinutes: 0,
      rrule: ''
    }]);
    setSelectedRoles(['operator']);
    setSelectedGroups([]);
    setCustomEmails('');
    setDeliveryMethods(['email']);
    setEscalationEnabled(false);
    setMessageTemplate('Inspection due for {{equipment_name}} at {{workplace_name}} by {{due_time}}.');
    setIsActive(true);
    setEditingConfig(null);
  };

  const handleSaveConfiguration = async () => {
    if (selectedRoles.length === 0 && selectedGroups.length === 0 && !customEmails) {
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

    if (scheduleRules.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one schedule rule',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Build primary RRULE from first schedule rule for backward compatibility
      const primaryRRule = buildRRule(scheduleRules[0]);

      const configData = {
        form_id: scopeId,
        form_name: formName,
        form_type: formType,
        notification_type: notificationType,
        rrule: primaryRRule,
        recipients: selectedRoles as any,
        delivery_methods: deliveryMethods as any,
        is_active: isActive,
        created_by: 'Admin User', // TODO: Get from auth context
      };

      if (editingConfig?.id) {
        const { error } = await supabase
          .from('notification_configs')
          .update(configData)
          .eq('id', editingConfig.id);

        if (error) throw error;
        toast({ title: 'Notification policy updated successfully' });
      } else {
        const { error } = await supabase
          .from('notification_configs')
          .insert([configData]);

        if (error) throw error;
        toast({ title: 'Notification policy saved successfully' });
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

  const handleEditConfiguration = (config: any) => {
    setEditingConfig(config);
    setNotificationType(config.notification_type);
    setScopeId(config.form_id);
    setDeliveryMethods(config.delivery_methods);
    setSelectedRoles(config.recipients || []);
    setIsActive(config.is_active);
    setShowWizard(true);
    setWizardStep(4); // Go to review
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      pre_inspection: 'Pre-Inspection Reminder',
      due_reminder: 'Due Reminder',
      missed_reminder: 'Missed Reminder',
      event_based: 'Event-Based',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getEvidenceTypeLabel = (type: string) => {
    const labels = {
      inspection_started: 'Inspection Started',
      inspection_completed: 'Inspection Completed',
      document_uploaded: 'Document Uploaded',
      no_evidence: 'No Evidence Found (Overdue / Missed)',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[
        { num: 1, label: 'Type & Scope' },
        { num: 2, label: 'Schedule' },
        { num: 3, label: 'Recipients' },
        { num: 4, label: 'Review' }
      ].map((step, idx) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center gap-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all ${
              wizardStep >= step.num 
                ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                : 'border-muted-foreground/30 text-muted-foreground'
            }`}>
              {step.num}
            </div>
            <span className={`text-xs font-medium ${
              wizardStep >= step.num ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < 3 && (
            <div className={`flex-1 h-0.5 mx-4 mt-6 transition-all ${
              wizardStep > step.num ? 'bg-primary' : 'bg-muted'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Bell className="h-7 w-7 text-primary" />
            Notification Configuration
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {formName} • {formType === 'equipment' ? 'Equipment Form' : 'Workplace Form'}
          </DialogDescription>
        </DialogHeader>

        {!showWizard ? (
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Configured Policies</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage notification rules for this form</p>
              </div>
              <Button onClick={() => setShowWizard(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Policy
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : configs.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Bell className="h-20 w-20 text-muted-foreground/50 mb-4" />
                  <p className="text-xl font-semibold mb-2">No policies configured</p>
                  <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
                    Create your first notification policy to automatically remind users about inspections and compliance requirements
                  </p>
                  <Button onClick={() => setShowWizard(true)} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Your First Policy
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {configs.map((config) => (
                  <Card key={config.id} className="hover:shadow-lg transition-all border-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">
                              {getNotificationTypeLabel(config.notification_type)}
                            </CardTitle>
                            <Badge variant={config.is_active ? 'default' : 'secondary'} className="text-xs">
                              {config.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <CardDescription className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                            {config.rrule}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditConfiguration(config)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => config.id && handleDeleteConfiguration(config.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Recipients
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {(config.recipients || []).map((r) => (
                              <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Delivery Methods
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {config.delivery_methods.map((m) => (
                              <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {config.updated_at && (
                        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                          Last updated: {new Date(config.updated_at).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 py-4">
            {renderStepIndicator()}
            
            <TooltipProvider>
              <Tabs value={`step${wizardStep}`} className="w-full">
                {/* Step 1: Type & Scope */}
                <TabsContent value="step1" className="space-y-6 mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Select Notification Type & Scope</CardTitle>
                      <CardDescription>Configure what triggers this notification and what it applies to</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Notification Type</Label>
                        <Select value={notificationType} onValueChange={(v: any) => setNotificationType(v)}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre_inspection">Pre-Inspection Reminder</SelectItem>
                            <SelectItem value="due_reminder">Due Reminder</SelectItem>
                            <SelectItem value="missed_reminder">Missed Reminder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Scope</Label>
                        <RadioGroup value={scope} onValueChange={(v: any) => setScope(v)}>
                          <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                            <RadioGroupItem value="equipment" id="scope-equipment" />
                            <Label htmlFor="scope-equipment" className="flex-1 cursor-pointer font-medium">Equipment</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                            <RadioGroupItem value="equipment_class" id="scope-class" />
                            <Label htmlFor="scope-class" className="flex-1 cursor-pointer font-medium">Equipment Class</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                            <RadioGroupItem value="workplace" id="scope-workplace" />
                            <Label htmlFor="scope-workplace" className="flex-1 cursor-pointer font-medium">Workplace</Label>
                          </div>
                        </RadioGroup>

                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                          <Checkbox
                            id="apply-to-class"
                            checked={applyToClass}
                            onCheckedChange={(checked) => setApplyToClass(checked as boolean)}
                          />
                          <Label htmlFor="apply-to-class" className="cursor-pointer font-medium">
                            Apply to all items in same class or site
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Evidence Type</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">Evidence-driven: Notification triggers when no valid inspection or document is found in the defined compliance window.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Select value={evidenceType} onValueChange={setEvidenceType}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inspection_started">Inspection Started</SelectItem>
                            <SelectItem value="inspection_completed">Inspection Completed</SelectItem>
                            <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                            <SelectItem value="no_evidence">No Evidence Found (Overdue / Missed)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => { setShowWizard(false); resetWizard(); }}>
                      Cancel
                    </Button>
                    <Button onClick={() => setWizardStep(2)} size="lg">
                      Next: Schedule Rules
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Schedule Rules */}
                <TabsContent value="step2" className="space-y-6 mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">Configure Notification Schedule</CardTitle>
                          <CardDescription className="mt-2">Set up one or multiple schedule rules with pre-reminder offsets</CardDescription>
                        </div>
                        <Button onClick={addScheduleRule} variant="outline" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Rule
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {scheduleRules.map((rule, idx) => (
                        <Card key={rule.id} className="border">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Schedule Rule {idx + 1}</CardTitle>
                              {scheduleRules.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteScheduleRule(rule.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Frequency</Label>
                                <Select
                                  value={rule.frequency}
                                  onValueChange={(v: any) => updateScheduleRule(rule.id, { frequency: v })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Time</Label>
                                <Input
                                  type="time"
                                  value={rule.pattern.time}
                                  onChange={(e) => updateScheduleRule(rule.id, {
                                    pattern: { ...rule.pattern, time: e.target.value }
                                  })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Pre-reminder (minutes)</Label>
                                <Input
                                  type="number"
                                  value={rule.offsetMinutes}
                                  onChange={(e) => updateScheduleRule(rule.id, { offsetMinutes: parseInt(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            {rule.frequency === 'weekly' && (
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Days of Week</Label>
                                <div className="flex flex-wrap gap-2">
                                  {daysOfWeek.map((day, dayIdx) => (
                                    <Button
                                      key={dayIdx}
                                      type="button"
                                      variant={rule.pattern.days?.includes(dayIdx) ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => handleDayToggle(rule.id, dayIdx)}
                                      className="min-w-[4rem]"
                                    >
                                      {day}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {rule.frequency === 'monthly' && (
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold">Day of Month</Label>
                                <Input
                                  type="text"
                                  placeholder="e.g., 1,15,27 or -1 for last day"
                                  value={rule.pattern.days?.join(',') || ''}
                                  onChange={(e) => {
                                    const days = e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
                                    updateScheduleRule(rule.id, {
                                      pattern: { ...rule.pattern, days }
                                    });
                                  }}
                                />
                              </div>
                            )}

                            <Alert className="bg-muted/50">
                              <Calendar className="h-4 w-4" />
                              <AlertDescription>
                                <div className="space-y-1 text-xs">
                                  <p className="font-semibold">Computed RRULE:</p>
                                  <code className="text-xs">{buildRRule(rule)}</code>
                                </div>
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      ))}

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Note:</strong> You can add multiple schedules (e.g., 27th, last Thursday, 5 days before month-end).
                          All evaluations occur in the site timezone.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" onClick={() => setWizardStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setWizardStep(3)} size="lg">
                      Next: Recipients
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 3: Recipients & Delivery */}
                <TabsContent value="step3" className="space-y-6 mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Choose Recipients and Delivery Methods</CardTitle>
                      <CardDescription>Configure who receives notifications and how they're delivered</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">From Role Hierarchy</Label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {['operator', 'technician', 'site_admin', 'supervisor'].map((role) => (
                              <div key={role} className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                                <Checkbox
                                  id={`role-${role}`}
                                  checked={selectedRoles.includes(role)}
                                  onCheckedChange={() => handleRoleToggle(role)}
                                />
                                <Label htmlFor={`role-${role}`} className="flex-1 cursor-pointer font-medium capitalize">
                                  {role.replace('_', ' ')}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold">From Groups</Label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {['operators', 'maintenance_crew', 'safety_team', 'management'].map((group) => (
                              <div key={group} className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                                <Checkbox
                                  id={`group-${group}`}
                                  checked={selectedGroups.includes(group)}
                                  onCheckedChange={() => handleGroupToggle(group)}
                                />
                                <Label htmlFor={`group-${group}`} className="flex-1 cursor-pointer font-medium capitalize">
                                  {group.replace('_', ' ')}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold">Custom Email Addresses</Label>
                          <Textarea
                            placeholder="Enter email addresses separated by commas"
                            value={customEmails}
                            onChange={(e) => setCustomEmails(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          onClick={() => setShowRecipientPreview(!showRecipientPreview)}
                        >
                          <Eye className="h-4 w-4" />
                          {showRecipientPreview ? 'Hide' : 'Preview'} Recipients
                        </Button>

                        {showRecipientPreview && (
                          <Alert className="bg-muted">
                            <Users className="h-4 w-4" />
                            <AlertDescription>
                              <p className="text-sm font-semibold mb-2">Recipients Preview:</p>
                              <div className="space-y-1 text-xs">
                                {selectedRoles.length > 0 && <p>Roles: {selectedRoles.join(', ')}</p>}
                                {selectedGroups.length > 0 && <p>Groups: {selectedGroups.join(', ')}</p>}
                                {customEmails && <p>Custom: {customEmails}</p>}
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <Label className="text-base font-semibold">Delivery Channels</Label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {['email', 'sms'].map((method) => (
                            <div key={method} className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-accent/5 transition-colors">
                              <Checkbox
                                id={`delivery-${method}`}
                                checked={deliveryMethods.includes(method)}
                                onCheckedChange={() => handleDeliveryMethodToggle(method)}
                              />
                              <Label htmlFor={`delivery-${method}`} className="flex-1 cursor-pointer font-medium capitalize">
                                {method === 'email' ? (
                                  <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email Notification
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" /> SMS Notification
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <Label className="text-base font-semibold">Optional Escalation Rule</Label>
                        <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                          <Switch
                            id="escalation-enabled"
                            checked={escalationEnabled}
                            onCheckedChange={setEscalationEnabled}
                          />
                          <Label htmlFor="escalation-enabled" className="cursor-pointer font-medium">
                            Escalate if not acknowledged
                          </Label>
                        </div>

                        {escalationEnabled && (
                          <div className="grid md:grid-cols-2 gap-4 ml-4 p-4 border-l-4 border-primary/30 bg-muted/50 rounded-r-lg">
                            <div className="space-y-2">
                              <Label className="text-sm">Hours to wait</Label>
                              <Input
                                type="number"
                                value={escalationHours}
                                onChange={(e) => setEscalationHours(parseInt(e.target.value) || 24)}
                                min="1"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Escalate to</Label>
                              <Select value={escalateTo} onValueChange={setEscalateTo}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="supervisor">Supervisor</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="site_admin">Site Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" onClick={() => setWizardStep(2)}>
                      Back
                    </Button>
                    <Button onClick={() => setWizardStep(4)} size="lg">
                      Next: Review & Save
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 4: Message Template & Review */}
                <TabsContent value="step4" className="space-y-6 mt-0">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Message Template</CardTitle>
                      <CardDescription>Customize the notification message with dynamic placeholders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Message Template</Label>
                        <Textarea
                          value={messageTemplate}
                          onChange={(e) => setMessageTemplate(e.target.value)}
                          rows={4}
                          placeholder="Enter your message template here..."
                        />
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <strong>Available placeholders:</strong> {'{{equipment_name}}, {{workplace_name}}, {{due_date}}, {{due_time}}, {{site_name}}, {{inspector_name}}'}
                          </AlertDescription>
                        </Alert>
                      </div>

                      <Button variant="outline" className="w-full gap-2">
                        <Send className="h-4 w-4" />
                        Send Test Notification
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Review Summary
                      </CardTitle>
                      <CardDescription>Verify all settings before saving</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Notification Type</Label>
                            <p className="text-sm font-semibold">{getNotificationTypeLabel(notificationType)}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Scope</Label>
                            <p className="text-sm font-semibold capitalize">{scope.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Evidence Type</Label>
                            <p className="text-sm font-semibold">{getEvidenceTypeLabel(evidenceType)}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Schedule Rules</Label>
                            {scheduleRules.map((rule, idx) => (
                              <div key={rule.id} className="text-xs mt-1 p-2 bg-muted rounded">
                                <p className="font-semibold">Rule {idx + 1}:</p>
                                <code className="text-[10px] break-all">{buildRRule(rule)}</code>
                                {rule.offsetMinutes !== 0 && (
                                  <p className="text-[10px] mt-1">Offset: {rule.offsetMinutes} minutes</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Recipients</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedRoles.map(r => (
                                <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                              ))}
                              {selectedGroups.map(g => (
                                <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Delivery Channels</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {deliveryMethods.map(m => (
                                <Badge key={m} className="text-xs">{m}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                          <div>
                            <Label className="text-sm font-semibold">Active Status</Label>
                            <p className="text-xs text-muted-foreground">Enable this policy immediately</p>
                          </div>
                          <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                          />
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <strong>Timezone Note:</strong> All evaluations occur in the site timezone
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" onClick={() => setWizardStep(3)}>
                      Back
                    </Button>
                    <Button onClick={handleSaveConfiguration} size="lg" className="gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      {editingConfig ? 'Update' : 'Save'} Policy
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </TooltipProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};