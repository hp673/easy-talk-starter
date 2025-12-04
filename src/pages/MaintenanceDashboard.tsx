import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { DefectDetailView } from '@/components/DefectDetailView';
import { RepairDocumentation } from '@/components/RepairDocumentation';
import { MaintenanceHistory } from '@/components/MaintenanceHistory';
import { useToast } from '@/hooks/use-toast';
import SiteSwitcher from '@/components/SiteSwitcher';
import { 
  Wrench, AlertTriangle, Clock, CheckCircle, TrendingUp, 
  Users, Wifi, WifiOff, LogOut, Filter, Bell, History,
  Settings, Eye, FileText, QrCode, ClipboardCheck, HardHat,
  RefreshCw, Calendar, AlertCircle, Droplets, CloudRain,
  Fuel, Shield, FireExtinguisher
} from 'lucide-react';
import { QRScanActionSheet } from '@/components/QRScanActionSheet';

interface Ticket {
  id: string;
  equipmentId: string;
  equipmentType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Pending Parts';
  description: string;
  reportedBy: string;
  assignedTo: string;
  createdAt: string;
  estimatedHours: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'T-001',
    equipmentId: 'CAT-789C-001',
    equipmentType: 'Haul Truck',
    severity: 'Critical',
    status: 'In Progress',
    description: 'Hydraulic leak detected in main cylinder',
    reportedBy: 'John Operator',
    assignedTo: 'Mike Johnson',
    createdAt: '2024-01-22T08:30:00Z',
    estimatedHours: 4,
  },
  {
    id: 'T-002',
    equipmentId: 'KOM-PC5500-002',
    equipmentType: 'Excavator',
    severity: 'High',
    status: 'Open',
    description: 'Engine overheating during operation',
    reportedBy: 'Sarah Tech',
    assignedTo: 'Unassigned',
    createdAt: '2024-01-22T10:15:00Z',
    estimatedHours: 6,
  },
  {
    id: 'T-003',
    equipmentId: 'CAT-994K-003',
    equipmentType: 'Wheel Loader',
    severity: 'Medium',
    status: 'Pending Parts',
    description: 'Brake system warning light intermittent',
    reportedBy: 'John Operator',
    assignedTo: 'Lisa Chen',
    createdAt: '2024-01-21T14:20:00Z',
    estimatedHours: 3,
  },
  {
    id: 'T-004',
    equipmentId: 'HIT-EH5000AC-004',
    equipmentType: 'Haul Truck',
    severity: 'Low',
    status: 'Completed',
    description: 'Routine maintenance - oil change',
    reportedBy: 'System',
    assignedTo: 'Tom Wilson',
    createdAt: '2024-01-21T09:00:00Z',
    estimatedHours: 2,
  },
];

