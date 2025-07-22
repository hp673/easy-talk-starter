import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, RotateCcw, Check, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useAuth } from '@/contexts/AuthContext';

const SignatureCapture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  const navigate = useNavigate();
  const { isOnline, saveOfflineData } = useOffline();
  const { user } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;

    // Set drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setLastPoint(pos);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const currentPos = getEventPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    setLastPoint(currentPos);
    setHasSignature(true);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      toast({
        title: "No Signature",
        description: "Please provide a signature before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Check file size (should be < 1MB)
        if (blob.size > 1024 * 1024) {
          toast({
            title: "Signature Too Large",
            description: "Please provide a simpler signature",
            variant: "destructive",
          });
          return;
        }

        const signatureData = {
          operator: user?.name || 'Unknown',
          timestamp: new Date().toISOString(),
          size: blob.size,
          type: blob.type,
        };

        saveOfflineData('signatures', signatureData);

        toast({
          title: "Signature Captured",
          description: `Signature saved ${isOnline ? 'online' : 'offline'} successfully`,
        });

        navigate('/inspection-form');
      }, 'image/png', 0.8);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save signature. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let nonWhitePixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r < 255 || g < 255 || b < 255) {
        nonWhitePixels++;
      }
    }

    // Require minimum number of drawn pixels
    return nonWhitePixels > 100;
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
              onClick={() => navigate('/inspection-form')}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Signature Capture</h1>
              <p className="text-sm text-muted-foreground">
                Sign to confirm inspection completion
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
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Signature Pad */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Signature</CardTitle>
            <p className="text-sm text-muted-foreground">
              Please sign below to confirm that you have completed the equipment inspection. 
              Operator: <strong>{user?.name}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-border rounded-lg p-4 bg-card">
              <canvas
                ref={canvasRef}
                className="w-full max-w-full h-64 border border-border rounded bg-white cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
              />
              
              <div className="mt-4 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Draw your signature above using mouse or touch
                </p>
                <div className="text-xs text-muted-foreground">
                  Signature will be saved as PNG format (&lt; 1MB)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Status */}
        {hasSignature && (
          <Card className={validateSignature() ? "border-success" : "border-warning"}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                {validateSignature() ? (
                  <>
                    <Check className="h-5 w-5 text-success" />
                    <span className="text-success font-medium">Valid signature detected</span>
                  </>
                ) : (
                  <>
                    <div className="h-5 w-5 rounded-full bg-warning" />
                    <span className="text-warning font-medium">
                      Signature too simple - please add more detail
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={clearSignature}
            variant="outline"
            className="flex-1 touch-target"
            disabled={!hasSignature}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button
            onClick={saveSignature}
            className="btn-mining flex-1"
            disabled={!hasSignature || !validateSignature()}
          >
            <Check className="h-4 w-4 mr-2" />
            Save Signature
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-medium">Signature Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use your finger or stylus on touch devices</li>
                <li>Use mouse on desktop computers</li>
                <li>Signature must be clearly visible and detailed</li>
                <li>Final signature will be saved as PNG image</li>
                <li>File size must be under 1MB</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignatureCapture;