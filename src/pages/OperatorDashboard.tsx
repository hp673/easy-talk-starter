import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  LogOut, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  Wrench, 
  AlertTriangle,
  Clock,
  Upload,
  AlertCircle,
  History
} from 'lucide-react';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  // Mock equipment data
  const assignedEquipment = [
    { id: 'EQ001', name: 'Excavator CAT 320', status: 'active', lastInspection: '2024-01-22' },
    { id: 'EQ002', name: 'Dump Truck Volvo A40G', status: 'maintenance', lastInspection: '2024-01-21' },
    { id: 'EQ003', name: 'Bulldozer CAT D8T', status: 'active', lastInspection: '2024-01-22' },
    { id: 'EQ004', name: 'Loader CAT 966M', status: 'defect', lastInspection: '2024-01-20' },
    { id: 'EQ005', name: 'Grader CAT 140M3', status: 'active', lastInspection: '2024-01-22' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-600 text-white hover:bg-yellow-700"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'defect':
        return <Badge className="bg-red-600 text-white hover:bg-red-700"><AlertTriangle className="h-3 w-3 mr-1" />Defect</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleStartInspection = () => {
    navigate('/equipment-selection');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mining-dark">MineTrak Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center">
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
          
          {/* Logout Button */}
          <Button variant="outline" onClick={handleLogout} className="btn-secondary">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">3</p>
                <p className="text-sm text-muted-foreground">Inspected Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">2</p>
                <p className="text-sm text-muted-foreground">Pending Sync</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">1</p>
                <p className="text-sm text-muted-foreground">Critical Defects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <History className="h-12 w-12 mx-auto text-primary" />
              <div>
                <h3 className="font-semibold">Maintenance History</h3>
                <p className="text-sm text-muted-foreground">
                  View past inspections and repairs
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/maintenance-history')}
              >
                View History
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Upload className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">5</p>
                <p className="text-sm text-muted-foreground">Total Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <div className="mb-6">
        <Button 
          onClick={handleStartInspection}
          className="btn-mining h-14 text-lg px-8"
        >
          <QrCode className="h-6 w-6 mr-3" />
          Start New Inspection
        </Button>
      </div>

      {/* Equipment List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Assigned Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedEquipment.map((equipment) => (
              <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-mining-dark">{equipment.name}</h3>
                    {getStatusBadge(equipment.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>ID: {equipment.id}</span>
                    <span>Last Inspection: {equipment.lastInspection}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/inspection-history?equipment=${equipment.id}`)}
                    className="btn-secondary"
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/inspection-form?equipment=${equipment.id}&reopen=true`)}
                    className="btn-secondary"
                  >
                    Reopen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorDashboard;