import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Camera, Upload, Clock, User, Calendar,
  AlertTriangle, CheckCircle, Wrench, FileText, Plus, X, Save, RotateCcw
} from 'lucide-react';

interface DefectDetailProps {
  equipmentId: string;
  onClose: () => void;
  onStartRepair: () => void;
}

interface InspectionData {
  equipmentId: string;
  date: string;
  inspector: string;
  basicInfo: {
    equipment: string;
    makeModel: string;
    date: string;
  };
  operationalData: {
    mineName: string;
    engineHoursBeginning: string;
    engineHoursEnding: string;
    fuelAdded: string;
  };
  preShiftEngine: {
    items: string[];
    noDefectsFound: boolean;
  };
  preShiftInCab: {
    items: string[];
    noDefectsFound: boolean;
  };
  preShiftExterior: {
    items: string[];
    noDefectsFound: boolean;
  };
  explanationOfDefects: string;
  operatorSignature: string;
  photos: string[];
}

interface MaintenanceReview {
  partsUsed: Array<{
    id: string;
    name: string;
    quantity: number;
    cost: number;
  }>;
  laborHours: number;
  repairPhotos: string[];
  qualityValidation: boolean;
  maintainerSignature: string;
  resolutionNotes: string;
}

interface EquipmentInfo {
  id: string;
  type: string;
  model: string;
  status: 'Active' | 'Under Maintenance' | 'Critical';
  lastInspection: string;
  nextScheduled: string;
}

const mockEquipmentInfo: EquipmentInfo = {
  id: 'CAT-789C-001',
  type: 'Haul Truck',
  model: 'Caterpillar 789C',
  status: 'Critical',
  lastInspection: '2024-01-21T14:30:00Z',
  nextScheduled: '2024-01-28T09:00:00Z'
};

const mockInspectionData: InspectionData = {
  equipmentId: 'CAT-789C-001',
  date: '2024-01-21T14:30:00Z',
  inspector: 'John Operator',
  basicInfo: {
    equipment: 'CAT-789C-001',
    makeModel: 'Caterpillar 789C',
    date: '2024-01-21'
  },
  operationalData: {
    mineName: 'Northern Mine Site',
    engineHoursBeginning: '1250',
    engineHoursEnding: '1258',
    fuelAdded: '150'
  },
  preShiftEngine: {
    items: ['Oil Level', 'Water Level', 'Hydraulic Leaks (Critical)', 'Fuel Level'],
    noDefectsFound: false
  },
  preShiftInCab: {
    items: ['Brakes (Park)', 'Horn', 'Gauges', 'Seat Belts'],
    noDefectsFound: true
  },
  preShiftExterior: {
    items: ['Suspension', 'Tires/Wheels', 'Head Lights', 'Safety Guards'],
    noDefectsFound: true
  },
  explanationOfDefects: 'Hydraulic leak detected in main cylinder - requires immediate attention. Fluid level dropping rapidly.',
  operatorSignature: 'John Operator - 2024-01-21 14:30',
  photos: ['defect_photo_1.jpg', 'defect_photo_2.jpg']
};

