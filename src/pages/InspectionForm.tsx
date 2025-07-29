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
import { ArrowLeft, Save, AlertTriangle, Wifi, WifiOff, Camera, FileText } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useAuth } from '@/contexts/AuthContext';

interface InspectionFormData {
  // Basic Information
  equipment: string;
  make_and_model: string;
  date: string;
  
  // Operational Data
  name_of_mine: string;
  engine_hours_beginning: number;
  engine_hours_ending: number;
  fuel_added_gallons: number;
  
  // Pre-Shift Engine
  oil_level: boolean;
  water_level: boolean;
  wiring: boolean;
  generator: boolean;
  starter: boolean;
  battery: boolean;
  fuel_level: boolean;
  exhaust_sys: boolean;
  oil_leaks: boolean;
  hyd_leaks: boolean;
  fuel_leaks: boolean;
  low_power: boolean;
  engine_other: boolean;
  engine_no_defects_found: boolean;
  
  // Pre-Shift In-Cab
  brakes_park: boolean;
  brakes_foot: boolean;
  horn: boolean;
  gauges: boolean;
  windshield_wipers: boolean;
  glass_windshield: boolean;
  glass_door: boolean;
  mirrors: boolean;
  seat_belts: boolean;
  steering: boolean;
  ignition: boolean;
  in_cab_other_1: boolean;
  in_cab_other_2: boolean;
  in_cab_other: boolean;
  in_cab_no_defects_found: boolean;
  
  // Pre-Shift Exterior
  suspension: boolean;
  vehicle_frame: boolean;
  back_up_alarm: boolean;
  head_lights: boolean;
  tail_lights: boolean;
  safety_guards: boolean;
  tires_wheels: boolean;
  transmission: boolean;
  back_up_lights: boolean;
  differential: boolean;
  front_axle: boolean;
  cutting_edge: boolean;
  track: boolean;
  bucket_teeth: boolean;
  exterior_no_defects_found: boolean;
  
  // Other sections
  explanation_of_defects: string;
  operator_signature_initial: string;
  date_initial: string;
  defects_corrected: string;
  operator_signature_corrected: string;
  date_corrected: string;
}

const formSections = [
  { id: 'basic_info', title: 'Basic Information', icon: '📋' },
  { id: 'operational_data', title: 'Operational Data', icon: '⚙️' },
  { id: 'pre_shift_engine', title: 'Pre-Shift – Engine', icon: '🔧' },
  { id: 'pre_shift_in_cab', title: 'Pre-Shift – In-Cab', icon: '🚗' },
  { id: 'pre_shift_exterior', title: 'Pre-Shift – Exterior', icon: '🔍' },
  { id: 'explanation_of_defects', title: 'Explanation of Defects', icon: '⚠️' },
  { id: 'operator_signature', title: 'Operator Signature', icon: '✍️' },
];

