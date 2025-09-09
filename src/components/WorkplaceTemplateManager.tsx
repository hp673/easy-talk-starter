import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Search, Edit, Trash2, Copy, Eye, 
  FileText, GripVertical, X, MapPin, Users, Clock, AlertTriangle
} from 'lucide-react';

interface WorkplaceArea {
  id: string;
  name: string;
  description?: string;
  subAreas: WorkplaceSubArea[];
}

interface WorkplaceSubArea {
  id: string;
  name: string;
  description?: string;
  canToggle: boolean; // OK / CAN / N/A toggle
  notesRequired: boolean;
  photoRequired: boolean;
}

interface WorkplaceTemplate {
  id: string;
  name: string;
  type: 'workplace';
  areas: WorkplaceArea[];
  primaryInspector: string;
  backupInspector: string;
  notificationDeadline: string; // Default 9:00 AM
  helpText?: string; // Shown once per day
  canResolutionRules: {
    requireNotification: boolean;
    requireSignoff: boolean;
  };
  lastUpdated: string;
  createdBy: string;
  isPublished: boolean;
}

const mockInspectors = [
  { id: '1', name: 'John Smith', role: 'Senior Inspector' },
  { id: '2', name: 'Sarah Johnson', role: 'Inspector' },
  { id: '3', name: 'Mike Wilson', role: 'Site Supervisor' },
  { id: '4', name: 'Emma Davis', role: 'Safety Officer' }
];

