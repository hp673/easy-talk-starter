import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, AlertTriangle, Wifi, WifiOff, Camera, FileText, CalendarIcon, ChevronDown } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import minetrakLogo from '@/assets/minetrak-logo-light-bg.png';

interface InspectionFormData {
  // Basic Information
  equipment: string;
  make_and_model: string;
  date: Date;
  inspection_time: string;
  operator_name: string;
  fuel_type: string;
  
  // Operational Data
  name_of_mine: string;
  mine_location: string;
  shift_type: string;
  engine_hours_beginning: number;
  engine_hours_ending: number;
  fuel_added_gallons: number;
  
  // Pre-Shift Engine
  engine_status: string;
  engine_temp: number;
  oil_pressure: number;
  engine_comments: string;
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
  
  const { register, watch, setValue, getValues, handleSubmit, control, formState: { errors } } = useForm<InspectionFormData>({
    defaultValues: {
      date: new Date(),
      inspection_time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      operator_name: user?.name || '',
      fuel_type: 'diesel',
      shift_type: 'day'
    }
  });
  
  // Get selected equipment from localStorage
  const selectedEquipment = JSON.parse(localStorage.getItem('selected_equipment') || '{}');
  
  const watchedValues = watch();
  
  // Constants for dropdowns
  const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid'];
  const shiftTypes = ['Day', 'Night', 'Swing'];
  const mineLocations = ['North Pit', 'South Pit', 'East Quarry', 'West Quarry', 'Processing Plant'];
  
