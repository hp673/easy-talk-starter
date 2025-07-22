import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Save, AlertTriangle, Wifi, WifiOff, Camera } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useAuth } from '@/contexts/AuthContext';

interface InspectionFormData {
  equipment_id: string;
  make_model: string;
  date: string;
  mine_location: string;
  engine_hours: number;
  fuel_level: number;
  oil_level: 'Normal' | 'Low' | 'Critical';
  electrical_ok: boolean;
  hyd_leaks: boolean;
  brakes_ok: boolean;
  instrumentation_ok: boolean;
  safety_ok: boolean;
  structure_ok: boolean;
  lighting_ok: boolean;
  guards_ok: boolean;
  defect_explanation: string;
}

const formSections = [
  { id: 'basic', title: 'Basic Information', icon: '📋' },
  { id: 'operational', title: 'Operational Data', icon: '⚙️' },
  { id: 'engine', title: 'Pre-Shift Engine', icon: '🔧' },
  { id: 'cabin', title: 'Pre-Shift In-Cab', icon: '🚗' },
  { id: 'exterior', title: 'Pre-Shift Exterior', icon: '🔍' },
  { id: 'defects', title: 'Defect Documentation', icon: '⚠️' },
];

const InspectionForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [criticalDefectDetected, setCriticalDefectDetected] = useState(false);
  
  const navigate = useNavigate();
  const { isOnline, saveOfflineData } = useOffline();
  const { user } = useAuth();
  
  const { register, watch, setValue, getValues, formState: { errors } } = useForm<InspectionFormData>();
  
  // Get selected equipment from localStorage
  const selectedEquipment = JSON.parse(localStorage.getItem('selected_equipment') || '{}');
  
  const watchedValues = watch();
  
  useEffect(() => {
    // Initialize form with equipment data
    if (selectedEquipment.id) {
      setValue('equipment_id', selectedEquipment.id);
      setValue('make_model', `${selectedEquipment.make} ${selectedEquipment.model}`);
      setValue('mine_location', selectedEquipment.location);
      setValue('date', new Date().toISOString().split('T')[0]);
    }
  }, [selectedEquipment, setValue]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const interval = setInterval(() => {
      const formData = getValues();
      saveOfflineData('forms', formData);
      setLastSaved(new Date());
      
      if (!isOnline) {
        toast({
          title: "Form Auto-Saved",
          description: "Your progress has been saved offline",
        });
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoSaveEnabled, getValues, saveOfflineData, isOnline]);

  // Check for critical defects
  useEffect(() => {
    const isHydLeaks = watchedValues.hyd_leaks;
    const isOilCritical = watchedValues.oil_level === 'Critical';
    
    if (isHydLeaks || isOilCritical) {
      setCriticalDefectDetected(true);
      toast({
        title: "Critical Defect Detected",
        description: "Equipment locked out. Maintenance required immediately.",
        variant: "destructive",
      });
    } else {
      setCriticalDefectDetected(false);
    }
  }, [watchedValues.hyd_leaks, watchedValues.oil_level]);

  const nextSection = () => {
    if (currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handlePhotoUpload = () => {
    navigate('/defect-documentation');
  };

  const handleSignature = () => {
    navigate('/signature-capture');
  };

  const progress = ((currentSection + 1) / formSections.length) * 100;

  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipment_id">Equipment ID</Label>
          <Input
            {...register('equipment_id')}
            id="equipment_id"
            className="input-mining"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="make_model">Make & Model</Label>
          <Input
            {...register('make_model')}
            id="make_model"
            className="input-mining"
            readOnly
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Inspection Date</Label>
          <Input
            {...register('date')}
            id="date"
            type="date"
            className="input-mining"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mine_location">Mine Location</Label>
          <Input
            {...register('mine_location')}
            id="mine_location"
            className="input-mining"
          />
        </div>
      </div>
    </div>
  );

  const renderOperationalData = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="engine_hours">Engine Hours</Label>
          <Input
            {...register('engine_hours', { valueAsNumber: true })}
            id="engine_hours"
            type="number"
            className="input-mining"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuel_level">Fuel Level (%)</Label>
          <Input
            {...register('fuel_level', { valueAsNumber: true })}
            id="fuel_level"
            type="number"
            min="0"
            max="100"
            className="input-mining"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderEngineSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="oil_level">Oil Level</Label>
        <Select onValueChange={(value) => setValue('oil_level', value as any)}>
          <SelectTrigger className="input-mining">
            <SelectValue placeholder="Select oil level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="electrical_ok"
            onCheckedChange={(checked) => setValue('electrical_ok', !!checked)}
          />
          <Label htmlFor="electrical_ok" className="text-base">
            Electrical Systems OK
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hyd_leaks"
            onCheckedChange={(checked) => setValue('hyd_leaks', !!checked)}
          />
          <Label htmlFor="hyd_leaks" className="text-base">
            Hydraulic Leaks Detected
          </Label>
        </div>
      </div>

      {criticalDefectDetected && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <strong>EQUIPMENT LOCKOUT</strong>
          </div>
          <p className="mt-2">Critical defect detected. Equipment must not be operated until repaired.</p>
        </div>
      )}
    </div>
  );

  const renderCabinSection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="brakes_ok"
          onCheckedChange={(checked) => setValue('brakes_ok', !!checked)}
        />
        <Label htmlFor="brakes_ok" className="text-base">
          Brakes Functioning Properly
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="instrumentation_ok"
          onCheckedChange={(checked) => setValue('instrumentation_ok', !!checked)}
        />
        <Label htmlFor="instrumentation_ok" className="text-base">
          All Instrumentation Working
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="safety_ok"
          onCheckedChange={(checked) => setValue('safety_ok', !!checked)}
        />
        <Label htmlFor="safety_ok" className="text-base">
          Safety Systems Operational
        </Label>
      </div>
    </div>
  );

  const renderExteriorSection = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="structure_ok"
          onCheckedChange={(checked) => setValue('structure_ok', !!checked)}
        />
        <Label htmlFor="structure_ok" className="text-base">
          Structural Integrity Good
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="lighting_ok"
          onCheckedChange={(checked) => setValue('lighting_ok', !!checked)}
        />
        <Label htmlFor="lighting_ok" className="text-base">
          All Lighting Functional
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="guards_ok"
          onCheckedChange={(checked) => setValue('guards_ok', !!checked)}
        />
        <Label htmlFor="guards_ok" className="text-base">
          Safety Guards in Place
        </Label>
      </div>
    </div>
  );

  const renderDefectsSection = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defect_explanation">Defect Explanation</Label>
        <Textarea
          {...register('defect_explanation')}
          id="defect_explanation"
          placeholder="Describe any defects or issues found during inspection..."
          className="input-mining min-h-24"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          onClick={handlePhotoUpload}
          className="btn-mining flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Add Photos
        </Button>

        <Button
          type="button"
          onClick={handleSignature}
          className="btn-mining"
        >
          Capture Signature
        </Button>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: return renderBasicInformation();
      case 1: return renderOperationalData();
      case 2: return renderEngineSection();
      case 3: return renderCabinSection();
      case 4: return renderExteriorSection();
      case 5: return renderDefectsSection();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/equipment-selection')}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Equipment Inspection</h1>
              <p className="text-sm text-muted-foreground">
                {selectedEquipment.id} - {formSections[currentSection].title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isOnline ? (
              <div className="status-online">
                <Wifi className="h-4 w-4" />
                Online
              </div>
            ) : (
              <div className="status-offline">
                <WifiOff className="h-4 w-4" />
                Offline
              </div>
            )}
            
            {lastSaved && (
              <div className="text-xs text-muted-foreground">
                Saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Section {currentSection + 1} of {formSections.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {formSections.map((section, index) => (
            <Button
              key={section.id}
              variant={index === currentSection ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSection(index)}
              className="text-xs p-2 h-auto flex flex-col gap-1"
            >
              <span className="text-lg">{section.icon}</span>
              <span className="hidden sm:block">{section.title}</span>
            </Button>
          ))}
        </div>

        {/* Form Section */}
        <Card className="form-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{formSections[currentSection].icon}</span>
              {formSections[currentSection].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderCurrentSection()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={prevSection}
            disabled={currentSection === 0}
            variant="outline"
            className="touch-target"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={() => {
              const formData = getValues();
              saveOfflineData('forms', formData);
              toast({
                title: "Form Saved",
                description: "Your inspection data has been saved",
              });
            }}
            variant="outline"
            className="touch-target"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>

          <Button
            onClick={nextSection}
            disabled={currentSection === formSections.length - 1}
            className="btn-mining"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;