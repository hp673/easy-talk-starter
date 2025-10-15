import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  History,
  Calendar,
  RefreshCw
} from 'lucide-react';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const [activeFormFilter, setActiveFormFilter] = useState('all');

  // Mock compliance forms data
  const complianceForms = [
    { 
      id: 'WP001', 
      suite: 'Workplace', 
      title: 'Daily Site Workplace Examination',
      frequency: 'daily',
      status: 'pending',
      dueDate: '2024-01-23',
      route: '/workplace-exams'
    },
    { 
      id: 'TCQ001', 
      suite: 'TCEQ', 
      title: 'Air Quality Monitoring Report',
      frequency: 'weekly',
      status: 'due',
      dueDate: '2024-01-23',
      route: '/tceq-air-quality'
    },
    { 
      id: 'MSHA001', 
      suite: 'MSHA', 
      title: 'Underground Mine Inspection',
      frequency: 'daily',
      status: 'overdue',
      dueDate: '2024-01-22',
      route: '/msha-inspection'
    },
    { 
      id: 'WP002', 
      suite: 'Workplace', 
      title: 'Weekly Safety Checklist',
      frequency: 'weekly',
      status: 'pending',
      dueDate: '2024-01-25',
      route: '/workplace-safety'
    },
    { 
      id: 'TCQ002', 
      suite: 'TCEQ', 
      title: 'Stormwater Discharge Monthly',
      frequency: 'monthly',
      status: 'pending',
      dueDate: '2024-01-30',
      route: '/tceq-stormwater'
    },
  ];

  // Mock equipment data
  const assignedEquipment = [
    { id: 'EQ001', name: 'Excavator CAT 320', status: 'active', lastInspection: '2024-01-22' },
    { id: 'EQ002', name: 'Dump Truck Volvo A40G', status: 'maintenance', lastInspection: '2024-01-21' },
    { id: 'EQ003', name: 'Bulldozer CAT D8T', status: 'active', lastInspection: '2024-01-22' },
    { id: 'EQ004', name: 'Loader CAT 966M', status: 'defect', lastInspection: '2024-01-20' },
    { id: 'EQ005', name: 'Grader CAT 140M3', status: 'active', lastInspection: '2024-01-22' },
  ];

  const getSuiteBadge = (suite: string) => {
    switch (suite) {
      case 'Workplace':
        return <Badge className="bg-green-600 text-white hover:bg-green-700">{suite}</Badge>;
      case 'TCEQ':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">{suite}</Badge>;
      case 'MSHA':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">{suite}</Badge>;
      default:
        return <Badge variant="outline">{suite}</Badge>;
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return <RefreshCw className="h-4 w-4" />;
      case 'weekly':
        return <RefreshCw className="h-4 w-4" />;
      case 'monthly':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Pending</Badge>;
      case 'due':
        return <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">Due Today</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormCardBorderClass = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'border-red-500 border-2';
      case 'due':
        return 'border-yellow-500 border-2';
      default:
        return 'border';
    }
  };

  const filteredForms = activeFormFilter === 'all' 
    ? complianceForms 
    : complianceForms.filter(form => form.suite.toLowerCase() === activeFormFilter.toLowerCase());

  const getEquipmentStatusBadge = (status: string) => {
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

      {/* Active Forms / Compliance Forms Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Active Forms / Compliance Forms</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pending and due compliance forms across all suites
          </p>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={activeFormFilter} onValueChange={setActiveFormFilter} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="workplace">Workplace</TabsTrigger>
              <TabsTrigger value="tceq">TCEQ</TabsTrigger>
              <TabsTrigger value="msha">MSHA</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <Card key={form.id} className={`${getFormCardBorderClass(form.status)} hover:shadow-lg transition-shadow`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Suite Badge */}
                    <div className="flex items-center justify-between">
                      {getSuiteBadge(form.suite)}
                      {getStatusBadge(form.status)}
                    </div>

                    {/* Form Title */}
                    <div>
                      <h3 className="font-semibold text-mining-dark mb-1">
                        {form.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getFrequencyIcon(form.frequency)}
                        <span className="capitalize">{form.frequency}</span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="text-sm text-muted-foreground">
                      <span>Due: {form.dueDate}</span>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full"
                      variant={form.status === 'overdue' ? 'destructive' : 'default'}
                      onClick={() => navigate(form.route)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {form.status === 'overdue' ? 'Start Now' : 'Start Form'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredForms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active forms in this category</p>
            </div>
          )}
        </CardContent>
      </Card>

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
                    {getEquipmentStatusBadge(equipment.status)}
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