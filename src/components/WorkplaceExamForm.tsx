import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, Camera, Save, Clock, AlertTriangle, CheckCircle, 
  XCircle, Minus, Upload, Info, Lock, Edit3, FileText
} from 'lucide-react';

interface WorkplaceExamData {
  id: string;
  templateId: string;
  templateName: string;
  date: string;
  location: string;
  inspector: string;
  status: 'in-progress' | 'completed' | 'locked';
  areas: {
    [areaId: string]: {
      [subAreaId: string]: {
        status: 'ok' | 'can' | 'na';
        notes?: string;
        photos?: string[];
        canNotified?: boolean;
        canMethod?: string;
        canTime?: string;
        canResolved?: boolean;
        resolvedBy?: string;
        resolvedDate?: string;
        resolvedNotes?: string;
      };
    };
  };
  additionalNotes?: string;
  lastSaved: string;
  unsynced: boolean;
}

interface WorkplaceTemplate {
  id: string;
  name: string;
  areas: Array<{
    id: string;
    name: string;
    description?: string;
    subAreas: Array<{
      id: string;
      name: string;
      description?: string;
      canToggle: boolean;
      notesRequired: boolean;
      photoRequired: boolean;
    }>;
  }>;
  helpText?: string;
  canResolutionRules: {
    requireNotification: boolean;
    requireSignoff: boolean;
  };
}

interface WorkplaceExamFormProps {
  template: WorkplaceTemplate;
  examData?: WorkplaceExamData;
  isReadOnly?: boolean;
  onSave: (data: WorkplaceExamData) => void;
  onSubmit: (data: WorkplaceExamData) => void;
}

