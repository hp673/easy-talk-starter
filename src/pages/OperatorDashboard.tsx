import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SiteSwitcher from '@/components/SiteSwitcher';
import { QRScanActionSheet } from '@/components/QRScanActionSheet';
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
  RefreshCw,
  FileText,
  Droplets,
  HardHat,
  Shield,
  Fuel,
  CloudRain,
  FireExtinguisher,
  ClipboardCheck,
  Save,
  CloudUpload,
  Star
} from 'lucide-react';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const [activeFormFilter, setActiveFormFilter] = useState('msha');
  const [qrScanOpen, setQrScanOpen] = useState(false);

  // Compliance forms data - MVP forms only (done/included)
  const complianceForms = [
    // MSHA Suite - Available
    { 
      id: 'MSHA001', 
      suite: 'MSHA', 
      title: 'Workplace Exam',
      description: 'Pre-shift workplace examination per 30 CFR 57.18002',
      frequency: 'daily',
      status: 'in-progress',
      dueDate: '2024-01-23',
      route: '/workplace-exams',
      icon: 'workplace',
      required: true,
      subscriptionStatus: 'included',
      implementationStatus: 'done'
    },
    { 
      id: 'MSHA002', 
      suite: 'MSHA', 
      title: 'Equipment Inspection',
      description: 'Mobile equipment pre-operational inspection',
      frequency: 'daily',
      status: 'pending',
      dueDate: '2024-01-23',
      route: '/equipment-selection',
      icon: 'checklist',
      required: true,
      subscriptionStatus: 'included',
      implementationStatus: 'done'
    },
    
    // Construction Suite - Available
    { 
      id: 'CONST001', 
      suite: 'Construction', 
      title: 'Equipment Inspection',
      description: 'Construction equipment pre-operational check',
      frequency: 'daily',
      status: 'pending',
      dueDate: '2024-01-23',
      route: '/equipment-selection',
      icon: 'hardhat',
      required: true,
      subscriptionStatus: 'included',
      implementationStatus: 'done'
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
      case 'MSHA':
        return <Badge className="bg-orange-600 text-white hover:bg-orange-700">{suite}</Badge>;
      case 'TCEQ':
        return <Badge className="bg-cyan-600 text-white hover:bg-cyan-700">{suite}</Badge>;
      case 'Construction':
        return <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">{suite}</Badge>;
      case 'Safety':
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">{suite}</Badge>;
      default:
        return <Badge variant="outline">{suite}</Badge>;
    }
  };

  const getSuiteInfo = (suite: string) => {
    switch (suite) {
      case 'MSHA':
        return {
          title: 'MSHA – Mine Safety Compliance Forms',
          tagline: 'Paperless mine inspections with MSHA-ready records.',
          description: 'Digital Inspection Solutions for MSHA Compliance',
          color: 'border-orange-200 bg-orange-50'
        };
      case 'TCEQ':
        return {
          title: 'TCEQ – Environmental Compliance Forms',
          tagline: 'Stormwater & wastewater compliance—captured, scheduled, audit-ready.',
          description: 'Paperless Stormwater & Wastewater Compliance',
          color: 'border-cyan-200 bg-cyan-50'
        };
      case 'Construction':
        return {
          title: 'Construction – Site Safety Forms',
          tagline: 'Jobsite safety and quality forms—standardized, searchable, defensible.',
          description: 'Field-Ready Forms for Safer Jobsites',
          color: 'border-yellow-200 bg-yellow-50'
        };
      case 'Safety':
        return {
          title: 'Safety Suite – General Workplace Safety',
          tagline: 'Track Smarter. Work Safer.',
          description: 'Cross-industry safety and compliance capabilities',
          color: 'border-emerald-200 bg-emerald-50'
        };
      default:
        return {
          title: 'Compliance Forms',
          tagline: '',
          description: '',
          color: 'border-gray-200 bg-gray-50'
        };
    }
  };

  const getFormIcon = (iconType: string) => {
    switch (iconType) {
      case 'workplace':
        return <ClipboardCheck className="h-5 w-5" />;
      case 'fire':
        return <FireExtinguisher className="h-5 w-5" />;
      case 'checklist':
        return <CheckCircle className="h-5 w-5" />;
      case 'droplets':
        return <Droplets className="h-5 w-5" />;
      case 'rain':
        return <CloudRain className="h-5 w-5" />;
      case 'fuel':
        return <Fuel className="h-5 w-5" />;
      case 'hardhat':
        return <HardHat className="h-5 w-5" />;
      case 'shield':
        return <Shield className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
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
      case 'submitted':
        return <Badge className="bg-green-600 text-white hover:bg-green-700"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-blue-600 text-blue-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700"><RefreshCw className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600 text-white hover:bg-red-700"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormCardBorderClass = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'border-red-500 border-2';
      case 'in-progress':
        return 'border-blue-400 border-2';
      default:
        return 'border';
    }
  };

  // Filter forms based on selected suite
  const filteredForms = complianceForms.filter(
    form => form.suite.toLowerCase() === activeFormFilter.toLowerCase()
  );

  // Get available suites (only suites with available forms)
  const availableSuites = Array.from(new Set(complianceForms.map(form => form.suite)));

  const currentSuiteInfo = getSuiteInfo(activeFormFilter.charAt(0).toUpperCase() + activeFormFilter.slice(1));

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-mining-dark">MineTrak Dashboard</h1>
          <p className="text-sm text-muted-foreground italic">From Paper to Precision. Digitizing Daily Inspections.</p>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Site Switcher */}
          <SiteSwitcher />
          
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

      {/* Priority Cards Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-mining-dark">Priority Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Your Equipment</h3>
              </div>
              <p className="text-3xl font-bold text-mining-dark mb-1">5</p>
              <p className="text-sm text-muted-foreground">Assigned vehicles</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Due Today</h3>
              </div>
              <p className="text-3xl font-bold text-mining-dark mb-1">4</p>
              <p className="text-sm text-muted-foreground">Inspections pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Critical Issues</h3>
              </div>
              <p className="text-3xl font-bold text-mining-dark mb-1">1</p>
              <p className="text-sm text-muted-foreground">Equipment defects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ClipboardCheck className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Workplace Exam</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => navigate('/workplace-exams')}
              >
                Start Evaluation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mb-6">
        <Button 
          onClick={() => setQrScanOpen(true)}
          className="btn-mining h-14 text-lg px-8"
        >
          <QrCode className="h-6 w-6 mr-3" />
          Scan QR Code
        </Button>
      </div>

      {/* Compliance Forms Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Compliance Forms by Suite</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Industry-specific compliance forms organized by regulatory suite
          </p>
        </CardHeader>
        <CardContent>
          {/* Suite Selector Dropdown */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Compliance Suite</label>
            <Select value={activeFormFilter} onValueChange={setActiveFormFilter}>
              <SelectTrigger className="w-full md:w-[300px] h-12 bg-background border-2">
                <SelectValue placeholder="Choose a suite..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-2 z-50">
                <SelectItem value="msha" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4" />
                    <span>MSHA - Mine Safety</span>
                  </div>
                </SelectItem>
                <SelectItem value="construction" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4" />
                    <span>Construction - Site Safety</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Suite Info Banner */}
          <div className={`p-4 rounded-lg border-2 mb-6 ${currentSuiteInfo.color}`}>
            <h3 className="font-semibold text-lg mb-1">{currentSuiteInfo.title}</h3>
            <p className="text-sm font-medium text-primary mb-1">{currentSuiteInfo.tagline}</p>
            <p className="text-sm text-muted-foreground">{currentSuiteInfo.description}</p>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <Card key={form.id} className={`hover:shadow-lg transition-shadow ${getFormCardBorderClass(form.status)}`}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Header with Icon and Status Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getFormIcon(form.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-mining-dark">
                            {form.title}
                          </h3>
                        </div>
                      </div>
                      {getStatusBadge(form.status)}
                    </div>

                    {/* Form Description */}
                    <p className="text-sm text-muted-foreground">
                      {form.description}
                    </p>

                    {/* Frequency Badge */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getFrequencyIcon(form.frequency)}
                      <span className="capitalize">{form.frequency} Inspection</span>
                      {form.required && (
                        <Badge variant="outline" className="ml-auto text-xs border-red-300 text-red-700">
                          Required
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full"
                      onClick={() => navigate(form.route)}
                    >
                      {form.status === 'in-progress' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Continue Form
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Start Form
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredForms.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No active forms available for this suite</p>
              <p className="text-sm mt-1">Additional compliance forms coming soon</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Items Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-mining-dark">Additional Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Save className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Drafts</h3>
              </div>
              <p className="text-2xl font-bold text-mining-dark mb-1">3</p>
              <p className="text-sm text-muted-foreground mb-3">Saved forms</p>
              <Button variant="outline" size="sm" className="w-full">
                View Drafts
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CloudUpload className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">Outbox</h3>
              </div>
              <p className="text-2xl font-bold text-mining-dark mb-1">2</p>
              <p className="text-sm text-muted-foreground mb-3">Pending sync</p>
              <Button variant="outline" size="sm" className="w-full">
                Sync Now
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <History className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-mining-dark">History</h3>
              </div>
              <p className="text-2xl font-bold text-mining-dark mb-1">47</p>
              <p className="text-sm text-muted-foreground mb-3">Past inspections</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/maintenance-history')}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
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

      {/* QR Scan Action Sheet */}
      <QRScanActionSheet
        open={qrScanOpen}
        onOpenChange={setQrScanOpen}
        equipmentId="CAT-789C-001"
        equipmentName="Haul Truck CAT 789C"
        category="Haul Truck"
        siteName="North Mining Site"
        status="Active"
      />
    </div>
  );
};

export default OperatorDashboard;