const InspectionForm = () => {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [criticalDefectDetected, setCriticalDefectDetected] = useState(false);
  
  const navigate = useNavigate();
  const { isOnline, saveOfflineData } = useOffline();
  const { user } = useAuth();
  
  const { register, watch, setValue, getValues, handleSubmit, formState: { errors } } = useForm<InspectionFormData>();
  
  // Get selected equipment from localStorage
  const selectedEquipment = JSON.parse(localStorage.getItem('selected_equipment') || '{}');
  
  const watchedValues = watch();
  
  useEffect(() => {
    // Initialize form with equipment data
    if (selectedEquipment.id) {
      setValue('equipment', selectedEquipment.id);
      setValue('make_and_model', `${selectedEquipment.make} ${selectedEquipment.model}`);
      setValue('name_of_mine', selectedEquipment.location);
      setValue('date', new Date().toISOString().split('T')[0]);
      setValue('date_initial', new Date().toISOString().split('T')[0]);
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
    const isOilLeaks = watchedValues.oil_leaks;
    
    if (isHydLeaks || isOilLeaks) {
      setCriticalDefectDetected(true);
      toast({
        title: "Critical Defect Detected",
        description: "Equipment locked out. Maintenance required immediately.",
        variant: "destructive",
      });
    } else {
      setCriticalDefectDetected(false);
    }
  }, [watchedValues.hyd_leaks, watchedValues.oil_leaks]);

  const handlePhotoUpload = () => {
    navigate('/defect-documentation');
  };

  const handleSignature = () => {
    navigate('/signature-capture');
  };

  const onSubmit = (data: InspectionFormData) => {
    saveOfflineData('forms', data);
    toast({
      title: "Inspection Completed",
      description: "Form submitted successfully",
    });
    navigate('/operator-dashboard');
  };

  const renderBasicInformation = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <Input
              {...register('equipment')}
              id="equipment"
              className="input-mining"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="make_and_model">Make and Model</Label>
            <Input
              {...register('make_and_model')}
              id="make_and_model"
              className="input-mining"
              readOnly
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            {...register('date')}
            id="date"
            type="date"
            className="input-mining"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderOperationalData = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Operational Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name_of_mine">Name of Mine</Label>
          <Input
            {...register('name_of_mine')}
            id="name_of_mine"
            className="input-mining"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="engine_hours_beginning">Engine Hours Beginning</Label>
            <Input
              {...register('engine_hours_beginning', { valueAsNumber: true })}
              id="engine_hours_beginning"
              type="number"
              className="input-mining"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="engine_hours_ending">Engine Hours Ending</Label>
            <Input
              {...register('engine_hours_ending', { valueAsNumber: true })}
              id="engine_hours_ending"
              type="number"
              className="input-mining"
              placeholder="0"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuel_added_gallons">Fuel Added (Gallons)</Label>
          <Input
            {...register('fuel_added_gallons', { valueAsNumber: true })}
            id="fuel_added_gallons"
            type="number"
            className="input-mining"
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderEngineSection = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          Pre-Shift – Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'oil_level', label: 'Oil Level' },
            { id: 'water_level', label: 'Water Level' },
            { id: 'wiring', label: 'Wiring' },
            { id: 'generator', label: 'Generator' },
            { id: 'starter', label: 'Starter' },
            { id: 'battery', label: 'Battery' },
            { id: 'fuel_level', label: 'Fuel Level' },
            { id: 'exhaust_sys', label: 'Exhaust System' },
            { id: 'oil_leaks', label: 'Oil Leaks', critical: true },
            { id: 'hyd_leaks', label: 'Hydraulic Leaks', critical: true },
            { id: 'fuel_leaks', label: 'Fuel Leaks' },
            { id: 'low_power', label: 'Low Power' },
            { id: 'engine_other', label: 'Engine Other' },
          ].map((field: any) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                {...register(field.id as keyof InspectionFormData)}
              />
              <Label htmlFor={field.id} className={`text-base ${field.critical ? 'font-bold text-destructive' : ''}`}>
                {field.label}
                {field.critical && ' ⚠️'}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 mt-6 p-4 bg-muted rounded-lg">
          <Checkbox
            id="engine_no_defects_found"
            {...register('engine_no_defects_found')}
          />
          <Label htmlFor="engine_no_defects_found" className="text-base font-semibold">
            No Defects Found
          </Label>
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
      </CardContent>
    </Card>
  );

  const renderCabinSection = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          Pre-Shift – In-Cab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'brakes_park', label: 'Parking Brakes' },
            { id: 'brakes_foot', label: 'Foot Brakes' },
            { id: 'horn', label: 'Horn' },
            { id: 'gauges', label: 'Gauges' },
            { id: 'windshield_wipers', label: 'Windshield Wipers' },
            { id: 'glass_windshield', label: 'Glass Windshield' },
            { id: 'glass_door', label: 'Glass Door' },
            { id: 'mirrors', label: 'Mirrors' },
            { id: 'seat_belts', label: 'Seat Belts' },
            { id: 'steering', label: 'Steering' },
            { id: 'ignition', label: 'Ignition' },
            { id: 'in_cab_other_1', label: 'In-Cab Other 1' },
            { id: 'in_cab_other_2', label: 'In-Cab Other 2' },
            { id: 'in_cab_other', label: 'In-Cab Other' },
          ].map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                {...register(field.id as keyof InspectionFormData)}
              />
              <Label htmlFor={field.id} className="text-base">
                {field.label}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 mt-6 p-4 bg-muted rounded-lg">
          <Checkbox
            id="in_cab_no_defects_found"
            {...register('in_cab_no_defects_found')}
          />
          <Label htmlFor="in_cab_no_defects_found" className="text-base font-semibold">
            No Defects Found
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderExteriorSection = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          Pre-Shift – Exterior
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'suspension', label: 'Suspension' },
            { id: 'vehicle_frame', label: 'Vehicle Frame' },
            { id: 'back_up_alarm', label: 'Back-up Alarm' },
            { id: 'head_lights', label: 'Head Lights' },
            { id: 'tail_lights', label: 'Tail Lights' },
            { id: 'safety_guards', label: 'Safety Guards' },
            { id: 'tires_wheels', label: 'Tires/Wheels' },
            { id: 'transmission', label: 'Transmission' },
            { id: 'back_up_lights', label: 'Back-up Lights' },
            { id: 'differential', label: 'Differential' },
            { id: 'front_axle', label: 'Front Axle' },
            { id: 'cutting_edge', label: 'Cutting Edge' },
            { id: 'track', label: 'Track' },
            { id: 'bucket_teeth', label: 'Bucket Teeth' },
          ].map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                {...register(field.id as keyof InspectionFormData)}
              />
              <Label htmlFor={field.id} className="text-base">
                {field.label}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 mt-6 p-4 bg-muted rounded-lg">
          <Checkbox
            id="exterior_no_defects_found"
            {...register('exterior_no_defects_found')}
          />
          <Label htmlFor="exterior_no_defects_found" className="text-base font-semibold">
            No Defects Found
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderDefectsSection = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          Explanation of Defects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="explanation_of_defects">Explanation of Defects</Label>
          <Textarea
            {...register('explanation_of_defects')}
            id="explanation_of_defects"
            placeholder="Describe any defects or issues found during inspection..."
            className="input-mining min-h-24"
          />
        </div>

        <Button
          type="button"
          onClick={handlePhotoUpload}
          className="btn-mining flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Add Photos
        </Button>
      </CardContent>
    </Card>
  );

  const renderOperatorSignature = () => (
    <Card className="form-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">✍️</span>
          Operator Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="operator_signature_initial">Operator Signature</Label>
          <Input
            {...register('operator_signature_initial')}
            id="operator_signature_initial"
            placeholder="Click to capture signature"
            className="input-mining"
            onClick={handleSignature}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_initial">Date</Label>
          <Input
            {...register('date_initial')}
            id="date_initial"
            type="date"
            className="input-mining"
          />
        </div>
      </CardContent>
    </Card>
  );



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/operator-dashboard')}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Heavy Equipment Daily Inspection</h1>
              <p className="text-sm text-muted-foreground">
                {selectedEquipment.id} - Complete Form
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

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-6">
        {/* All Form Sections */}
        {renderBasicInformation()}
        {renderOperationalData()}
        {renderEngineSection()}
        {renderCabinSection()}
        {renderExteriorSection()}
        {renderDefectsSection()}
        {renderOperatorSignature()}

        {/* Submit Button - Sticky */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6">
          <div className="flex justify-between gap-4 max-w-4xl mx-auto">
            <Button
              type="button"
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
              type="submit"
              className="btn-mining flex-1 max-w-xs"
            >
              <FileText className="h-4 w-4 mr-2" />
              Submit Inspection
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InspectionForm;