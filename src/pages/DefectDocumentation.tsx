import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Camera, Upload, X, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';

interface PhotoData {
  id: string;
  file: File;
  preview: string;
  size: number;
  compressed: boolean;
}

const DefectDocumentation = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { isOnline, saveOfflineData, isSyncing } = useOffline();

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions to keep under 5MB
        const maxSize = 1920;
        let { width, height } = img;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > 5) {
      toast({
        title: "Too Many Photos",
        description: "Maximum 5 photos allowed per defect",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select only JPEG or PNG images",
          variant: "destructive",
        });
        continue;
      }

      const compressedFile = await compressImage(file);
      const preview = URL.createObjectURL(compressedFile);
      
      const photoData: PhotoData = {
        id: Date.now().toString() + Math.random(),
        file: compressedFile,
        preview,
        size: compressedFile.size,
        compressed: compressedFile.size < file.size,
      };
      
      setPhotos(prev => [...prev, photoData]);
    }
    
    setUploading(false);
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSave = () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description of the defect",
        variant: "destructive",
      });
      return;
    }

    const defectData = {
      description,
      severity,
      photos: photos.map(p => ({
        id: p.id,
        name: p.file.name,
        size: p.size,
        compressed: p.compressed,
      })),
      timestamp: new Date().toISOString(),
    };

    saveOfflineData('photos', defectData);
    
    toast({
      title: "Defect Documented",
      description: `${photos.length} photos and description saved ${isOnline ? 'online' : 'offline'}`,
    });

    navigate('/inspection-form');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/inspection-form')}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Defect Documentation</h1>
              <p className="text-sm text-muted-foreground">
                Document defects with photos and descriptions
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
            
            {isSyncing && (
              <div className="text-xs text-muted-foreground animate-pulse">
                Syncing...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Photo Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photo Documentation ({photos.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="space-y-4">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">Upload Defect Photos</p>
                  <p className="text-sm text-muted-foreground">
                    JPEG or PNG files, max 5MB each, up to 5 photos
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-mining"
                    disabled={uploading || photos.length >= 5}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Processing...' : 'Select Photos'}
                  </Button>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Photo Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={photo.preview}
                        alt="Defect photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <div className="mt-2 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {formatFileSize(photo.size)}
                        </span>
                        {photo.compressed && (
                          <span className="text-success flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Compressed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {photos.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Total size: {formatFileSize(totalSize)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Defect Details */}
        <Card>
          <CardHeader>
            <CardTitle>Defect Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                <SelectTrigger className="input-mining">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - Minor issue</SelectItem>
                  <SelectItem value="Medium">Medium - Moderate concern</SelectItem>
                  <SelectItem value="High">High - Significant problem</SelectItem>
                  <SelectItem value="Critical">Critical - Immediate action required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Defect Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed description of the defect, including location, nature of the problem, and any immediate actions taken..."
                className="input-mining min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/inspection-form')}
            variant="outline"
            className="flex-1 touch-target"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSave}
            className="btn-mining flex-1"
            disabled={!description.trim()}
          >
            Save Defect Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DefectDocumentation;