// Compliance forms data
const complianceForms = [
  { 
    id: 'MSHA001', 
    suite: 'MSHA', 
    title: 'Workplace Exam',
    description: 'Pre-shift workplace examination per 30 CFR 57.18002',
    frequency: 'daily',
    status: 'pending',
    dueDate: '2024-01-23',
    route: '/workplace-exams',
    icon: 'workplace',
    required: true,
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
  },
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

const MaintenanceDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'dashboard' | 'defect-detail' | 'repair-doc'>('dashboard');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [qrScanOpen, setQrScanOpen] = useState(false);
  const [activeFormFilter, setActiveFormFilter] = useState('msha');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      if (Math.random() > 0.8) {
        setTickets(prev => 
          prev.map(ticket => {
            if (ticket.status === 'Open' && Math.random() > 0.7) {
              return { ...ticket, status: 'In Progress' as const };
            }
            if (ticket.status === 'In Progress' && Math.random() > 0.9) {
              return { ...ticket, status: 'Completed' as const };
            }
            return ticket;
          })
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter tickets based on selected filters
  useEffect(() => {
    let filtered = tickets;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    if (severityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.severity === severityFilter);
    }
    setFilteredTickets(filtered);
  }, [tickets, statusFilter, severityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-destructive text-destructive-foreground';
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Completed': return 'bg-success text-success-foreground';
      case 'Pending Parts': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertTriangle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Pending Parts': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getFormIcon = (iconType: string) => {
    switch (iconType) {
      case 'workplace': return <ClipboardCheck className="h-5 w-5" />;
      case 'fire': return <FireExtinguisher className="h-5 w-5" />;
      case 'checklist': return <CheckCircle className="h-5 w-5" />;
      case 'droplets': return <Droplets className="h-5 w-5" />;
      case 'rain': return <CloudRain className="h-5 w-5" />;
      case 'fuel': return <Fuel className="h-5 w-5" />;
      case 'hardhat': return <HardHat className="h-5 w-5" />;
      case 'shield': return <Shield className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

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

  const criticalCount = tickets.filter(t => t.severity === 'Critical').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const completedCount = tickets.filter(t => t.status === 'Completed').length;

  const handleViewTicket = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
    setActiveView('defect-detail');
    setNotificationDrawerOpen(false);
  };

  const handleStartRepair = () => {
    setActiveView('repair-doc');
  };

  const handleCompleteRepair = () => {
    toast({
      title: "Ticket Closed",
      description: "Equipment status updated to Active",
    });
    setActiveView('dashboard');
  };

  const handleCloseViews = () => {
    setActiveView('dashboard');
    setSelectedEquipmentId('');
  };

  // Filter forms based on selected suite
  const filteredForms = complianceForms.filter(
    form => form.suite.toLowerCase() === activeFormFilter.toLowerCase()
  );

  // Handle different views
  if (activeView === 'defect-detail') {
    return (
      <DefectDetailView
        equipmentId={selectedEquipmentId}
        onClose={handleCloseViews}
        onStartRepair={handleStartRepair}
      />
    );
  }

  if (activeView === 'repair-doc') {
    return (
      <RepairDocumentation
        equipmentId={selectedEquipmentId}
        onClose={handleCloseViews}
        onComplete={handleCompleteRepair}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Wrench className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-rajdhani font-bold">Maintainer Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name} • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <SiteSwitcher />
            
            <Button 
              onClick={() => setQrScanOpen(true)}
              className="btn-mining"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1">
                2
              </Badge>
            </Button>
            
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
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Key Metrics - Combined Operator + Maintenance */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Operator Metrics */}
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">Equipment</p>
              </div>
              <p className="text-2xl font-bold">{assignedEquipment.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <p className="text-xs font-medium text-muted-foreground">Inspections Due</p>
              </div>
              <p className="text-2xl font-bold">4</p>
            </CardContent>
          </Card>

          {/* Maintenance Metrics */}
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="text-xs font-medium text-muted-foreground">Critical</p>
              </div>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="h-4 w-4 text-warning" />
                <p className="text-xs font-medium text-muted-foreground">In Progress</p>
              </div>
              <p className="text-2xl font-bold text-warning">{inProgressCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">Open Tickets</p>
              </div>
              <p className="text-2xl font-bold">{openCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <p className="text-xs font-medium text-muted-foreground">Completed</p>
              </div>
              <p className="text-2xl font-bold text-success">{completedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Inspections</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start btn-mining h-12"
                    onClick={() => setQrScanOpen(true)}
                  >
                    <QrCode className="h-5 w-5 mr-3" />
                    Scan Equipment QR Code
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12"
                    onClick={() => navigate('/equipment-selection')}
                  >
                    <ClipboardCheck className="h-5 w-5 mr-3" />
                    Start Equipment Inspection
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12"
                    onClick={() => navigate('/workplace-exams')}
                  >
                    <HardHat className="h-5 w-5 mr-3" />
                    Workplace Exam
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12"
                    onClick={() => setActiveTab('tickets')}
                  >
                    <Wrench className="h-5 w-5 mr-3" />
                    View Maintenance Tickets
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Active Maintenance Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tickets.filter(t => t.status !== 'Completed').slice(0, 3).map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewTicket(ticket.equipmentId)}
                      >
                        <div>
                          <div className="font-medium text-sm">{ticket.equipmentId}</div>
                          <div className="text-xs text-muted-foreground">{ticket.description.slice(0, 40)}...</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(ticket.severity)} variant="secondary">
                            {ticket.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={() => setActiveTab('tickets')}
                    >
                      View All Tickets →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inspections Tab - Operator Feature */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Forms by Suite</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Suite Selector */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Select Compliance Suite</label>
                  <Select value={activeFormFilter} onValueChange={setActiveFormFilter}>
                    <SelectTrigger className="w-full md:w-[300px] h-12 bg-background border-2">
                      <SelectValue placeholder="Choose a suite..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-2 z-50">
                      <SelectItem value="msha">
                        <div className="flex items-center gap-2">
                          <HardHat className="h-4 w-4" />
                          <span>MSHA - Mine Safety</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="construction">
                        <div className="flex items-center gap-2">
                          <HardHat className="h-4 w-4" />
                          <span>Construction - Site Safety</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Forms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredForms.map((form) => (
                    <Card key={form.id} className="hover:shadow-lg transition-shadow border">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-muted rounded-lg">
                                {getFormIcon(form.icon)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{form.title}</h3>
                                <Badge variant="outline" className="text-xs mt-1">{form.suite}</Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                          <Button 
                            className="w-full"
                            onClick={() => navigate(form.route)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Start Form
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab - Operator Feature */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedEquipment.map((equipment) => (
                    <div 
                      key={equipment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Wrench className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{equipment.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {equipment.id} • Last: {equipment.lastInspection}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getEquipmentStatusBadge(equipment.status)}
                        <Button 
                          size="sm"
                          onClick={() => navigate('/equipment-selection')}
                        >
                          Inspect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab - Maintenance Feature */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="input-mining">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Pending Parts">Pending Parts</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="input-mining">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket List */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Tickets ({filteredTickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1">{ticket.status}</span>
                            </Badge>
                            <Badge className={getSeverityColor(ticket.severity)}>{ticket.severity}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{ticket.estimatedHours}h estimated</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTicket(ticket.equipmentId)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-1">{ticket.equipmentId}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{ticket.equipmentType}</p>
                            <p className="text-sm">{ticket.description}</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Reported by:</span>
                              <span>{ticket.reportedBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Assigned to:</span>
                              <span>{ticket.assignedTo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab - Maintenance Feature */}
          <TabsContent value="history">
            <MaintenanceHistory userRole="maintainer" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onViewTicket={handleViewTicket}
      />

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

export default MaintenanceDashboard;
