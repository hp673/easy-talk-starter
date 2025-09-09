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
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Search, Edit, Trash2, Copy, Eye, 
  FileText, GripVertical, X, Settings, Camera, Calendar, Type, CheckSquare, Hash
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'date' | 'number' | 'dropdown' | 'checkbox' | 'signature' | 'photo';
  label: string;
  required: boolean;
  isCritical: boolean;
  options?: string[]; // For dropdown fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormSection {
  id: string;
  name: string;
  fields: FormField[];
}

interface FormTemplate {
  id: string;
  name: string;
  type: 'equipment' | 'workplace';
  category: string;
  interval: 'daily' | 'weekly' | 'monthly';
  linkedEquipment: string[];
  sections: FormSection[];
  lastUpdated: string;
  createdBy: string;
  isPublished: boolean;
}

const mockTemplates: FormTemplate[] = [
  {
    id: '1',
    name: 'Daily Equipment Check',
    type: 'equipment',
    category: 'Excavator',
    interval: 'daily',
    linkedEquipment: ['CAT-789C-001', 'KOM-PC5500-002'],
    sections: [
      {
        id: 'engine',
        name: 'Engine Check',
        fields: [
          { id: 'oil-level', type: 'dropdown', label: 'Oil Level', required: true, isCritical: true, options: ['Good', 'Low', 'Critical'] },
          { id: 'coolant', type: 'dropdown', label: 'Coolant Level', required: true, isCritical: false, options: ['Good', 'Low', 'Critical'] }
        ]
      }
    ],
    lastUpdated: '2024-01-22',
    createdBy: 'Admin User',
    isPublished: true
  },
  {
    id: '2',
    name: 'Weekly Hydraulic Inspection',
    type: 'equipment',
    category: 'Loader',
    interval: 'weekly',
    linkedEquipment: ['CAT-994K-003'],
    sections: [],
    lastUpdated: '2024-01-20',
    createdBy: 'Admin User',
    isPublished: false
  }
];

const fieldTypeIcons = {
  text: Type,
  date: Calendar,
  number: Hash,
  dropdown: Settings,
  checkbox: CheckSquare,
  signature: Edit,
  photo: Camera
};

