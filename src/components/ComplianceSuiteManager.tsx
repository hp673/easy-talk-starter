import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { NotificationConfigModal } from '@/components/NotificationConfigModal';
import { 
  Plus, Search, Edit, Trash2, Copy, Eye, FileText, GripVertical, X, 
  MapPin, Users, Clock, AlertTriangle, Bell, CheckCircle2, FileCheck, 
  ArrowRight, Settings, Sparkles
} from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================
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
  canToggle: boolean;
  notesRequired: boolean;
  photoRequired: boolean;
}

interface SuperuserTemplate {
  id: string;
  name: string;
  version: string;
  description: string;
  type: 'MSHA' | 'TCEQ' | 'Construction';
  areas: WorkplaceArea[];
  lastUpdated: string;
  isPublished: boolean;
}

interface DerivedTemplate {
  id: string;
  name: string;
  derivedFrom: {
    templateId: string;
    templateName: string;
    version: string;
  };
  type: 'MSHA' | 'TCEQ' | 'Construction';
  areas: WorkplaceArea[];
  siteAssignment: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  primaryInspector: string;
  backupInspector: string;
  notificationDeadline: string;
  helpText?: string;
  canResolutionRules: {
    requireNotification: boolean;
    requireSignoff: boolean;
  };
  status: 'draft' | 'published';
  lastUpdated: string;
  createdBy: string;
  hasNewVersion?: boolean;
  newVersionAvailable?: string;
}

