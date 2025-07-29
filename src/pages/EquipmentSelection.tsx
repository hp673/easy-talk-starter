import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { QrCode, Search, Truck, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { useAuth } from '@/contexts/AuthContext';

// Mock equipment data
const mockEquipment = [
  { id: 'CAT-789C-001', make: 'Caterpillar', model: '789C', type: 'Haul Truck', location: 'Pit A' },
  { id: 'KOM-PC5500-002', make: 'Komatsu', model: 'PC5500-6', type: 'Excavator', location: 'Pit B' },
  { id: 'CAT-994K-003', make: 'Caterpillar', model: '994K', type: 'Wheel Loader', location: 'Pit A' },
  { id: 'HIT-EH5000AC-004', make: 'Hitachi', model: 'EH5000AC-3', type: 'Haul Truck', location: 'Pit C' },
  { id: 'LIE-T282C-005', make: 'Liebherr', model: 'T282C', type: 'Haul Truck', location: 'Pit B' },
];

const EquipmentSelection = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isOnline } = useOffline();
  const { user, logout } = useAuth();

  const filteredEquipment = mockEquipment.filter(eq =>
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQRScan = async () => {
    setLoading(true);
    setShowQRScanner(true);
    
    // Simulate QR scan delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto-select first equipment for demo
    const scannedEquipment = mockEquipment[0];
    setSelectedEquipment(scannedEquipment.id);
    setShowQRScanner(false);
    setLoading(false);
    
    toast({
      title: "QR Code Scanned",
      description: `Equipment ${scannedEquipment.id} selected successfully`,
    });
  };

  const handleProceed = () => {
    if (!selectedEquipment) {
      toast({
        title: "Equipment Required",
        description: "Please select equipment to proceed with inspection",
        variant: "destructive",
      });
      return;
    }

    const equipment = mockEquipment.find(eq => eq.id === selectedEquipment);
    // Store selected equipment in localStorage for the inspection form
    localStorage.setItem('selected_equipment', JSON.stringify(equipment));
    navigate('/inspection-form');
  };

  const selectedEquipmentData = mockEquipment.find(eq => eq.id === selectedEquipment);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="touch-target"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Equipment Selection</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name}
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
            
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* QR Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {showQRScanner ? (
                <div className="space-y-4">
                  <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center">
                    <div className="animate-pulse">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-muted-foreground">Scanning for equipment QR code...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Scan the QR code on your equipment to auto-populate details
                  </p>
                  <Button
                    onClick={handleQRScan}
                    className="btn-mining"
                    disabled={loading}
                  >
                    {loading ? 'Scanning...' : 'Start QR Scan'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scan Result Display - Only shown after successful scan */}
        {selectedEquipment && (
          <Card className="border-success bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <QrCode className="h-5 w-5" />
                Equipment Scanned Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="p-4 bg-success/10 rounded-lg">
                  <p className="text-lg font-semibold">{selectedEquipmentData?.id}</p>
                  <p className="text-muted-foreground">
                    {selectedEquipmentData?.make} {selectedEquipmentData?.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEquipmentData?.type} • {selectedEquipmentData?.location}
                  </p>
                </div>
                <Button
                  onClick={handleProceed}
                  className="btn-mining w-full"
                >
                  Start Inspection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default EquipmentSelection;