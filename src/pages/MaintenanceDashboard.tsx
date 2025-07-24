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
import { 
  Wrench, AlertTriangle, Clock, CheckCircle, TrendingUp, 
  Users, Wifi, WifiOff, LogOut, Filter, Bell, History,
  Settings, Eye, FileText
} from 'lucide-react';

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

const MaintenanceDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'dashboard' | 'defect-detail' | 'repair-doc'>('dashboard');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate occasional status updates
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
    }, 30000); // Update every 30 seconds

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

  const criticalCount = tickets.filter(t => t.severity === 'Critical').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const openCount = tickets.filter(t => t.status === 'Open').length;

  const handleViewTicket = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
    setActiveView('defect-detail');
    setNotificationDrawerOpen(false);
  };

  const handleStartRepair = () => {
    setActiveView('repair-doc');
  };

  const handleCompleteRepair = () => {
    // Update equipment status to Active
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
              <h1 className="text-xl font-semibold">Maintenance Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name} - Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Alerts
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
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-warning">{inProgressCount}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                  <p className="text-2xl font-bold">{openCount}</p>
                </div>
                <Wrench className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Load</p>
                  <p className="text-2xl font-bold text-success">85%</p>
                </div>
                <Users className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Active Tickets
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Maintenance History
            </TabsTrigger>
          </TabsList>

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
                            <Badge variant="outline" className="font-mono">
                              {ticket.id}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </Badge>
                            <Badge className={getSeverityColor(ticket.severity)}>
                              {ticket.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {ticket.estimatedHours}h estimated
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTicket(ticket.equipmentId)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-1">{ticket.equipmentId}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {ticket.equipmentType}
                            </p>
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
    </div>
  );
};

export default MaintenanceDashboard;