// ==================== MOCK DATA ====================
const mockSuperuserTemplates: SuperuserTemplate[] = [
  {
    id: 'super-1',
    name: 'MSHA - Workplace Examination',
    version: 'v1.0',
    description: 'Standard MSHA workplace examination template for daily site inspections',
    type: 'MSHA',
    isPublished: true,
    lastUpdated: '2024-01-15',
    areas: [
      {
        id: 'quarry',
        name: 'Quarry/Highwalls/Berms',
        description: 'The current mining area',
        subAreas: [
          { id: 'highwalls', name: 'Highwalls around quarry and/or mining area', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'berms', name: 'All berms around crusher hopper, stockpiles and ramps', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      },
      {
        id: 'crusher',
        name: 'Crusher/Screener/Conveyors',
        description: 'Crusher and screener include immediate area',
        subAreas: [
          { id: 'crusher-area', name: 'Crusher immediate area', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'conveyor-systems', name: 'All conveyor systems and walkways', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      }
    ]
  },
  {
    id: 'super-2',
    name: 'MSHA - Equipment Safety Inspection',
    version: 'v1.2',
    description: 'Comprehensive equipment safety inspection checklist',
    type: 'MSHA',
    isPublished: true,
    lastUpdated: '2024-01-20',
    areas: [
      {
        id: 'hydraulics',
        name: 'Hydraulic Systems',
        subAreas: [
          { id: 'hoses', name: 'Hydraulic hoses and fittings', canToggle: true, notesRequired: true, photoRequired: false },
          { id: 'cylinders', name: 'Hydraulic cylinders', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      }
    ]
  },
  {
    id: 'super-3',
    name: 'Construction - Daily Safety Walk',
    version: 'v1.0',
    description: 'Daily construction site safety walk template',
    type: 'Construction',
    isPublished: true,
    lastUpdated: '2024-01-10',
    areas: [
      {
        id: 'site-access',
        name: 'Site Access & Perimeter',
        subAreas: [
          { id: 'gates', name: 'Gates and entry points', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'fencing', name: 'Perimeter fencing', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      }
    ]
  }
];

const mockSites = [
  { id: 'site-1', name: 'Quarry A - North Pit' },
  { id: 'site-2', name: 'Quarry B - South Pit' },
  { id: 'site-3', name: 'Processing Plant 1' },
  { id: 'site-4', name: 'Construction Site - Building 7' }
];

const mockInspectors = [
  { id: '1', name: 'John Smith', role: 'Senior Inspector' },
  { id: '2', name: 'Sarah Johnson', role: 'Inspector' },
  { id: '3', name: 'Mike Wilson', role: 'Site Supervisor' },
  { id: '4', name: 'Emma Davis', role: 'Safety Officer' }
];

// ==================== COMPONENT ====================
const ComplianceSuiteManager = () => {
  const [view, setView] = useState<'list' | 'global' | 'customize'>('list');
  const [derivedTemplates, setDerivedTemplates] = useState<DerivedTemplate[]>([
    {
      id: 'derived-1',
      name: 'Daily Quarry A Workplace Exam',
      derivedFrom: {
        templateId: 'super-1',
        templateName: 'MSHA - Workplace Examination',
        version: 'v1.0'
      },
      type: 'MSHA',
      areas: mockSuperuserTemplates[0].areas,
      siteAssignment: 'site-1',
      frequency: 'daily',
      primaryInspector: '1',
      backupInspector: '2',
      notificationDeadline: '09:00',
      canResolutionRules: {
        requireNotification: true,
        requireSignoff: true
      },
      status: 'published',
      lastUpdated: '2024-01-22',
      createdBy: 'Admin User',
      hasNewVersion: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuperTemplate, setSelectedSuperTemplate] = useState<SuperuserTemplate | null>(null);
  const [showDeriveModal, setShowDeriveModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DerivedTemplate | null>(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationTemplateId, setNotificationTemplateId] = useState<string>('');
  const [notificationTemplateName, setNotificationTemplateName] = useState<string>('');
  
  const [deriveForm, setDeriveForm] = useState({
    name: '',
    siteAssignment: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    description: ''
  });

  const [formBuilder, setFormBuilder] = useState<Partial<DerivedTemplate>>({
    name: '',
    areas: [],
    primaryInspector: '',
    backupInspector: '',
    notificationDeadline: '09:00',
    helpText: '',
    canResolutionRules: {
      requireNotification: true,
      requireSignoff: true
    },
    status: 'draft'
  });

  const { toast } = useToast();

  const filteredSuperTemplates = mockSuperuserTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDerivedTemplates = derivedTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== HANDLERS ====================
  const handleUseTemplate = (template: SuperuserTemplate) => {
    setSelectedSuperTemplate(template);
    setDeriveForm({
      name: `${template.name} - Custom`,
      siteAssignment: '',
      frequency: 'daily',
      description: template.description
    });
    setShowDeriveModal(true);
  };

  const handleCreateDerivedCopy = () => {
    if (!deriveForm.name || !deriveForm.siteAssignment) {
      toast({
        title: "Validation Error",
        description: "Please fill in template name and site assignment",
        variant: "destructive"
      });
      return;
    }

    if (!selectedSuperTemplate) return;

    const derivedTemplate: DerivedTemplate = {
      id: `derived-${Date.now()}`,
      name: deriveForm.name,
      derivedFrom: {
        templateId: selectedSuperTemplate.id,
        templateName: selectedSuperTemplate.name,
        version: selectedSuperTemplate.version
      },
      type: selectedSuperTemplate.type,
      areas: JSON.parse(JSON.stringify(selectedSuperTemplate.areas)), // Deep copy
      siteAssignment: deriveForm.siteAssignment,
      frequency: deriveForm.frequency,
      primaryInspector: '',
      backupInspector: '',
      notificationDeadline: '09:00',
      canResolutionRules: {
        requireNotification: true,
        requireSignoff: true
      },
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Org Admin'
    };

    setFormBuilder(derivedTemplate);
    setEditingTemplate(derivedTemplate);
    setShowDeriveModal(false);
    setView('customize');
    
    toast({
      title: "Template Derived Successfully",
      description: `Created from ${selectedSuperTemplate.name} ${selectedSuperTemplate.version}`
    });
  };

  const handleSaveDraft = () => {
    if (!formBuilder.name) {
      toast({
        title: "Validation Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    const existingIndex = derivedTemplates.findIndex(t => t.id === editingTemplate?.id);
    const updatedTemplate = {
      ...editingTemplate!,
      ...formBuilder,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };

    if (existingIndex >= 0) {
      const newTemplates = [...derivedTemplates];
      newTemplates[existingIndex] = updatedTemplate;
      setDerivedTemplates(newTemplates);
    } else {
      setDerivedTemplates([...derivedTemplates, updatedTemplate]);
    }

    toast({
      title: "Draft Saved",
      description: "Your template has been saved as a draft"
    });

    setView('list');
    setEditingTemplate(null);
    setFormBuilder({});
  };

  const handlePublishTemplate = () => {
    if (!formBuilder.name || !formBuilder.primaryInspector) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before publishing",
        variant: "destructive"
      });
      return;
    }

    const existingIndex = derivedTemplates.findIndex(t => t.id === editingTemplate?.id);
    const publishedTemplate = {
      ...editingTemplate!,
      ...formBuilder,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'published' as const
    };

    if (existingIndex >= 0) {
      const newTemplates = [...derivedTemplates];
      newTemplates[existingIndex] = publishedTemplate;
      setDerivedTemplates(newTemplates);
    } else {
      setDerivedTemplates([...derivedTemplates, publishedTemplate]);
    }

    toast({
      title: "Template Published Successfully",
      description: `Template derived from ${publishedTemplate.derivedFrom.templateName} ${publishedTemplate.derivedFrom.version} has been published to your organization.`,
      duration: 5000
    });

    setView('list');
    setEditingTemplate(null);
    setFormBuilder({});
  };

  const handleEditDerived = (template: DerivedTemplate) => {
    setEditingTemplate(template);
    setFormBuilder(template);
    setView('customize');
  };

  const handleDeleteDerived = (templateId: string) => {
    setDerivedTemplates(derivedTemplates.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "The template has been removed"
    });
  };

  const getSiteName = (siteId: string) => {
    return mockSites.find(s => s.id === siteId)?.name || 'Unknown Site';
  };

  const getInspectorName = (inspectorId: string) => {
    return mockInspectors.find(i => i.id === inspectorId)?.name || 'Not Assigned';
  };

  // Area/SubArea Management
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

  // ==================== RENDER VIEWS ====================
  
  // STEP 1: View Available Global Templates
  const renderGlobalTemplates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Available Global Templates
          </h3>
          <p className="text-sm text-muted-foreground">Superuser published compliance suite templates</p>
        </div>
        <Button variant="outline" onClick={() => setView('list')}>
          <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
          Back to My Templates
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search global templates..."
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuperTemplates.map((template) => (
          <Card key={template.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    {template.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{template.type}</Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {template.version}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {template.areas.length} areas • Updated {template.lastUpdated}
                </span>
              </div>

              <Button 
                onClick={() => handleUseTemplate(template)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // STEP 2 & 3: Customize Derived Template
  const renderCustomizeTemplate = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Customize Template
          </h3>
          {editingTemplate?.derivedFrom && (
            <Badge variant="outline" className="mt-2 border-primary/30 bg-primary/5">
              Derived from: {editingTemplate.derivedFrom.templateName} {editingTemplate.derivedFrom.version}
            </Badge>
          )}
        </div>
        <Button variant="outline" onClick={() => {
          setView('list');
          setEditingTemplate(null);
          setFormBuilder({});
        }}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={formBuilder.name || ''}
                onChange={(e) => setFormBuilder({ ...formBuilder, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-assignment">Site Assignment *</Label>
              <Select
                value={formBuilder.siteAssignment || ''}
                onValueChange={(value) => setFormBuilder({ ...formBuilder, siteAssignment: value })}
              >
                <SelectTrigger id="site-assignment">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {mockSites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Inspection Frequency *</Label>
              <Select
                value={formBuilder.frequency || 'daily'}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setFormBuilder({ ...formBuilder, frequency: value })
                }
              >
                <SelectTrigger id="frequency">
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
              <Label htmlFor="notification-deadline">Notification Deadline</Label>
              <Input
                id="notification-deadline"
                type="time"
                value={formBuilder.notificationDeadline || '09:00'}
                onChange={(e) => setFormBuilder({ ...formBuilder, notificationDeadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-inspector">Primary Inspector *</Label>
              <Select
                value={formBuilder.primaryInspector || ''}
                onValueChange={(value) => setFormBuilder({ ...formBuilder, primaryInspector: value })}
              >
                <SelectTrigger id="primary-inspector">
                  <SelectValue placeholder="Select inspector" />
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
              <Label htmlFor="backup-inspector">Backup Inspector</Label>
              <Select
                value={formBuilder.backupInspector || ''}
                onValueChange={(value) => setFormBuilder({ ...formBuilder, backupInspector: value })}
              >
                <SelectTrigger id="backup-inspector">
                  <SelectValue placeholder="Select backup" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="help-text">Help Text (shown daily)</Label>
            <Textarea
              id="help-text"
              value={formBuilder.helpText || ''}
              onChange={(e) => setFormBuilder({ ...formBuilder, helpText: e.target.value })}
              placeholder="Enter instructions or help text for operators..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>CAN Resolution Rules</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Require notification for CAN status</span>
              <Switch
                checked={formBuilder.canResolutionRules?.requireNotification || false}
                onCheckedChange={(checked) => 
                  setFormBuilder({
                    ...formBuilder,
                    canResolutionRules: {
                      ...formBuilder.canResolutionRules!,
                      requireNotification: checked
                    }
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Require signoff for CAN resolution</span>
              <Switch
                checked={formBuilder.canResolutionRules?.requireSignoff || false}
                onCheckedChange={(checked) => 
                  setFormBuilder({
                    ...formBuilder,
                    canResolutionRules: {
                      ...formBuilder.canResolutionRules!,
                      requireSignoff: checked
                    }
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Areas & Sub-Areas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inspection Areas</CardTitle>
            <Button onClick={addArea} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formBuilder.areas && formBuilder.areas.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {formBuilder.areas.map((area, areaIndex) => (
                <AccordionItem key={area.id} value={area.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 flex-1 text-left">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{area.name}</span>
                      <Badge variant="outline">{area.subAreas.length} sub-areas</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4 pl-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Area Name</Label>
                          <Input
                            value={area.name}
                            onChange={(e) => updateArea(area.id, { name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={area.description || ''}
                            onChange={(e) => updateArea(area.id, { description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Sub-Areas</Label>
                          <Button 
                            onClick={() => addSubArea(area.id)} 
                            size="sm" 
                            variant="outline"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Sub-Area
                          </Button>
                        </div>

                        {area.subAreas.map((subArea) => (
                          <Card key={subArea.id} className="bg-muted/30">
                            <CardContent className="pt-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={subArea.name}
                                    onChange={(e) => updateSubArea(area.id, subArea.id, { name: e.target.value })}
                                    placeholder="Sub-area name"
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteSubArea(area.id, subArea.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`toggle-${subArea.id}`}
                                    checked={subArea.canToggle}
                                    onCheckedChange={(checked) => 
                                      updateSubArea(area.id, subArea.id, { canToggle: checked })
                                    }
                                  />
                                  <Label htmlFor={`toggle-${subArea.id}`} className="text-xs">
                                    CAN Toggle
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`notes-${subArea.id}`}
                                    checked={subArea.notesRequired}
                                    onCheckedChange={(checked) => 
                                      updateSubArea(area.id, subArea.id, { notesRequired: checked })
                                    }
                                  />
                                  <Label htmlFor={`notes-${subArea.id}`} className="text-xs">
                                    Notes Required
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`photo-${subArea.id}`}
                                    checked={subArea.photoRequired}
                                    onCheckedChange={(checked) => 
                                      updateSubArea(area.id, subArea.id, { photoRequired: checked })
                                    }
                                  />
                                  <Label htmlFor={`photo-${subArea.id}`} className="text-xs">
                                    Photo Required
                                  </Label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteArea(area.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Area
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No areas defined yet. Click "Add Area" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button onClick={handlePublishTemplate} className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Publish to Organization
        </Button>
      </div>
    </div>
  );

  // STEP 4 & 5: Active Templates List
  const renderTemplatesList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Organization Compliance Templates
          </h3>
          <p className="text-sm text-muted-foreground">Manage your derived compliance suite templates</p>
        </div>
        <Button onClick={() => setView('global')}>
          <Plus className="h-4 w-4 mr-2" />
          Browse Global Templates
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search templates..."
          className="pl-10"
        />
      </div>

      {/* Version Update Notifications */}
      {derivedTemplates.some(t => t.hasNewVersion) && (
        <Alert className="border-warning bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>New versions available for some templates. Review and update?</span>
              <Button size="sm" variant="outline">
                Review Updates
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {filteredDerivedTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      {template.name}
                      {template.status === 'published' ? (
                        <Badge className="bg-success text-success-foreground">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                      {template.hasNewVersion && (
                        <Badge variant="outline" className="border-warning text-warning">
                          Update Available
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Derived from: {template.derivedFrom.templateName} {template.derivedFrom.version}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setNotificationTemplateId(template.id);
                        setNotificationTemplateName(template.name);
                        setNotificationModalOpen(true);
                      }}
                      title="Configure Notifications"
                    >
                      <Bell className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditDerived(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteDerived(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{template.type}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {getSiteName(template.siteAssignment)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.frequency.charAt(0).toUpperCase() + template.frequency.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {getInspectorName(template.primaryInspector)}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {template.areas.length} areas • Last updated: {template.lastUpdated}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDerivedTemplates.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No Templates Yet</h4>
              <p className="text-muted-foreground mb-6">
                Browse global templates to create your first compliance suite template
              </p>
              <Button onClick={() => setView('global')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Global Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-6">
      <NotificationConfigModal
        formId={notificationTemplateId}
        formName={notificationTemplateName}
        formType="workplace"
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />

      {/* STEP 2: Derive Modal */}
      <Dialog open={showDeriveModal} onOpenChange={setShowDeriveModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Derived Template</DialogTitle>
          </DialogHeader>
          
          {selectedSuperTemplate && (
            <div className="space-y-4">
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Deriving from:</p>
                    <p className="text-sm">{selectedSuperTemplate.name} {selectedSuperTemplate.version}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="derive-name">Template Name *</Label>
                  <Input
                    id="derive-name"
                    value={deriveForm.name}
                    onChange={(e) => setDeriveForm({ ...deriveForm, name: e.target.value })}
                    placeholder="Enter custom name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="derive-site">Site Assignment *</Label>
                  <Select
                    value={deriveForm.siteAssignment}
                    onValueChange={(value) => setDeriveForm({ ...deriveForm, siteAssignment: value })}
                  >
                    <SelectTrigger id="derive-site">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSites.map(site => (
                        <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="derive-frequency">Frequency *</Label>
                  <Select
                    value={deriveForm.frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      setDeriveForm({ ...deriveForm, frequency: value })
                    }
                  >
                    <SelectTrigger id="derive-frequency">
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
                  <Label htmlFor="derive-description">Description (Optional)</Label>
                  <Textarea
                    id="derive-description"
                    value={deriveForm.description}
                    onChange={(e) => setDeriveForm({ ...deriveForm, description: e.target.value })}
                    placeholder="Add any custom notes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeriveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDerivedCopy}>
              Continue to Customize
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main View Router */}
      {view === 'list' && renderTemplatesList()}
      {view === 'global' && renderGlobalTemplates()}
      {view === 'customize' && renderCustomizeTemplate()}
    </div>
  );
};

export default ComplianceSuiteManager;