export const DefectDetailView: React.FC<DefectDetailProps> = ({ 
  equipmentId, 
  onClose, 
  onStartRepair 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [maintenanceReview, setMaintenanceReview] = useState<MaintenanceReview>({
    partsUsed: [],
    laborHours: 0,
    repairPhotos: [],
    qualityValidation: false,
    maintainerSignature: '',
    resolutionNotes: ''
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTicketComplete, setShowTicketComplete] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Under Maintenance': return 'bg-warning text-warning-foreground';
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Under Maintenance': return <Wrench className="h-4 w-4" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const addPart = () => {
    const newPart = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      cost: 0
    };
    setMaintenanceReview(prev => ({
      ...prev,
      partsUsed: [...prev.partsUsed, newPart]
    }));
  };

  const removePart = (id: string) => {
    setMaintenanceReview(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.filter(part => part.id !== id)
    }));
  };

  const updatePart = (id: string, field: string, value: any) => {
    setMaintenanceReview(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.map(part => 
        part.id === id ? { ...part, [field]: value } : part
      )
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => file.name);
      setMaintenanceReview(prev => ({
        ...prev,
        repairPhotos: [...prev.repairPhotos, ...newPhotos]
      }));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      setMaintenanceReview(prev => ({
        ...prev,
        maintainerSignature: signatureData
      }));
    }
  };

  const handleCloseTicket = () => {
    // Update equipment status to Active
    // Trigger notifications
    // Update historical records
    setShowTicketComplete(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const totalCost = maintenanceReview.partsUsed.reduce((sum, part) => sum + (part.quantity * part.cost), 0);

  if (showTicketComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ticket Closed Successfully</h2>
            <p className="text-muted-foreground mb-4">
              Equipment status updated to Active. Notifications sent to stakeholders.
            </p>
            <Button onClick={onClose} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Maintenance Review</h1>
            <p className="text-muted-foreground">Equipment ID: {equipmentId}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Operator's Inspection Form (Read-Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Operator's Inspection Form (Read-Only)
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                Completed by {mockInspectionData.inspector} on {new Date(mockInspectionData.date).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm text-muted-foreground">Equipment</Label>
                    <p className="font-medium">{mockInspectionData.basicInfo.equipment}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Make & Model</Label>
                    <p className="font-medium">{mockInspectionData.basicInfo.makeModel}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date</Label>
                    <p className="font-medium">{mockInspectionData.basicInfo.date}</p>
                  </div>
                </div>
              </div>

              {/* Operational Data */}
              <div>
                <h3 className="font-medium mb-3">Operational Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm text-muted-foreground">Mine Name</Label>
                    <p className="font-medium">{mockInspectionData.operationalData.mineName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Engine Hours (Start)</Label>
                    <p className="font-medium">{mockInspectionData.operationalData.engineHoursBeginning}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Engine Hours (End)</Label>
                    <p className="font-medium">{mockInspectionData.operationalData.engineHoursEnding}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Fuel Added (gal)</Label>
                    <p className="font-medium">{mockInspectionData.operationalData.fuelAdded}</p>
                  </div>
                </div>
              </div>

              {/* Pre-Shift Checks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Pre-Shift – Engine
                    {mockInspectionData.preShiftEngine.noDefectsFound ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </h3>
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    {mockInspectionData.preShiftEngine.items.map((item, index) => (
                      <div key={index} className={`text-sm ${item.includes('Critical') ? 'font-bold text-destructive' : ''}`}>
                        • {item}
                      </div>
                    ))}
                    {mockInspectionData.preShiftEngine.noDefectsFound && (
                      <div className="text-sm text-success font-medium">✓ No Defects Found</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Pre-Shift – In-Cab
                    {mockInspectionData.preShiftInCab.noDefectsFound ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </h3>
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    {mockInspectionData.preShiftInCab.items.map((item, index) => (
                      <div key={index} className="text-sm">• {item}</div>
                    ))}
                    {mockInspectionData.preShiftInCab.noDefectsFound && (
                      <div className="text-sm text-success font-medium">✓ No Defects Found</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Pre-Shift – Exterior
                    {mockInspectionData.preShiftExterior.noDefectsFound ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </h3>
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    {mockInspectionData.preShiftExterior.items.map((item, index) => (
                      <div key={index} className="text-sm">• {item}</div>
                    ))}
                    {mockInspectionData.preShiftExterior.noDefectsFound && (
                      <div className="text-sm text-success font-medium">✓ No Defects Found</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Explanation of Defects */}
              <div>
                <h3 className="font-medium mb-3">Explanation of Defects</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">{mockInspectionData.explanationOfDefects}</p>
                </div>
              </div>

              {/* Photos */}
              <div>
                <h3 className="font-medium mb-3">Photo Evidence ({mockInspectionData.photos.length})</h3>
                <div className="flex gap-2">
                  {mockInspectionData.photos.map((photo, index) => (
                    <div 
                      key={index}
                      className="w-16 h-16 bg-muted rounded cursor-pointer flex items-center justify-center hover:bg-muted/80"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <Camera className="h-6 w-6" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Operator Signature */}
              <div>
                <h3 className="font-medium mb-3">Operator Signature</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">{mockInspectionData.operatorSignature}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Maintenance Review Section (Editable) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Review & Repair Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parts Used */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Parts Used</h3>
                  <Button onClick={addPart} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Part
                  </Button>
                </div>
                
                {maintenanceReview.partsUsed.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No parts added yet. Click "Add Part" to begin.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {maintenanceReview.partsUsed.map((part) => (
                      <Card key={part.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div>
                            <Label htmlFor={`part-name-${part.id}`}>Part Name</Label>
                            <Input
                              id={`part-name-${part.id}`}
                              value={part.name}
                              onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                              placeholder="Enter part name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`part-quantity-${part.id}`}>Quantity</Label>
                            <Input
                              id={`part-quantity-${part.id}`}
                              type="number"
                              min="1"
                              value={part.quantity}
                              onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`part-cost-${part.id}`}>Unit Cost ($)</Label>
                            <Input
                              id={`part-cost-${part.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={part.cost}
                              onChange={(e) => updatePart(part.id, 'cost', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePart(part.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <div className="text-right">
                      <p className="text-lg font-medium">
                        Total Cost: ${totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Labor Hours */}
              <div>
                <Label htmlFor="labor-hours">Labor Hours</Label>
                <Input
                  id="labor-hours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={maintenanceReview.laborHours}
                  onChange={(e) => setMaintenanceReview(prev => ({
                    ...prev,
                    laborHours: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="Enter total labor hours"
                />
              </div>

              {/* Repair Photos */}
              <div>
                <Label>Repair Photos</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="repair-photos"
                  />
                  <label htmlFor="repair-photos">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photos
                      </span>
                    </Button>
                  </label>
                </div>
                
                {maintenanceReview.repairPhotos.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {maintenanceReview.repairPhotos.map((photo, index) => (
                      <div key={index} className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Camera className="h-6 w-6" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality Validation */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="quality-validation"
                  checked={maintenanceReview.qualityValidation}
                  onChange={(e) => setMaintenanceReview(prev => ({
                    ...prev,
                    qualityValidation: e.target.checked
                  }))}
                />
                <Label htmlFor="quality-validation">
                  I confirm that the repair work meets quality standards
                </Label>
              </div>

              {/* Maintainer Signature */}
              <div>
                <Label>Maintainer Signature</Label>
                <div className="mt-2 space-y-4">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border border-border rounded bg-background cursor-crosshair"
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={clearSignature}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button onClick={saveSignature}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Signature
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <Label htmlFor="resolution-notes">Resolution Notes</Label>
                <Textarea
                  id="resolution-notes"
                  value={maintenanceReview.resolutionNotes}
                  onChange={(e) => setMaintenanceReview(prev => ({
                    ...prev,
                    resolutionNotes: e.target.value
                  }))}
                  placeholder="Describe the completed repair work and final status..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Completion Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Repair</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCloseTicket}
                className="w-full"
                disabled={!maintenanceReview.maintainerSignature || !maintenanceReview.resolutionNotes}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Close Ticket & Mark Equipment Active
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will update the equipment status to Active and notify stakeholders.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Evidence</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Photo: {selectedPhoto}</p>
              <p className="text-sm text-muted-foreground mt-2">
                In a real implementation, this would display the actual photo
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};