  useEffect(() => {
    // Initialize form with equipment data
    if (selectedEquipment.id) {
      setValue('equipment', selectedEquipment.id);
      setValue('make_and_model', `${selectedEquipment.make} ${selectedEquipment.model}`);
      setValue('name_of_mine', selectedEquipment.location);
      setValue('mine_location', selectedEquipment.location);
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
          <Badge variant="secondary" className="ml-2">Read Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="equipment" className="text-base font-medium">Equipment ID</Label>
            <Input
              {...register('equipment')}
              id="equipment"
              className="input-mining bg-muted cursor-not-allowed"
              readOnly
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="make_and_model" className="text-base font-medium">Make and Model</Label>
            <Input
              {...register('make_and_model')}
              id="make_and_model"
              className="input-mining bg-muted cursor-not-allowed"
              readOnly
              disabled
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Inspection Date <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Inspection date is required' }}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "input-mining justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                        errors.date && "border-destructive ring-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-destructive text-sm font-medium">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspection_time" className="text-base font-medium">
              Inspection Time <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('inspection_time', { required: 'Inspection time is required' })}
              id="inspection_time"
              type="time"
              className={cn("input-mining", errors.inspection_time && "border-destructive ring-destructive")}
            />
            {errors.inspection_time && (
              <p className="text-destructive text-sm font-medium">{errors.inspection_time.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Operator Name <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="operator_name"
              control={control}
              rules={{ required: 'Operator name is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("input-mining", errors.operator_name && "border-destructive ring-destructive")}>
                    <SelectValue placeholder="Select operator" />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="john_doe">John Doe</SelectItem>
                    <SelectItem value="jane_smith">Jane Smith</SelectItem>
                    <SelectItem value="mike_wilson">Mike Wilson</SelectItem>
                    <SelectItem value="sarah_johnson">Sarah Johnson</SelectItem>
                    <SelectItem value={user?.name || 'current_user'}>{user?.name || 'Current User'}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.operator_name && (
              <p className="text-destructive text-sm font-medium">{errors.operator_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Fuel Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="fuel_type"
              control={control}
              rules={{ required: 'Fuel type is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("input-mining", errors.fuel_type && "border-destructive ring-destructive")}>
                    <SelectValue placeholder="Select fuel type" />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.toLowerCase()} value={fuel.toLowerCase()}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fuel_type && (
              <p className="text-destructive text-sm font-medium">{errors.fuel_type.message}</p>
            )}
          </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name_of_mine" className="text-base font-medium">
              Name of Mine <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('name_of_mine', { required: 'Mine name is required' })}
              id="name_of_mine"
              className={cn("input-mining", errors.name_of_mine && "border-destructive ring-destructive")}
              placeholder="Enter mine name"
            />
            {errors.name_of_mine && (
              <p className="text-destructive text-sm font-medium">{errors.name_of_mine.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Mine Location <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="mine_location"
              control={control}
              rules={{ required: 'Mine location is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("input-mining", errors.mine_location && "border-destructive ring-destructive")}>
                    <SelectValue placeholder="Select location" />
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {mineLocations.map((location) => (
                      <SelectItem key={location.toLowerCase().replace(' ', '_')} value={location.toLowerCase().replace(' ', '_')}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.mine_location && (
              <p className="text-destructive text-sm font-medium">{errors.mine_location.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            Shift Type <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="shift_type"
            control={control}
            rules={{ required: 'Shift type is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={cn("input-mining", errors.shift_type && "border-destructive ring-destructive")}>
                  <SelectValue placeholder="Select shift type" />
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {shiftTypes.map((shift) => (
                    <SelectItem key={shift.toLowerCase()} value={shift.toLowerCase()}>
                      {shift} Shift
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.shift_type && (
            <p className="text-destructive text-sm font-medium">{errors.shift_type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="engine_hours_beginning" className="text-base font-medium">
              Engine Hours Beginning <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('engine_hours_beginning', { 
                required: 'Beginning hours required',
                valueAsNumber: true,
                min: { value: 0, message: 'Hours must be positive' }
              })}
              id="engine_hours_beginning"
              type="number"
              step="0.1"
              min="0"
              className={cn("input-mining", errors.engine_hours_beginning && "border-destructive ring-destructive")}
              placeholder="0.0"
            />
            {errors.engine_hours_beginning && (
              <p className="text-destructive text-sm font-medium">{errors.engine_hours_beginning.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="engine_hours_ending" className="text-base font-medium">
              Engine Hours Ending <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register('engine_hours_ending', { 
                required: 'Ending hours required',
                valueAsNumber: true,
                min: { value: 0, message: 'Hours must be positive' },
                validate: (value) => {
                  const beginning = watchedValues.engine_hours_beginning;
                  if (beginning && value < beginning) {
                    return 'Ending hours must be greater than beginning hours';
                  }
                  return true;
                }
              })}
              id="engine_hours_ending"
              type="number"
              step="0.1"
              min="0"
              className={cn("input-mining", errors.engine_hours_ending && "border-destructive ring-destructive")}
              placeholder="0.0"
            />
            {errors.engine_hours_ending && (
              <p className="text-destructive text-sm font-medium">{errors.engine_hours_ending.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_added_gallons" className="text-base font-medium">Fuel Added (Gallons)</Label>
          <Input
            {...register('fuel_added_gallons', { 
              valueAsNumber: true,
              min: { value: 0, message: 'Fuel amount must be positive' }
            })}
            id="fuel_added_gallons"
            type="number"
            step="0.1"
            min="0"
            className={cn("input-mining", errors.fuel_added_gallons && "border-destructive ring-destructive")}
            placeholder="0.0"
          />
          {errors.fuel_added_gallons && (
            <p className="text-destructive text-sm font-medium">{errors.fuel_added_gallons.message}</p>
          )}
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
      <CardContent className="space-y-6">
        {/* Engine Status Dropdown */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Overall Engine Status <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="engine_status"
            control={control}
            rules={{ required: 'Engine status is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={cn("input-mining", errors.engine_status && "border-destructive ring-destructive")}>
                  <SelectValue placeholder="Select engine status" />
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="excellent" className="text-success font-medium">
                    ✅ Excellent
                  </SelectItem>
                  <SelectItem value="good" className="text-success">
                    Good
                  </SelectItem>
                  <SelectItem value="fair" className="text-warning font-medium">
                    ⚠️ Fair
                  </SelectItem>
                  <SelectItem value="poor" className="text-warning font-bold">
                    ⚠️ Poor
                  </SelectItem>
                  <SelectItem value="critical" className="text-destructive font-bold bg-destructive/10 border border-destructive/20">
                    🚨 Critical - Do Not Operate
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.engine_status && (
            <p className="text-destructive text-sm font-medium">{errors.engine_status.message}</p>
          )}
        </div>

        {/* Engine Temperature */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="engine_temp" className="text-base font-medium">Engine Temperature (°F)</Label>
            <Input
              {...register('engine_temp', { 
                valueAsNumber: true,
                min: { value: 32, message: 'Temperature too low' },
                max: { value: 250, message: 'Temperature too high - check cooling system' }
              })}
              id="engine_temp"
              type="number"
              min="32"
              max="250"
              className={cn("input-mining", errors.engine_temp && "border-destructive ring-destructive")}
              placeholder="Operating temp"
            />
            {errors.engine_temp && (
              <p className="text-destructive text-sm font-medium">{errors.engine_temp.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="oil_pressure" className="text-base font-medium">Oil Pressure (PSI)</Label>
            <Input
              {...register('oil_pressure', { 
                valueAsNumber: true,
                min: { value: 10, message: 'Oil pressure too low - critical' },
                max: { value: 80, message: 'Oil pressure too high' }
              })}
              id="oil_pressure"
              type="number"
              min="10"
              max="80"
              className={cn("input-mining", errors.oil_pressure && "border-destructive ring-destructive")}
              placeholder="PSI"
            />
            {errors.oil_pressure && (
              <p className="text-destructive text-sm font-medium">{errors.oil_pressure.message}</p>
            )}
          </div>
        </div>

        {/* Checkbox Grid for Engine Components */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Engine Component Inspection</Label>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            {[
              { id: 'oil_level', label: 'Oil Level', tooltip: 'Check dipstick reading' },
              { id: 'water_level', label: 'Coolant Level', tooltip: 'Check radiator and overflow tank' },
              { id: 'wiring', label: 'Wiring', tooltip: 'Inspect for damage or corrosion' },
              { id: 'generator', label: 'Generator/Alternator', tooltip: 'Check charging system' },
              { id: 'starter', label: 'Starter', tooltip: 'Listen for unusual sounds' },
              { id: 'battery', label: 'Battery', tooltip: 'Check terminals and charge level' },
              { id: 'fuel_level', label: 'Fuel Level', tooltip: 'Verify adequate fuel supply' },
              { id: 'exhaust_sys', label: 'Exhaust System', tooltip: 'Check for leaks and damage' },
              { id: 'oil_leaks', label: 'Oil Leaks', critical: true, tooltip: 'Critical - Check entire engine bay' },
              { id: 'hyd_leaks', label: 'Hydraulic Leaks', critical: true, tooltip: 'Critical - Check all hydraulic lines' },
              { id: 'fuel_leaks', label: 'Fuel Leaks', tooltip: 'Check fuel lines and connections' },
              { id: 'low_power', label: 'Low Power', tooltip: 'Engine lacks normal power output' },
              { id: 'engine_other', label: 'Other Issues', tooltip: 'Any additional concerns' },
            ].map((field: any) => (
              <div key={field.id} className="flex items-center space-x-3 p-2 rounded hover:bg-background/50 transition-colors">
                <Checkbox
                  id={field.id}
                  {...register(field.id as keyof InspectionFormData)}
                  className={`touch-target ${field.critical ? 'data-[state=checked]:bg-destructive data-[state=checked]:border-destructive' : ''}`}
                />
                <Label 
                  htmlFor={field.id} 
                  className={`text-base cursor-pointer flex-1 ${field.critical ? 'font-bold text-destructive' : ''}`}
                  title={field.tooltip}
                >
                  {field.label}
                  {field.critical && ' ⚠️'}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* No Defects Found */}
        <div className="flex items-center space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
          <Checkbox
            id="engine_no_defects_found"
            {...register('engine_no_defects_found')}
            className="touch-target data-[state=checked]:bg-success data-[state=checked]:border-success"
          />
          <Label htmlFor="engine_no_defects_found" className="text-base font-semibold text-success-foreground cursor-pointer">
            ✅ No Defects Found - Engine Operating Normally
          </Label>
        </div>

        {/* Additional Comments */}
        <div className="space-y-2">
          <Label htmlFor="engine_comments" className="text-base font-medium">Additional Engine Comments</Label>
          <Textarea
            {...register('engine_comments')}
            id="engine_comments"
            placeholder="Any additional observations about engine performance, unusual sounds, vibrations, etc..."
            className="input-mining min-h-20 resize-y"
          />
        </div>

        {/* Critical Defect Warning */}
        {criticalDefectDetected && (
          <div className="bg-destructive/10 border-2 border-destructive text-destructive p-6 rounded-lg animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-bold">⚠️ EQUIPMENT LOCKOUT ⚠️</h3>
                <p className="text-sm">Critical defect detected - Immediate action required</p>
              </div>
            </div>
            <p className="text-sm bg-destructive/20 p-3 rounded">
              <strong>STOP:</strong> Equipment must not be operated until critical defects are repaired and cleared by maintenance personnel.
            </p>
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
            <img 
              src={minetrakLogo} 
              alt="MineTrak" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold font-rajdhani uppercase tracking-wide">Heavy Equipment Daily Inspection</h1>
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