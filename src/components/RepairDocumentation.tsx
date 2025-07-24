import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, Upload, Plus, Trash2, Clock, 
  CheckCircle, ArrowLeft, FileText, Wrench 
} from 'lucide-react';

interface RepairPhoto {
  id: string;
  file: File | null;
  caption: string;
  timestamp: string;
}

interface RepairData {
  partsUsed: Array<{ part: string; quantity: number; cost: number }>;
  laborHours: number;
  progress: number;
  notes: string;
  photos: RepairPhoto[];
}

interface RepairDocumentationProps {
  equipmentId: string;
  onClose: () => void;
  onComplete: () => void;
}

export const RepairDocumentation: React.FC<RepairDocumentationProps> = ({
  equipmentId,
  onClose,
  onComplete
}) => {
  const { toast } = useToast();
  const [repairData, setRepairData] = useState<RepairData>({
    partsUsed: [{ part: '', quantity: 1, cost: 0 }],
    laborHours: 0,
    progress: 0,
    notes: '',
    photos: []
  });

  const addPart = () => {
    setRepairData(prev => ({
      ...prev,
      partsUsed: [...prev.partsUsed, { part: '', quantity: 1, cost: 0 }]
    }));
  };

  const removePart = (index: number) => {
    setRepairData(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.filter((_, i) => i !== index)
    }));
  };

  const updatePart = (index: number, field: string, value: any) => {
    setRepairData(prev => ({
      ...prev,
      partsUsed: prev.partsUsed.map((part, i) => 
        i === index ? { ...part, [field]: value } : part
      )
    }));
  };

  const addPhoto = () => {
    const newPhoto: RepairPhoto = {
      id: `photo-${Date.now()}`,
      file: null,
      caption: '',
      timestamp: new Date().toISOString()
    };
    setRepairData(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
  };

  const updatePhoto = (photoId: string, field: string, value: any) => {
    setRepairData(prev => ({
      ...prev,
      photos: prev.photos.map(photo => 
        photo.id === photoId ? { ...photo, [field]: value } : photo
      )
    }));
  };

  const removePhoto = (photoId: string) => {
    setRepairData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleFileUpload = (photoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updatePhoto(photoId, 'file', file);
      toast({
        title: "Photo uploaded",
        description: `Added ${file.name} to repair documentation`,
      });
    }
  };

  const saveProgress = () => {
    // Save to offline storage
    const repairRecord = {
      equipmentId,
      timestamp: new Date().toISOString(),
      ...repairData
    };
    
    // In real implementation, save to localStorage or indexedDB
    localStorage.setItem(`repair-${equipmentId}-${Date.now()}`, JSON.stringify(repairRecord));
    
    toast({
      title: "Progress saved",
      description: "Repair documentation has been saved locally",
    });
  };

  const totalCost = repairData.partsUsed.reduce((sum, part) => sum + (part.quantity * part.cost), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Repair Documentation</h1>
              <p className="text-muted-foreground">Equipment: {equipmentId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={saveProgress}>
              <FileText className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button onClick={onComplete} disabled={repairData.progress < 100}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Repair
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Repair Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Completion Status</Label>
                  <span className="text-sm text-muted-foreground">{repairData.progress}%</span>
                </div>
                <Progress value={repairData.progress} className="h-2" />
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={repairData.progress}
                  onChange={(e) => setRepairData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Labor Hours</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={repairData.laborHours}
                    onChange={(e) => setRepairData(prev => ({ ...prev, laborHours: parseFloat(e.target.value) }))}
                    placeholder="Hours worked"
                  />
                </div>
                <div>
                  <Label>Total Parts Cost</Label>
                  <div className="bg-muted p-2 rounded text-sm font-medium">
                    ${totalCost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={repairData.progress === 100 ? 'bg-success' : 'bg-warning'}>
                    {repairData.progress === 100 ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parts Used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Parts Used</span>
              <Button variant="outline" size="sm" onClick={addPart}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {repairData.partsUsed.map((part, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded">
                  <Input
                    placeholder="Part name/number"
                    value={part.part}
                    onChange={(e) => updatePart(index, 'part', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={part.quantity}
                    onChange={(e) => updatePart(index, 'quantity', parseInt(e.target.value))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Unit cost"
                    value={part.cost}
                    onChange={(e) => updatePart(index, 'cost', parseFloat(e.target.value))}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePart(index)}
                    disabled={repairData.partsUsed.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photo Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Photo Documentation</span>
              <Button variant="outline" size="sm" onClick={addPhoto}>
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repairData.photos.map((photo) => (
                <Card key={photo.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Photo {photo.id.split('-')[1]}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(photo.id, e)}
                        className="hidden"
                        id={`file-${photo.id}`}
                      />
                      <label htmlFor={`file-${photo.id}`} className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {photo.file ? photo.file.name : 'Click to upload photo'}
                        </p>
                      </label>
                    </div>
                    
                    <Input
                      placeholder="Photo caption/description"
                      value={photo.caption}
                      onChange={(e) => updatePhoto(photo.id, 'caption', e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Repair Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Detailed description of work performed, challenges encountered, recommendations..."
              value={repairData.notes}
              onChange={(e) => setRepairData(prev => ({ ...prev, notes: e.target.value }))}
              rows={6}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};