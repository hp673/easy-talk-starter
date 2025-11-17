import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { AddUserForm, AddEquipmentForm, CreateTemplateForm, ResetPasswordForm } from '@/components/AdminForms';
import CategoryManager from '@/components/CategoryManager';
import FormTemplateManager from '@/components/FormTemplateManager';
import ComplianceSuiteManager from '@/components/ComplianceSuiteManager';
import { NotificationExecutionMonitor } from '@/components/NotificationExecutionMonitor';
import { 
  Settings, Users, Truck, FileText, Activity, 
  Wifi, WifiOff, LogOut, Search, Plus, Edit, Trash2, Tag, Bell, MapPin, ClipboardCheck
} from 'lucide-react';
import InspectionRecords from '@/components/InspectionRecords';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'technician' | 'site_manager' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface Equipment {
  id: string;
  make: string;
  model: string;
  type: string;
  location: string;
  status: 'active' | 'retired';
  addedDate: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Operator', email: 'john@mine.com', role: 'operator', status: 'active', lastLogin: '2024-01-22T08:30:00Z' },
  { id: '2', name: 'Sarah Tech', email: 'sarah@mine.com', role: 'technician', status: 'active', lastLogin: '2024-01-22T07:15:00Z' },
  { id: '3', name: 'Mike Manager', email: 'mike@mine.com', role: 'site_manager', status: 'active', lastLogin: '2024-01-21T16:45:00Z' },
  { id: '4', name: 'Jane Admin', email: 'jane@mine.com', role: 'admin', status: 'active', lastLogin: '2024-01-22T09:00:00Z' },
];

const mockEquipment: Equipment[] = [
  { id: 'CAT-789C-001', make: 'Caterpillar', model: '789C', type: 'Haul Truck', location: 'Pit A', status: 'active', addedDate: '2023-06-15' },
  { id: 'KOM-PC5500-002', make: 'Komatsu', model: 'PC5500-6', type: 'Excavator', location: 'Pit B', status: 'active', addedDate: '2023-07-20' },
  { id: 'CAT-994K-003', make: 'Caterpillar', model: '994K', type: 'Wheel Loader', location: 'Pit A', status: 'active', addedDate: '2023-08-10' },
];

const mockAuditLogs: AuditLog[] = [
  { id: '1', user: 'John Operator', action: 'LOGIN', resource: 'System', timestamp: '2024-01-22T08:30:00Z', details: 'Successful login from IP 192.168.1.100' },
  { id: '2', user: 'Sarah Tech', action: 'FORM_SUBMIT', resource: 'Inspection Form', timestamp: '2024-01-22T08:15:00Z', details: 'Submitted inspection for CAT-789C-001' },
  { id: '3', user: 'Admin User', action: 'USER_CREATE', resource: 'User Management', timestamp: '2024-01-21T15:30:00Z', details: 'Created new technician account' },
  { id: '4', user: 'Mike Manager', action: 'EQUIPMENT_UPDATE', resource: 'Equipment', timestamp: '2024-01-21T14:20:00Z', details: 'Updated maintenance schedule for KOM-PC5500-002' },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'operator' });
  const [newEquipment, setNewEquipment] = useState({ make: '', model: '', type: '', location: '' });
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEquipment = mockEquipment.filter(eq => 
    eq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = mockAuditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'site_manager': return 'bg-primary text-primary-foreground';
      case 'technician': return 'bg-warning text-warning-foreground';
      case 'operator': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground';
  };

  const systemMetrics = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === 'active').length,
    totalEquipment: mockEquipment.length,
    activeEquipment: mockEquipment.filter(eq => eq.status === 'active').length,
    todayLogins: 12,
    systemUptime: '99.8%',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">Organization Admin Portal</h1>
              <p className="text-sm text-muted-foreground">
                Manage organization compliance suites and system settings
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
            
            <Button variant="outline" onClick={() => {
              logout();
              navigate('/');
            }}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{systemMetrics.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{systemMetrics.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{systemMetrics.totalEquipment}</p>
                <p className="text-sm text-muted-foreground">Equipment</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{systemMetrics.activeEquipment}</p>
                <p className="text-sm text-muted-foreground">Active Units</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{systemMetrics.totalEquipment - systemMetrics.activeEquipment}</p>
                <p className="text-sm text-muted-foreground">Inactive Equipment</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setActiveTab('inspections')}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Inspections (7 Days)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-9 w-full">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Equipment
                </TabsTrigger>
                <TabsTrigger value="sites" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Sites
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="forms" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Equipment Forms
                </TabsTrigger>
                <TabsTrigger value="workplace" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Compliance Suites
                </TabsTrigger>
                <TabsTrigger value="inspections" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Inspection Records
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Audit Logs
                </TabsTrigger>
              </TabsList>

              {/* Search Bar */}
              <div className="mt-6 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="input-mining pl-10"
                  />
                </div>
              </div>

              {/* User Management */}
              <TabsContent value="users" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex gap-2">
                    <AddUserForm onSubmit={(userData) => console.log('User created:', userData)} />
                    <ResetPasswordForm />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role.replace('_', ' ')}
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Last: {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Equipment Management */}
              <TabsContent value="equipment" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Equipment Management</h3>
                  <AddEquipmentForm onSubmit={(equipmentData) => console.log('Equipment created:', equipmentData)} />
                </div>

                <div className="space-y-3">
                  {filteredEquipment.map((equipment) => (
                    <Card key={equipment.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium">{equipment.id}</h4>
                              <p className="text-sm text-muted-foreground">
                                {equipment.make} {equipment.model}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{equipment.type}</Badge>
                              <Badge variant="outline">{equipment.location}</Badge>
                              <Badge className={getStatusColor(equipment.status)}>
                                {equipment.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Added: {equipment.addedDate}
                            </span>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Site Management */}
              <TabsContent value="sites" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Site Management</h3>
                  <Button onClick={() => navigate('/site-management')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Open Site Manager
                  </Button>
                </div>
                
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Site Management</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Manage mining sites, assign equipment and team members, and configure site-specific settings.
                  </p>
                  <Button onClick={() => navigate('/site-management')} size="lg" className="font-rajdhani">
                    <MapPin className="h-5 w-5 mr-2" />
                    Go to Site Management
                  </Button>
                </div>
              </TabsContent>

              {/* Categories Management */}
              <TabsContent value="categories" className="space-y-4">
                <CategoryManager />
              </TabsContent>

              {/* Equipment Form Templates */}
              <TabsContent value="forms" className="space-y-4">
                <FormTemplateManager />
              </TabsContent>

              {/* Compliance Suite Templates */}
              <TabsContent value="workplace" className="space-y-4">
                <ComplianceSuiteManager />
              </TabsContent>

              {/* Inspection Records */}
              <TabsContent value="inspections" className="space-y-4">
                <InspectionRecords />
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="space-y-4">
                <NotificationExecutionMonitor />
              </TabsContent>

              {/* Audit Logs */}
              <TabsContent value="logs" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Audit Logs</h3>
                  <Button variant="outline">
                    Export Logs
                  </Button>
                </div>

                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{log.action}</Badge>
                              <span className="text-sm font-medium">{log.user}</span>
                              <span className="text-sm text-muted-foreground">→</span>
                              <span className="text-sm text-muted-foreground">{log.resource}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;