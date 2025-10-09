import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Info, Plus, X, Clock, Mail, MessageSquare } from 'lucide-react';

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

interface GeneralNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export const GeneralNotificationModal: React.FC<GeneralNotificationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState<'all' | 'specific'>('all');
  const [message, setMessage] = useState('');
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [channels, setChannels] = useState<string[]>(['email']);
  
  const { toast } = useToast();
  
  const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const handleRecipientToggle = (role: string) => {
    setRecipients(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleChannelToggle = (channel: string) => {
    setChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      setCustomEmails([...customEmails, emailInput]);
      setEmailInput('');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a notification name',
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

    if (recipients.length === 0 && customEmails.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one recipient',
        variant: 'destructive',
      });
      return;
    }

    const config = {
      name,
      scope,
      message,
      scheduleRules,
      recipients,
      customEmails,
      channels,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onSave(config);
    toast({ title: 'General notification created successfully' });
    onClose();
  };

  const getNextRun = (rrule: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create General Notification</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name & Scope */}
          <div className="space-y-4">
            <div>
              <Label className="text-base">Notification Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Monthly Safety Reminder"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base">Scope</Label>
              <Select value={scope} onValueChange={(v: any) => setScope(v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="specific">Specific Sites</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base">Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Enter your notification message..."
                className="mt-2"
              />
            </div>
          </div>

          {/* Schedule Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Schedule Rules</Label>
                <p className="text-sm text-muted-foreground">Define when this notification should be sent</p>
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
                  Click "Add Rule" to create your first schedule
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

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Hour</Label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={rule.hour}
                          onChange={(e) => updateScheduleRule(rule.id, { hour: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Minute</Label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={rule.minute}
                          onChange={(e) => updateScheduleRule(rule.id, { minute: e.target.value })}
                        />
                      </div>
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
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <div>
              <Label className="text-base">Recipients</Label>
              <div className="space-y-2 mt-2">
                {['operator', 'technician', 'site_admin', 'supervisor'].map((role) => (
                  <div key={role} className="flex items-center gap-2">
                    <Checkbox
                      checked={recipients.includes(role)}
                      onCheckedChange={() => handleRecipientToggle(role)}
                    />
                    <Label className="capitalize cursor-pointer">{role.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Custom Email Addresses</Label>
              <div className="space-y-2 mt-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddEmail} variant="outline" size="icon">
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
              <Label>Delivery Channels</Label>
              <div className="space-y-2 mt-2">
                {[
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'sms', label: 'SMS', icon: MessageSquare },
                ].map((channel) => {
                  const IconComponent = channel.icon;
                  return (
                    <div key={channel.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={channels.includes(channel.value)}
                        onCheckedChange={() => handleChannelToggle(channel.value)}
                      />
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <Label className="cursor-pointer">{channel.label}</Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-mining">
              Create Notification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};