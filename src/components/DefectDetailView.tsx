import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, Camera, Upload, Clock, User, Calendar,
  AlertTriangle, CheckCircle, Wrench, FileText
} from 'lucide-react';

interface DefectDetailProps {
  equipmentId: string;
  onClose: () => void;
  onStartRepair: () => void;
}

interface InspectionHistory {
  id: string;
  date: string;
  inspector: string;
  findings: string;
  photos: string[];
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

const mockInspectionHistory: InspectionHistory[] = [
  {
    id: 'I-001',
    date: '2024-01-21T14:30:00Z',
    inspector: 'John Operator',
    findings: 'Hydraulic leak detected in main cylinder - requires immediate attention',
    photos: ['photo1.jpg', 'photo2.jpg']
  },
  {
    id: 'I-002',
    date: '2024-01-15T10:15:00Z',
    inspector: 'Sarah Tech',
    findings: 'Minor oil seepage observed, monitoring required',
    photos: ['photo3.jpg']
  }
];

export const DefectDetailView: React.FC<DefectDetailProps> = ({ 
  equipmentId, 
  onClose, 
  onStartRepair 
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Defect Details</h1>
            <p className="text-muted-foreground">Equipment ID: {equipmentId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Equipment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Equipment ID</Label>
                <p className="font-medium">{mockEquipmentInfo.id}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Type & Model</Label>
                <p className="font-medium">{mockEquipmentInfo.type}</p>
                <p className="text-sm text-muted-foreground">{mockEquipmentInfo.model}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Current Status</Label>
                <Badge className={`${getStatusColor(mockEquipmentInfo.status)} flex items-center gap-1 w-fit`}>
                  {getStatusIcon(mockEquipmentInfo.status)}
                  {mockEquipmentInfo.status}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Last Inspection</Label>
                <p className="font-medium">
                  {new Date(mockEquipmentInfo.lastInspection).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Next Scheduled</Label>
                <p className="font-medium">
                  {new Date(mockEquipmentInfo.nextScheduled).toLocaleDateString()}
                </p>
              </div>

              <Button onClick={onStartRepair} className="w-full">
                <Wrench className="h-4 w-4 mr-2" />
                Start Repair
              </Button>
            </CardContent>
          </Card>

          {/* Inspection History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inspection History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInspectionHistory.map((inspection, index) => (
                  <Card key={inspection.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{inspection.id}</Badge>
                          {index === 0 && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(inspection.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{inspection.inspector}</span>
                          </div>
                          <p className="text-sm">{inspection.findings}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Photo Evidence ({inspection.photos.length})
                          </Label>
                          <div className="flex gap-2">
                            {inspection.photos.map((photo, photoIndex) => (
                              <div 
                                key={photoIndex}
                                className="w-12 h-12 bg-muted rounded cursor-pointer flex items-center justify-center hover:bg-muted/80"
                                onClick={() => setSelectedPhoto(photo)}
                              >
                                <Camera className="h-4 w-4" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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