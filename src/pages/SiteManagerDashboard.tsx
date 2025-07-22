import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, 
  Users, Calendar, Wifi, WifiOff, LogOut, Filter,
  Clock, CheckCircle, XCircle
} from 'lucide-react';

interface EquipmentStatus {
  id: string;
  name: string;
  type: string;
  status: 'Operational' | 'Down' | 'Maintenance' | 'Standby';
  utilization: number;
  lastInspection: string;
  nextMaintenance: string;
  location: string;
}

interface PerformanceMetric {
  name: string;
  current: number;
  previous: number;
  target: number;
  unit: string;
}

const mockEquipment: EquipmentStatus[] = [
  {
    id: 'CAT-789C-001',
    name: 'Haul Truck 001',
    type: 'Haul Truck',
    status: 'Down',
    utilization: 0,
    lastInspection: '2024-01-22',
    nextMaintenance: '2024-01-25',
    location: 'Pit A',
  },
  {
    id: 'KOM-PC5500-002',
    name: 'Excavator 002',
    type: 'Excavator',
    status: 'Operational',
    utilization: 89,
    lastInspection: '2024-01-21',
    nextMaintenance: '2024-02-15',
    location: 'Pit B',
  },
  {
    id: 'CAT-994K-003',
    name: 'Wheel Loader 003',
    type: 'Wheel Loader',
    status: 'Maintenance',
    utilization: 45,
    lastInspection: '2024-01-20',
    nextMaintenance: '2024-01-23',
    location: 'Pit A',
  },
  {
    id: 'HIT-EH5000AC-004',
    name: 'Haul Truck 004',
    type: 'Haul Truck',
    status: 'Operational',
    utilization: 92,
    lastInspection: '2024-01-22',
    nextMaintenance: '2024-02-10',
    location: 'Pit C',
  },
];

const performanceMetrics: PerformanceMetric[] = [
  { name: 'Fleet Availability', current: 78, previous: 82, target: 85, unit: '%' },
  { name: 'MTBF', current: 45, previous: 38, target: 50, unit: 'hours' },
  { name: 'MTTR', current: 6.2, previous: 7.8, target: 5.0, unit: 'hours' },
  { name: 'Cost per Hour', current: 142, previous: 158, target: 130, unit: '$' },
];

const SiteManagerDashboard = () => {
  const [equipment, setEquipment] = useState<EquipmentStatus[]>(mockEquipment);
  const [filteredEquipment, setFilteredEquipment] = useState<EquipmentStatus[]>(mockEquipment);
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate occasional equipment status changes
      if (Math.random() > 0.9) {
        setEquipment(prev => 
          prev.map(eq => {
            if (eq.status === 'Maintenance' && Math.random() > 0.8) {
              return { ...eq, status: 'Operational' as const, utilization: Math.floor(Math.random() * 40) + 60 };
            }
            if (eq.status === 'Operational' && Math.random() > 0.95) {
              return { ...eq, utilization: Math.floor(Math.random() * 100) };
            }
            return eq;
          })
        );
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter equipment based on selected filters
  useEffect(() => {
    let filtered = equipment;
    
    if (locationFilter !== 'all') {
      filtered = filtered.filter(eq => eq.location === locationFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(eq => eq.status === statusFilter);
    }
    
    setFilteredEquipment(filtered);
  }, [equipment, locationFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'text-success';
      case 'Down': return 'text-destructive';
      case 'Maintenance': return 'text-warning';
      case 'Standby': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational': return <CheckCircle className="h-4 w-4" />;
      case 'Down': return <XCircle className="h-4 w-4" />;
      case 'Maintenance': return <Clock className="h-4 w-4" />;
      case 'Standby': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMetricTrend = (current: number, previous: number, isReverse = false) => {
    const isImproving = isReverse ? current < previous : current > previous;
    return isImproving ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const operationalCount = equipment.filter(eq => eq.status === 'Operational').length;
  const downCount = equipment.filter(eq => eq.status === 'Down').length;
  const maintenanceCount = equipment.filter(eq => eq.status === 'Maintenance').length;
  const averageUtilization = Math.round(equipment.reduce((sum, eq) => sum + eq.utilization, 0) / equipment.length);

  const criticalAlerts = [
    { id: 1, message: 'CAT-789C-001 critical hydraulic leak detected', severity: 'Critical', time: '10 minutes ago' },
    { id: 2, message: 'Pit A equipment utilization below target (65%)', severity: 'Warning', time: '1 hour ago' },
    { id: 3, message: 'Weekly maintenance schedule due for review', severity: 'Info', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">Site Manager Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Mining Operations Overview - Last updated: {lastUpdate.toLocaleTimeString()}
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
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operational</p>
                  <p className="text-2xl font-bold text-success">{operationalCount}</p>
                  <p className="text-xs text-muted-foreground">of {equipment.length} units</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Down/Maintenance</p>
                  <p className="text-2xl font-bold text-destructive">{downCount + maintenanceCount}</p>
                  <p className="text-xs text-muted-foreground">units offline</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                  <p className="text-2xl font-bold">{averageUtilization}%</p>
                  <p className="text-xs text-muted-foreground">fleet average</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-2xl font-bold text-warning">3</p>
                  <p className="text-xs text-muted-foreground">require attention</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{metric.name}</h3>
                    {getMetricTrend(metric.current, metric.previous, metric.name === 'MTTR' || metric.name === 'Cost per Hour')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{metric.current}</span>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Previous: {metric.previous}{metric.unit} | Target: {metric.target}{metric.unit}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((metric.current / metric.target) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Equipment Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="input-mining">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Pit A">Pit A</SelectItem>
                        <SelectItem value="Pit B">Pit B</SelectItem>
                        <SelectItem value="Pit C">Pit C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="input-mining">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Down">Down</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Standby">Standby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Equipment List */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status ({filteredEquipment.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEquipment.map((eq) => (
                    <div key={eq.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-2 ${getStatusColor(eq.status)}`}>
                            {getStatusIcon(eq.status)}
                            <span className="font-medium">{eq.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({eq.type})</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{eq.utilization}%</div>
                          <div className="text-xs text-muted-foreground">utilization</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <div className="font-medium">{eq.location}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Inspection:</span>
                          <div className="font-medium">{eq.lastInspection}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Maintenance:</span>
                          <div className="font-medium">{eq.nextMaintenance}</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${eq.utilization}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="border-l-4 border-l-destructive pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded text-white ${
                          alert.severity === 'Critical' ? 'bg-destructive' :
                          alert.severity === 'Warning' ? 'bg-warning' : 'bg-primary'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>CAT-789C-001</span>
                    <span className="text-muted-foreground">Jan 25</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>CAT-994K-003</span>
                    <span className="text-muted-foreground">Jan 23</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>HIT-EH5000AC-004</span>
                    <span className="text-muted-foreground">Feb 10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagerDashboard;