import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { DefectDetailView } from '@/components/DefectDetailView';
import { RepairDocumentation } from '@/components/RepairDocumentation';
import { MaintenanceHistory } from '@/components/MaintenanceHistory';
import { MaintainerSidebar } from '@/components/MaintainerSidebar';
import { useToast } from '@/hooks/use-toast';
import SiteSwitcher from '@/components/SiteSwitcher';
import { 
  Wrench, AlertTriangle, Clock, CheckCircle, 
  Wifi, WifiOff, Filter, Eye, FileText, QrCode, ClipboardCheck, HardHat,
  RefreshCw, Calendar, AlertCircle, Droplets, CloudRain,
  Fuel, Shield, FireExtinguisher, TrendingUp, Package, MessageSquare
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

const complianceForms = [
  { 
    id: 'MSHA001', 
    suite: 'MSHA', 
    title: 'Workplace Exam',
    description: 'Pre-shift workplace examination per 30 CFR 57.18002',
    frequency: 'daily',
    status: 'pending',
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
    route: '/equipment-selection',
    icon: 'hardhat',
    required: true,
  },
];

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
  const [activeView, setActiveView] = useState<'dashboard' | 'defect-detail' | 'repair-doc'>('dashboard');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [qrScanOpen, setQrScanOpen] = useState(false);
  const [activeFormFilter, setActiveFormFilter] = useState('msha');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setTickets(prev => 
          prev.map(ticket => {
            if (ticket.status === 'Open' && Math.random() > 0.7) {
              return { ...ticket, status: 'In Progress' as const };
            }
            return ticket;
          })
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getFormIcon = (iconType: string) => {
    switch (iconType) {
      case 'workplace': return <ClipboardCheck className="h-5 w-5" />;
      case 'fire': return <FireExtinguisher className="h-5 w-5" />;
      case 'checklist': return <CheckCircle className="h-5 w-5" />;
      case 'hardhat': return <HardHat className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getEquipmentStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning text-warning-foreground"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'defect':
        return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Defect</Badge>;
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
  };

  const handleStartRepair = () => {
    setActiveView('repair-doc');
  };

  const handleCompleteRepair = () => {
    toast({ title: "Ticket Closed", description: "Equipment status updated to Active" });
    setActiveView('dashboard');
  };

  const handleCloseViews = () => {
    setActiveView('dashboard');
    setSelectedEquipmentId('');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'notifications') {
      setNotificationDrawerOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const filteredForms = complianceForms.filter(
    form => form.suite.toLowerCase() === activeFormFilter.toLowerCase()
  );

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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Open Tickets</p>
                      <p className="text-2xl font-bold">{openCount}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-warning">{inProgressCount}</p>
                    </div>
                    <RefreshCw className="h-8 w-8 text-warning/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Critical</p>
                      <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-success">{completedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-success/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start h-11" variant="outline" onClick={() => navigate('/equipment-selection')}>
                    <ClipboardCheck className="h-4 w-4 mr-3" />
                    Start Equipment Inspection
                  </Button>
                  <Button className="w-full justify-start h-11" variant="outline" onClick={() => navigate('/workplace-exams')}>
                    <HardHat className="h-4 w-4 mr-3" />
                    Workplace Exam
                  </Button>
                  <Button className="w-full justify-start h-11" variant="outline" onClick={() => setActiveTab('tickets')}>
                    <Wrench className="h-4 w-4 mr-3" />
                    View Work Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Active Work Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tickets.filter(t => t.status !== 'Completed').slice(0, 4).map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleViewTicket(ticket.equipmentId)}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono text-xs">{ticket.id}</Badge>
                          <div>
                            <p className="text-sm font-medium">{ticket.equipmentId}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{ticket.description}</p>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(ticket.severity)} variant="secondary">
                          {ticket.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Work Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <SelectTrigger><SelectValue /></SelectTrigger>
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Work Orders ({filteredTickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1">{ticket.status}</span>
                            </Badge>
                            <Badge className={getSeverityColor(ticket.severity)}>{ticket.severity}</Badge>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket.equipmentId)}>
                            <Eye className="h-4 w-4 mr-1" />View
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium">{ticket.equipmentId}</h3>
                            <p className="text-sm text-muted-foreground">{ticket.equipmentType}</p>
                            <p className="text-sm mt-1">{ticket.description}</p>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Assigned:</span><span>{ticket.assignedTo}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Est. Hours:</span><span>{ticket.estimatedHours}h</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Created:</span><span>{new Date(ticket.createdAt).toLocaleDateString()}</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'inspections':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Select Suite</label>
                  <Select value={activeFormFilter} onValueChange={setActiveFormFilter}>
                    <SelectTrigger className="w-full md:w-[280px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="msha">MSHA - Mine Safety</SelectItem>
                      <SelectItem value="construction">Construction - Site Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredForms.map((form) => (
                    <Card key={form.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-muted rounded-lg">{getFormIcon(form.icon)}</div>
                          <div>
                            <h3 className="font-semibold">{form.title}</h3>
                            <Badge variant="outline" className="text-xs mt-1">{form.suite}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{form.description}</p>
                        <Button className="w-full" onClick={() => navigate(form.route)}>
                          <FileText className="h-4 w-4 mr-2" />Start Form
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'equipment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignedEquipment.map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                      <Button size="sm" onClick={() => navigate('/equipment-selection')}>Inspect</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'schedule':
        return (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Scheduled Maintenance</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage scheduled maintenance tasks.</p>
              <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'parts':
        return (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Parts & Inventory</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track parts and inventory for maintenance tasks.</p>
              <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Inventory management coming soon</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'history':
        return <MaintenanceHistory userRole="maintainer" />;

      case 'settings':
        return (
          <Card>
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure your preferences and account settings.</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <MaintainerSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQrScan={() => setQrScanOpen(true)}
        notificationCount={2}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold capitalize">{activeTab === 'overview' ? 'Dashboard' : activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <SiteSwitcher />
            <div className={isOnline ? "status-online" : "status-offline"}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
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