const FormTemplateManager = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>(mockTemplates);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formBuilder, setFormBuilder] = useState<Partial<FormTemplate>>({
    name: '',
    type: 'equipment',
    category: '',
    interval: 'daily',
    linkedEquipment: [],
    sections: [],
    isPublished: false
  });
  const { toast } = useToast();

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const addSection = () => {
    const newSection: FormSection = {
      id: Date.now().toString(),
      name: 'New Section',
      fields: []
    };
    setFormBuilder(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ) || []
    }));
  };

  const deleteSection = (sectionId: string) => {
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections?.filter(section => section.id !== sectionId) || []
    }));
  };

  const addField = (sectionId: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      required: false,
      isCritical: false
    };
    
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId 
          ? { ...section, fields: [...section.fields, newField] }
          : section
      ) || []
    }));
  };

  const updateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : section
      ) || []
    }));
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections?.map(section =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) }
          : section
      ) || []
    }));
  };

  const saveTemplate = () => {
    if (!formBuilder.name || !formBuilder.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const templateData: FormTemplate = {
      id: isEditing ? selectedTemplate!.id : Date.now().toString(),
      name: formBuilder.name!,
      type: formBuilder.type as 'equipment' | 'workplace',
      category: formBuilder.category!,
      interval: formBuilder.interval as 'daily' | 'weekly' | 'monthly',
      linkedEquipment: formBuilder.linkedEquipment || [],
      sections: formBuilder.sections || [],
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User',
      isPublished: formBuilder.isPublished || false
    };

    if (isEditing) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate!.id ? templateData : t));
      toast({
        title: "Template Updated",
        description: "Form template has been successfully updated"
      });
    } else {
      setTemplates(prev => [...prev, templateData]);
      toast({
        title: "Template Created",
        description: "New form template has been successfully created"
      });
    }

    // Reset form
    setFormBuilder({
      name: '',
      type: 'equipment',
      category: '',
      interval: 'daily',
      linkedEquipment: [],
      sections: [],
      isPublished: false
    });
    setShowCreateForm(false);
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const editTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setFormBuilder(template);
    setIsEditing(true);
    setShowCreateForm(true);
  };

  const duplicateTemplate = (template: FormTemplate) => {
    const duplicated = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isPublished: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, duplicated]);
    toast({
      title: "Template Duplicated",
      description: "Template has been successfully duplicated"
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Template has been successfully deleted"
    });
  };

  const FieldEditor = ({ sectionId, field }: { sectionId: string; field: FormField }) => {
    const IconComponent = fieldTypeIcons[field.type];
    
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <IconComponent className="h-4 w-4" />
          <Input
            value={field.label}
            onChange={(e) => updateField(sectionId, field.id, { label: e.target.value })}
            className="flex-1"
            placeholder="Field Label"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => deleteField(sectionId, field.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Field Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => updateField(sectionId, field.id, { type: value as any })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="date">Date Picker</SelectItem>
                <SelectItem value="number">Number Input</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="signature">Signature</SelectItem>
                <SelectItem value="photo">Photo Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => updateField(sectionId, field.id, { required: checked })}
            />
            <Label className="text-xs">Required</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.isCritical}
              onCheckedChange={(checked) => updateField(sectionId, field.id, { isCritical: checked })}
            />
            <Label className="text-xs">Critical Defect</Label>
          </div>
        </div>
        
        {field.type === 'dropdown' && (
          <div className="mt-3">
            <Label className="text-xs">Options (comma-separated)</Label>
            <Input
              value={field.options?.join(', ') || ''}
              onChange={(e) => updateField(sectionId, field.id, { 
                options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Option 1, Option 2, Option 3"
              className="mt-1"
            />
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Equipment Form Templates
          </h2>
          <p className="text-sm text-muted-foreground">Manage equipment inspection form templates</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => {
            setFormBuilder({
              name: '',
              type: 'equipment',
              category: '',
              interval: 'daily',
              linkedEquipment: [],
              sections: [],
              isPublished: false
            });
            setIsEditing(false);
            setShowCreateForm(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Equipment Template
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
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {template.name}
                          {template.isPublished ? (
                            <Badge className="bg-success text-success-foreground">Published</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {template.category} • {template.interval} • {template.sections.length} sections
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{template.interval}</Badge>
                        <Badge variant="outline">{template.linkedEquipment.length} equipment</Badge>
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
                            {template.sections.map(section => (
                              <div key={section.id}>
                                <h4 className="font-medium mb-2">{section.name}</h4>
                                <div className="space-y-2 pl-4">
                                  {section.fields.map(field => (
                                    <div key={field.id} className="flex items-center gap-2">
                                      <span className="text-sm">{field.label}</span>
                                      {field.required && <span className="text-destructive">*</span>}
                                      {field.isCritical && <Badge variant="destructive" className="text-xs">Critical</Badge>}
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
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">No templates found</h4>
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Create your first form template to get started'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {showCreateForm && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Template' : 'Create New Template'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Template Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Template Name *</Label>
                  <Input
                    value={formBuilder.name || ''}
                    onChange={(e) => setFormBuilder(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formBuilder.category || ''}
                    onValueChange={(value) => setFormBuilder(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excavator">Excavator</SelectItem>
                      <SelectItem value="Loader">Loader</SelectItem>
                      <SelectItem value="Haul Truck">Haul Truck</SelectItem>
                      <SelectItem value="Drill">Drill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Inspection Interval</Label>
                  <Select
                    value={formBuilder.interval || 'daily'}
                    onValueChange={(value) => setFormBuilder(prev => ({ ...prev, interval: value as any }))}
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
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formBuilder.isPublished || false}
                    onCheckedChange={(checked) => setFormBuilder(prev => ({ ...prev, isPublished: checked }))}
                  />
                  <Label>Publish Template</Label>
                </div>
              </div>

              {/* Form Builder */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Form Sections</h4>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>

                {formBuilder.sections?.map((section, sectionIndex) => (
                  <Card key={section.id} className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Input
                        value={section.name}
                        onChange={(e) => updateSection(section.id, { name: e.target.value })}
                        className="font-medium"
                        placeholder="Section Name"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addField(section.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Field
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3 pl-6">
                      {section.fields.map((field) => (
                        <FieldEditor
                          key={field.id}
                          sectionId={section.id}
                          field={field}
                        />
                      ))}
                      
                      {section.fields.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded">
                          No fields in this section. Click "Add Field" to get started.
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                {formBuilder.sections?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded">
                    No sections added yet. Click "Add Section" to start building your form.
                  </div>
                )}
              </div>

              {/* Save Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setShowCreateForm(false);
                  setFormBuilder({
                    name: '',
                    category: '',
                    interval: 'daily',
                    linkedEquipment: [],
                    sections: [],
                    isPublished: false
                  });
                  setIsEditing(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={saveTemplate}>
                  {isEditing ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FormTemplateManager;