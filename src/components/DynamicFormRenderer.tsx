import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2 } from 'lucide-react';

// JSON-based form structure inspired by n8n
interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormSection {
  section_id: string;
  title: string;
  description?: string;
  icon?: string;
  fields: FormField[];
}

interface DynamicFormConfig {
  form_id: string;
  title: string;
  version: string;
  sections: FormSection[];
}

// Example JSON configuration
const mockFormConfig: DynamicFormConfig = {
  form_id: "inspection_v2",
  title: "Dynamic Equipment Inspection",
  version: "2.0",
  sections: [
    {
      section_id: "engine_check",
      title: "Engine Systems",
      description: "Check all engine-related components",
      icon: "🔧",
      fields: [
        {
          id: "oil_level",
          type: "select",
          label: "Oil Level",
          required: true,
          options: ["Normal", "Low", "Critical", "Overfilled"]
        },
        {
          id: "engine_temp",
          type: "number",
          label: "Engine Temperature (°C)",
          required: true,
          validation: { min: 0, max: 150 }
        },
        {
          id: "engine_noise",
          type: "checkbox",
          label: "Unusual engine noise detected"
        },
        {
          id: "engine_notes",
          type: "textarea",
          label: "Additional Notes",
          placeholder: "Describe any observations..."
        }
      ]
    },
    {
      section_id: "hydraulic_check",
      title: "Hydraulic Systems",
      description: "Inspect hydraulic components and fluid levels",
      icon: "🏗️",
      fields: [
        {
          id: "hyd_pressure",
          type: "number",
          label: "Hydraulic Pressure (PSI)",
          required: true,
          validation: { min: 0, max: 5000 }
        },
        {
          id: "hyd_leaks",
          type: "select",
          label: "Leak Detection",
          required: true,
          options: ["None", "Minor", "Major", "Critical"]
        },
        {
          id: "hyd_fluid_color",
          type: "text",
          label: "Hydraulic Fluid Color",
          placeholder: "e.g., Clear, Dark, Contaminated"
        }
      ]
    },
    {
      section_id: "safety_check",
      title: "Safety Systems",
      description: "Verify all safety components and features",
      icon: "⚠️",
      fields: [
        {
          id: "warning_lights",
          type: "checkbox",
          label: "All warning lights functional"
        },
        {
          id: "horn_test",
          type: "checkbox",
          label: "Horn operational"
        },
        {
          id: "safety_rating",
          type: "select",
          label: "Overall Safety Rating",
          required: true,
          options: ["Excellent", "Good", "Fair", "Poor", "Unsafe"]
        }
      ]
    }
  ]
};

interface DynamicFormRendererProps {
  formConfig?: DynamicFormConfig;
  onSubmit?: (data: Record<string, any>) => void;
  onSectionChange?: (sectionId: string) => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  formConfig = mockFormConfig,
  onSubmit,
  onSectionChange
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);

  const updateFieldValue = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateFieldValue(field.id, parseFloat(e.target.value))}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            required={field.required}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => updateFieldValue(field.id, checked)}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => updateFieldValue(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        form_id: formConfig.form_id,
        form_version: formConfig.version,
        submitted_at: new Date().toISOString(),
        data: formData
      });
    }
  };

  const nextSection = () => {
    if (currentSection < formConfig.sections.length - 1) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      onSectionChange?.(formConfig.sections[newSection].section_id);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      const newSection = currentSection - 1;
      setCurrentSection(newSection);
      onSectionChange?.(formConfig.sections[newSection].section_id);
    }
  };

  const currentSectionData = formConfig.sections[currentSection];

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {formConfig.title}
            <Badge variant="outline">v{formConfig.version}</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {formConfig.sections.map((section, index) => (
              <Button
                key={section.section_id}
                variant={currentSection === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentSection(index)}
                className="flex items-center gap-1"
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.title}</span>
              </Button>
            ))}
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / formConfig.sections.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentSectionData.icon}</span>
            {currentSectionData.title}
          </CardTitle>
          {currentSectionData.description && (
            <p className="text-muted-foreground">{currentSectionData.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSectionData.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'checkbox' && (
                <Label htmlFor={field.id} className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
              )}
              {renderField(field)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevSection}
          disabled={currentSection === 0}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentSection === formConfig.sections.length - 1 ? (
            <Button onClick={handleSubmit}>
              Submit Form
            </Button>
          ) : (
            <Button onClick={nextSection}>
              Next Section
            </Button>
          )}
        </div>
      </div>

      {/* Form Data Preview (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Form Data (Dev Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};