const WorkplaceExamForm: React.FC<WorkplaceExamFormProps> = ({
  template,
  examData,
  isReadOnly = false,
  onSave,
  onSubmit
}) => {
  const [formData, setFormData] = useState<WorkplaceExamData>(() => ({
    id: examData?.id || Date.now().toString(),
    templateId: template.id,
    templateName: template.name,
    date: examData?.date || new Date().toISOString().split('T')[0],
    location: examData?.location || '',
    inspector: examData?.inspector || 'Current User',
    status: examData?.status || 'in-progress',
    areas: examData?.areas || {},
    additionalNotes: examData?.additionalNotes || '',
    lastSaved: examData?.lastSaved || new Date().toISOString(),
    unsynced: examData?.unsynced || false
  }));

  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isReadOnly && formData.status === 'in-progress') {
      const interval = setInterval(() => {
        handleAutoSave();
      }, 30000);
      setAutoSaveInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [formData, isReadOnly]);

  // Check if form should be locked (after midnight)
  useEffect(() => {
    const now = new Date();
    const formDate = new Date(formData.date);
    const isNextDay = now.toDateString() !== formDate.toDateString() && now > formDate;
    
    if (isNextDay && formData.status !== 'locked') {
      setFormData(prev => ({ ...prev, status: 'locked' }));
    }
  }, [formData.date, formData.status]);

  const handleAutoSave = () => {
    const updatedData = {
      ...formData,
      lastSaved: new Date().toISOString(),
      unsynced: true
    };
    setFormData(updatedData);
    onSave(updatedData);
  };

  const updateSubAreaStatus = (areaId: string, subAreaId: string, status: 'ok' | 'can' | 'na') => {
    setFormData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [areaId]: {
          ...prev.areas[areaId],
          [subAreaId]: {
            ...prev.areas[areaId]?.[subAreaId],
            status,
            // Reset CAN-related fields if changing from CAN
            ...(status !== 'can' && {
              canNotified: undefined,
              canMethod: undefined,
              canTime: undefined
            })
          }
        }
      }
    }));
  };

  const updateSubAreaField = (areaId: string, subAreaId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [areaId]: {
          ...prev.areas[areaId],
          [subAreaId]: {
            ...prev.areas[areaId]?.[subAreaId],
            [field]: value
          }
        }
      }
    }));
  };

  const getSubAreaData = (areaId: string, subAreaId: string) => {
    return formData.areas[areaId]?.[subAreaId] || { status: 'ok' };
  };

  const getStatusIcon = (status: 'ok' | 'can' | 'na') => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'can': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'na': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusColor = (status: 'ok' | 'can' | 'na') => {
    switch (status) {
      case 'ok': return 'border-success bg-success/10';
      case 'can': return 'border-destructive bg-destructive/10';
      case 'na': return 'border-muted bg-muted/30';
      default: return 'border-border';
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      lastSaved: new Date().toISOString(),
      unsynced: true
    };
    setFormData(updatedData);
    onSave(updatedData);
    toast({
      title: "Form Saved",
      description: "Workplace examination has been saved locally"
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    const hasCANItems = template.areas.some(area => 
      area.subAreas.some(subArea => {
        const data = getSubAreaData(area.id, subArea.id);
        return data.status === 'can';
      })
    );

    if (hasCANItems && template.canResolutionRules.requireNotification) {
      const allCANNotified = template.areas.every(area => 
        area.subAreas.every(subArea => {
          const data = getSubAreaData(area.id, subArea.id);
          return data.status !== 'can' || data.canNotified;
        })
      );

      if (!allCANNotified) {
        toast({
          title: "Validation Error",
          description: "All CAN items must have site leader notification confirmed",
          variant: "destructive"
        });
        return;
      }
    }

    const completedData = {
      ...formData,
      status: 'completed' as const,
      lastSaved: new Date().toISOString()
    };
    
    setFormData(completedData);
    onSubmit(completedData);
    
    toast({
      title: "Examination Submitted",
      description: "Workplace examination has been completed and submitted"
    });
  };

  const isFormReadOnly = isReadOnly || formData.status === 'locked' || formData.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {template.name}
                {formData.status === 'locked' && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{formData.date}</Badge>
                <Badge variant={formData.status === 'completed' ? 'default' : 'secondary'}>
                  {formData.status === 'in-progress' ? 'In Progress' : 
                   formData.status === 'completed' ? 'Completed' : 'Locked'}
                </Badge>
                {formData.unsynced && (
                  <Badge variant="outline" className="text-warning">
                    <Clock className="h-3 w-3 mr-1" />
                    Unsynced
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {template.helpText && (
                <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Examination Instructions</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm">
                      <p>{template.helpText}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="text-sm text-muted-foreground">
                Last saved: {new Date(formData.lastSaved).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-mining bg-muted cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                readOnly={isFormReadOnly}
                className={isFormReadOnly ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspector">Inspector</Label>
              <Input
                id="inspector"
                value={formData.inspector}
                className="input-mining bg-muted cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Areas */}
      {template.areas.map((area) => (
        <Card key={area.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {area.name}
            </CardTitle>
            {area.description && (
              <p className="text-sm text-muted-foreground">{area.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {area.subAreas.map((subArea) => {
              const subAreaData = getSubAreaData(area.id, subArea.id);
              
              return (
                <Card key={subArea.id} className={`p-4 ${getStatusColor(subAreaData.status)}`}>
                  <div className="space-y-4">
                    {/* Sub-area header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {getStatusIcon(subAreaData.status)}
                          {subArea.name}
                        </h4>
                        {subArea.description && (
                          <p className="text-sm text-muted-foreground mt-1">{subArea.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Status buttons */}
                    {subArea.canToggle && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={subAreaData.status === 'ok' ? 'default' : 'outline'}
                          onClick={() => updateSubAreaStatus(area.id, subArea.id, 'ok')}
                          disabled={isFormReadOnly}
                          className={subAreaData.status === 'ok' ? 'bg-success hover:bg-success/90' : ''}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          OK
                        </Button>
                        <Button
                          size="sm"
                          variant={subAreaData.status === 'can' ? 'destructive' : 'outline'}
                          onClick={() => updateSubAreaStatus(area.id, subArea.id, 'can')}
                          disabled={isFormReadOnly}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          CAN
                        </Button>
                        <Button
                          size="sm"
                          variant={subAreaData.status === 'na' ? 'secondary' : 'outline'}
                          onClick={() => updateSubAreaStatus(area.id, subArea.id, 'na')}
                          disabled={isFormReadOnly}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          N/A
                        </Button>
                      </div>
                    )}

                    {/* CAN Notification Requirements */}
                    {subAreaData.status === 'can' && template.canResolutionRules.requireNotification && (
                      <Alert className="border-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-3">
                            <p className="font-medium">Corrective Action Needed - Site Leaders must be notified</p>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={subAreaData.canNotified || false}
                                onCheckedChange={(checked) => updateSubAreaField(area.id, subArea.id, 'canNotified', checked)}
                                disabled={isFormReadOnly}
                              />
                              <Label className="text-sm">Site Leaders have been notified</Label>
                            </div>
                            
                            {subAreaData.canNotified && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label className="text-xs">Notification Method</Label>
                                  <Select
                                    value={subAreaData.canMethod || ''}
                                    onValueChange={(value) => updateSubAreaField(area.id, subArea.id, 'canMethod', value)}
                                    disabled={isFormReadOnly}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="radio">Radio</SelectItem>
                                      <SelectItem value="phone">Phone</SelectItem>
                                      <SelectItem value="in-person">In Person</SelectItem>
                                      <SelectItem value="email">Email</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Time Notified</Label>
                                  <Input
                                    type="time"
                                    value={subAreaData.canTime || ''}
                                    onChange={(e) => updateSubAreaField(area.id, subArea.id, 'canTime', e.target.value)}
                                    className="h-8"
                                    disabled={isFormReadOnly}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label className="text-sm">Notes {subArea.notesRequired && <span className="text-destructive">*</span>}</Label>
                      <Textarea
                        value={subAreaData.notes || ''}
                        onChange={(e) => updateSubAreaField(area.id, subArea.id, 'notes', e.target.value)}
                        placeholder="Add notes..."
                        rows={2}
                        readOnly={isFormReadOnly}
                        className={isFormReadOnly ? "bg-muted cursor-not-allowed" : ""}
                      />
                    </div>

                    {/* Photo Upload */}
                    {subArea.photoRequired && (
                      <div className="space-y-2">
                        <Label className="text-sm">Photos {subArea.photoRequired && <span className="text-destructive">*</span>}</Label>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" disabled={isFormReadOnly}>
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <Button size="sm" variant="outline" disabled={isFormReadOnly}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          {subAreaData.photos && subAreaData.photos.length > 0 && (
                            <Badge variant="outline">{subAreaData.photos.length} photos</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Resolution Section for CAN items */}
                    {subAreaData.status === 'can' && subAreaData.canResolved && (
                      <Card className="bg-success/10 border-success">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="font-medium text-success">Resolved</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <Label className="text-xs">Resolved By</Label>
                                <p>{subAreaData.resolvedBy}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Resolved Date</Label>
                                <p>{subAreaData.resolvedDate}</p>
                              </div>
                            </div>
                            {subAreaData.resolvedNotes && (
                              <div>
                                <Label className="text-xs">Resolution Notes</Label>
                                <p className="text-sm">{subAreaData.resolvedNotes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Additional Site-wide Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additionalNotes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="Add any additional notes about the overall site condition..."
            rows={4}
            readOnly={isFormReadOnly}
            className={isFormReadOnly ? "bg-muted cursor-not-allowed" : ""}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isFormReadOnly && (
        <div className="flex gap-4">
          <Button onClick={handleSave} variant="outline" className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Examination
          </Button>
        </div>
      )}

      {/* Read-only indicators */}
      {isFormReadOnly && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {formData.status === 'locked' && "This examination is locked as the date has passed."}
            {formData.status === 'completed' && "This examination has been completed and submitted."}
            {isReadOnly && formData.status === 'in-progress' && "You are viewing this examination in read-only mode."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WorkplaceExamForm;