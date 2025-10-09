import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, X, Send } from 'lucide-react';

interface EventConfig {
  id: string;
  eventType: string;
  name: string;
  description: string;
  isActive: boolean;
  template: string;
  recipients: string[];
  customEmails: string[];
  channels: string[];
}

interface EventNotificationConfigProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: EventConfig) => void;
}

export const EventNotificationConfig: React.FC<EventNotificationConfigProps> = ({
  event,
  isOpen,
  onClose,
  onSave
}) => {
  const [isActive, setIsActive] = useState(event?.isActive || true);
  const [template, setTemplate] = useState(event?.template || `{{event_type}} notification: {{details}}`);
  const [recipients, setRecipients] = useState<string[]>(event?.recipients || []);
  const [channels, setChannels] = useState<string[]>(event?.channels || ['email']);
  const [customEmails, setCustomEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  
  const { toast } = useToast();

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
    if (recipients.length === 0 && customEmails.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one recipient',
        variant: 'destructive',
      });
      return;
    }

    if (channels.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one delivery channel',
        variant: 'destructive',
      });
      return;
    }

    const config: EventConfig = {
      id: event?.id,
      eventType: event?.eventType,
      name: event?.name,
      description: event?.description,
      isActive,
      template,
      recipients,
      customEmails,
      channels,
    };

    onSave(config);
    toast({ title: 'Event notification configured successfully' });
    onClose();
  };

  const handleSendTest = () => {
    toast({
      title: 'Test Notification Sent',
      description: `Sending test ${channels.join(', ')} to selected recipients`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Configure Event: {event?.name}</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="event-active" className="text-sm">Active</Label>
              <Switch
                id="event-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardDescription>{event?.description}</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <div>
              <Label className="text-base">Message Template</Label>
              <Textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={4}
                placeholder="Enter notification message template..."
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Available placeholders: {'{{event_type}}'}, {'{{details}}'}, {'{{timestamp}}'}, {'{{user_name}}'}
              </p>
            </div>

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
              <Label className="text-base">Custom Email Addresses</Label>
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
                    <X className="h-4 w-4 rotate-45" />
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

          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleSendTest}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-mining">
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};