const mockWorkplaceTemplates: WorkplaceTemplate[] = [
  {
    id: '1',
    name: 'Daily Site Workplace Exam - Quarry A',
    type: 'workplace',
    areas: [
      {
        id: 'quarry',
        name: 'Quarry/Highwalls/Berms',
        description: 'The current mining area',
        subAreas: [
          { id: 'highwalls', name: 'Highwalls around quarry and/or mining area', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'berms', name: 'All berms around crusher hopper, stockpiles and ramps', description: '', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      },
      {
        id: 'crusher',
        name: 'Crusher/Screener/Conveyors',
        description: 'Crusher and screener include immediate area',
        subAreas: [
          { id: 'crusher-area', name: 'Crusher immediate area', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'conveyor-systems', name: 'All conveyor systems and walkways', description: '', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      }
    ],
    primaryInspector: '1',
    backupInspector: '2',
    notificationDeadline: '09:00',
    helpText: 'Working places must be examined at least once each shift, before work begins or as miners begin work in that place. Record ALL conditions found on entire shift.',
    canResolutionRules: {
      requireNotification: true,
      requireSignoff: true
    },
    lastUpdated: '2024-01-22',
    createdBy: 'Admin User',
    isPublished: true
  }
];

const WorkplaceTemplateManager = () => {
  const [templates, setTemplates] = useState<WorkplaceTemplate[]>(mockWorkplaceTemplates);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkplaceTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formBuilder, setFormBuilder] = useState<Partial<WorkplaceTemplate>>({
    name: '',
    type: 'workplace',
    areas: [],
    primaryInspector: '',
    backupInspector: '',
    notificationDeadline: '09:00',
    helpText: '',
    canResolutionRules: {
      requireNotification: true,
      requireSignoff: true
    },
    isPublished: false
  });
  const { toast } = useToast();

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addArea = () => {
    const newArea: WorkplaceArea = {
      id: Date.now().toString(),
      name: 'New Area',
      description: '',
      subAreas: []
    };
    setFormBuilder(prev => ({
      ...prev,
      areas: [...(prev.areas || []), newArea]
    }));
  };

  const updateArea = (areaId: string, updates: Partial<WorkplaceArea>) => {
    setFormBuilder(prev => ({
      ...prev,
      areas: prev.areas?.map(area =>
        area.id === areaId ? { ...area, ...updates } : area
      ) || []
    }));
  };

  const deleteArea = (areaId: string) => {
    setFormBuilder(prev => ({
      ...prev,
      areas: prev.areas?.filter(area => area.id !== areaId) || []
    }));
  };

  const addSubArea = (areaId: string) => {
    const newSubArea: WorkplaceSubArea = {
      id: Date.now().toString(),
      name: 'New Sub-Area',
      description: '',
      canToggle: true,
      notesRequired: false,
      photoRequired: false
    };
    
    setFormBuilder(prev => ({
      ...prev,
      areas: prev.areas?.map(area =>
        area.id === areaId 
          ? { ...area, subAreas: [...area.subAreas, newSubArea] }
          : area
      ) || []
    }));
  };

  const updateSubArea = (areaId: string, subAreaId: string, updates: Partial<WorkplaceSubArea>) => {
    setFormBuilder(prev => ({
      ...prev,
      areas: prev.areas?.map(area =>
        area.id === areaId
          ? {
              ...area,
              subAreas: area.subAreas.map(subArea =>
                subArea.id === subAreaId ? { ...subArea, ...updates } : subArea
              )
            }
          : area
      ) || []
    }));
  };

  const deleteSubArea = (areaId: string, subAreaId: string) => {
    setFormBuilder(prev => ({
      ...prev,
      areas: prev.areas?.map(area =>
        area.id === areaId
          ? { ...area, subAreas: area.subAreas.filter(subArea => subArea.id !== subAreaId) }
          : area
      ) || []
    }));
  };

  const saveTemplate = () => {
    if (!formBuilder.name || !formBuilder.primaryInspector) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name and Primary Inspector)",
        variant: "destructive"
      });
      return;
    }

    const templateData: WorkplaceTemplate = {
      id: isEditing ? selectedTemplate!.id : Date.now().toString(),
      name: formBuilder.name!,
      type: 'workplace',
      areas: formBuilder.areas || [],
      primaryInspector: formBuilder.primaryInspector!,
      backupInspector: formBuilder.backupInspector || '',
      notificationDeadline: formBuilder.notificationDeadline || '09:00',
      helpText: formBuilder.helpText || '',
      canResolutionRules: formBuilder.canResolutionRules!,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User',
      isPublished: formBuilder.isPublished || false
    };

    if (isEditing) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate!.id ? templateData : t));
      toast({
        title: "Workplace Template Updated",
        description: "Workplace examination template has been successfully updated"
      });
    } else {
      setTemplates(prev => [...prev, templateData]);
      toast({
        title: "Workplace Template Created",
        description: "New workplace examination template has been successfully created"
      });
    }

    // Reset form
    setFormBuilder({
      name: '',
      type: 'workplace',
      areas: [],
      primaryInspector: '',
      backupInspector: '',
      notificationDeadline: '09:00',
      helpText: '',
      canResolutionRules: {
        requireNotification: true,
        requireSignoff: true
      },
      isPublished: false
    });
    setShowCreateForm(false);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const editTemplate = (template: WorkplaceTemplate) => {
    setSelectedTemplate(template);
    setFormBuilder(template);
    setIsEditing(true);
    setShowCreateForm(true);
  };

  const duplicateTemplate = (template: WorkplaceTemplate) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isPublished: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, duplicated]);
    toast({
      title: "Workplace Template Duplicated",
      description: "Template has been successfully duplicated"
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Workplace Template Deleted",
      description: "Template has been successfully deleted"
    });
  };

  const getInspectorName = (inspectorId: string) => {
    return mockInspectors.find(i => i.id === inspectorId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Workplace Examination Templates
          </h2>
          <p className="text-sm text-muted-foreground">Manage site workplace examination forms</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => {
            setFormBuilder({
              name: '',
              type: 'workplace',
              areas: [],
              primaryInspector: '',
              backupInspector: '',
              notificationDeadline: '09:00',
              helpText: '',
              canResolutionRules: {
                requireNotification: true,
                requireSignoff: true
              },
              isPublished: false
            });
            setIsEditing(false);
            setShowCreateForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workplace Template
          </Button>
        )}
        {showCreateForm && (
          <Button 
            variant="outline" 
            onClick={() => {
              setShowCreateForm(false);
              setIsEditing(false);
              setSelectedTemplate(null);
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {!showCreateForm && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workplace templates..."
              className="pl-10"
            />
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {template.name}
                          {template.isPublished ? (
                            <Badge className="bg-success text-success-foreground">Published</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {template.areas.length} areas • Primary: {getInspectorName(template.primaryInspector)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getInspectorName(template.primaryInspector)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.notificationDeadline}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Updated: {template.lastUpdated}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => editTemplate(template)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Preview: {template.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {template.areas.map(area => (
                              <div key={area.id}>
                                <h4 className="font-medium mb-2">{area.name}</h4>
                                <div className="space-y-2 pl-4">
                                  {area.subAreas.map(subArea => (
                                    <div key={subArea.id} className="flex items-center gap-2">
                                      <span className="text-sm">{subArea.name}</span>
                                      {subArea.canToggle && <Badge variant="outline" className="text-xs">CAN Toggle</Badge>}
                                      {subArea.notesRequired && <Badge variant="outline" className="text-xs">Notes Required</Badge>}
                                      {subArea.photoRequired && <Badge variant="outline" className="text-xs">Photo Required</Badge>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No workplace templates found</h4>
                  <p className="text-muted-foreground">
                    Create your first workplace examination template to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Edit Workplace Template' : 'Create New Workplace Template'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formBuilder.name || ''}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Daily Site Workplace Exam - Quarry A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Notification Deadline</Label>
                  <Input
                    id="deadline"
                    type="time"
                    value={formBuilder.notificationDeadline || '09:00'}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, notificationDeadline: e.target.value }))}
                  />
                </div>
              </div>

              {/* Inspector Assignment */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Inspector Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary">Primary Inspector *</Label>
                      <Select
                        value={formBuilder.primaryInspector || ''}
                        onValueChange={(value) => setFormBuilder(prev => ({ ...prev, primaryInspector: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary inspector" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInspectors.map(inspector => (
                            <SelectItem key={inspector.id} value={inspector.id}>
                              {inspector.name} - {inspector.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup">Backup Inspector</Label>
                      <Select
                        value={formBuilder.backupInspector || ''}
                        onValueChange={(value) => setFormBuilder(prev => ({ ...prev, backupInspector: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup inspector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {mockInspectors.map(inspector => (
                            <SelectItem key={inspector.id} value={inspector.id}>
                              {inspector.name} - {inspector.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Text */}
              <div className="space-y-2">
                <Label htmlFor="helpText">Help/Description Text (shown once per day)</Label>
                <Textarea
                  id="helpText"
                  value={formBuilder.helpText || ''}
                  onChange={(e) => setFormBuilder(prev => ({ ...prev, helpText: e.target.value }))}
                  placeholder="Enter instructions or guidance that will be shown to operators..."
                  rows={3}
                />
              </div>

              {/* CAN Resolution Rules */}
              <Card className="bg-orange-50 dark:bg-orange-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Corrective Action Needed (CAN) Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Require Site Leaders Notification</Label>
                      <p className="text-sm text-muted-foreground">Operators must confirm they notified site leaders</p>
                    </div>
                    <Switch
                      checked={formBuilder.canResolutionRules?.requireNotification || false}
                      onCheckedChange={(checked) => setFormBuilder(prev => ({
                        ...prev,
                        canResolutionRules: {
                          ...prev.canResolutionRules!,
                          requireNotification: checked
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Require Resolution Sign-off</Label>
                      <p className="text-sm text-muted-foreground">Require supervisor sign-off when resolving CAN items</p>
                    </div>
                    <Switch
                      checked={formBuilder.canResolutionRules?.requireSignoff || false}
                      onCheckedChange={(checked) => setFormBuilder(prev => ({
                        ...prev,
                        canResolutionRules: {
                          ...prev.canResolutionRules!,
                          requireSignoff: checked
                        }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Areas & Sub-Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Workplace Areas & Sub-Areas</span>
                    <Button size="sm" onClick={addArea}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Area
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formBuilder.areas && formBuilder.areas.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-2">
                      {formBuilder.areas.map((area, areaIndex) => (
                        <AccordionItem key={area.id} value={`area-${area.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-left">
                                <div className="font-medium">{area.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {area.subAreas.length} sub-areas
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4">
                              {/* Area Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Area Name</Label>
                                  <Input
                                    value={area.name}
                                    onChange={(e) => updateArea(area.id, { name: e.target.value })}
                                    placeholder="Enter area name"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => deleteArea(area.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Area
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Area Description</Label>
                                <Input
                                  value={area.description || ''}
                                  onChange={(e) => updateArea(area.id, { description: e.target.value })}
                                  placeholder="Enter area description (optional)"
                                />
                              </div>

                              {/* Sub-Areas */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-base">Sub-Areas</Label>
                                  <Button size="sm" variant="outline" onClick={() => addSubArea(area.id)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Sub-Area
                                  </Button>
                                </div>
                                
                                {area.subAreas.map((subArea) => (
                                  <Card key={subArea.id} className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                        <Input
                                          value={subArea.name}
                                          onChange={(e) => updateSubArea(area.id, subArea.id, { name: e.target.value })}
                                          placeholder="Sub-area name"
                                          className="flex-1"
                                        />
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => deleteSubArea(area.id, subArea.id)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      
                                      <Input
                                        value={subArea.description || ''}
                                        onChange={(e) => updateSubArea(area.id, subArea.id, { description: e.target.value })}
                                        placeholder="Sub-area description (optional)"
                                      />
                                      
                                      <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={subArea.canToggle}
                                            onCheckedChange={(checked) => updateSubArea(area.id, subArea.id, { canToggle: checked })}
                                          />
                                          <Label className="text-sm">OK/CAN/N/A Toggle</Label>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={subArea.notesRequired}
                                            onCheckedChange={(checked) => updateSubArea(area.id, subArea.id, { notesRequired: checked })}
                                          />
                                          <Label className="text-sm">Notes Required</Label>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            checked={subArea.photoRequired}
                                            onCheckedChange={(checked) => updateSubArea(area.id, subArea.id, { photoRequired: checked })}
                                          />
                                          <Label className="text-sm">Photo Required</Label>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No areas defined yet. Click "Add Area" to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Publish Template</Label>
                  <p className="text-sm text-muted-foreground">Make this template available to operators</p>
                </div>
                <Switch
                  checked={formBuilder.isPublished || false}
                  onCheckedChange={(checked) => setFormBuilder(prev => ({ ...prev, isPublished: checked }))}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button onClick={saveTemplate} className="flex-1">
                  {isEditing ? 'Update Template' : 'Create Template'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setIsEditing(false);
                    setSelectedTemplate(null);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {formBuilder.areas && formBuilder.areas.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Add at least one area with sub-areas to create a functional workplace examination template.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkplaceTemplateManager;