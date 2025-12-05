import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SiteSwitcher from '@/components/SiteSwitcher';
import { 
  QrCode, 
  LogOut, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  Wrench, 
  AlertTriangle,
  Clock,
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
  ChevronRight
} from 'lucide-react';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const [activeFormFilter, setActiveFormFilter] = useState('tceq');

  // Compliance forms data organized by suite
  const complianceForms: Record<string, Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    frequency: string;
    required: boolean;
    route: string;
    categoryColor: string;
  }>> = {
    msha: [
      { 
        id: 'MSHA001', 
        category: 'Workplace',
        title: 'Workplace',
        description: 'Ensure workplace safety and regulatory compliance through routine assessments and checklists.',
        frequency: 'daily',
        required: true,
        route: '/workplace-exams',
        categoryColor: 'bg-amber-500'
      },
      { 
        id: 'MSHA002', 
        category: 'Equipment',
        title: 'Equipment Inspection',
        description: 'Mobile equipment pre-operational inspection per MSHA regulations.',
        frequency: 'daily',
        required: true,
        route: '/equipment-selection',
        categoryColor: 'bg-blue-500'
      },
    ],
    tceq: [
      { 
        id: 'TCEQ001', 
        category: 'Workplace',
        title: 'Workplace',
        description: 'Ensure workplace safety and regulatory compliance through routine assessments and checklists.',
        frequency: 'daily',
        required: true,
        route: '/workplace-exams',
        categoryColor: 'bg-amber-500'
      },
      { 
        id: 'TCEQ002', 
        category: 'Fire Extinguisher',
        title: 'Fire Extinguisher',
        description: 'Record inspection, servicing, and compliance details for fire extinguishers.',
        frequency: 'monthly',
        required: true,
        route: '/inspection-form?type=fire-extinguisher',
        categoryColor: 'bg-red-500'
      },
      { 
        id: 'TCEQ003', 
        category: 'Fuel Log',
        title: 'Fuel Log',
        description: 'Maintain accurate records of fuel usage, storage, and compliance reporting.',
        frequency: 'daily',
        required: false,
        route: '/inspection-form?type=fuel-log',
        categoryColor: 'bg-green-500'
      },
      { 
        id: 'TCEQ004', 
        category: 'Other',
        title: 'Other',
        description: 'Capture additional compliance information not covered under specific form categories.',
        frequency: 'as-needed',
        required: false,
        route: '/inspection-form?type=other',
        categoryColor: 'bg-gray-500'
      },
    ],
    construction: [
      { 
        id: 'CONST001', 
        category: 'Equipment',
        title: 'Equipment Inspection',
        description: 'Construction equipment pre-operational safety check.',
        frequency: 'daily',
        required: true,
        route: '/equipment-selection',
        categoryColor: 'bg-blue-500'
      },
      { 
        id: 'CONST002', 
        category: 'Workplace',
        title: 'Jobsite Safety',
        description: 'Daily jobsite safety and hazard assessment.',
        frequency: 'daily',
        required: true,
        route: '/workplace-exams',
        categoryColor: 'bg-amber-500'
      },
    ],
  };

  const filteredForms = complianceForms[activeFormFilter] || [];

  const handleStartInspection = () => {
    navigate('/equipment-selection');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/6f4eeff4-4a2a-4e34-99d8-5c4e4aa31495.png" 
              alt="MineTrak" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Operator Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name || 'Operator'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SiteSwitcher />
            <div className="flex items-center">
              {isOnline ? (
                <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <Wifi className="h-4 w-4" />
                  <span>Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                  <WifiOff className="h-4 w-4" />
                  <span>Offline</span>
                </div>
              )}
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Priority Items - KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Your Equipment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Inspection Due Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Critical Equipment Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Save className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-xs text-muted-foreground">Saved but not submitted forms - in progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CloudUpload className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Outbox</p>
                  <p className="text-xs text-muted-foreground">Forms waiting to sync due to offline mode</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start New Inspection + Maintenance History Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start New Inspection CTA - Commented out for now as it's not in the screenshot */}
          {/* 
          <Card className="bg-card shadow-sm">
            <CardContent className="p-6">
              <Button 
                onClick={handleStartInspection}
                className="w-full h-14 text-lg bg-minetrak-gold hover:bg-minetrak-gold/90 text-minetrak-dark"
              >
                <QrCode className="h-6 w-6 mr-3" />
                Start New Inspection
              </Button>
            </CardContent>
          </Card>
          */}
          
          {/* Maintenance History Card */}
          <Card className="bg-card shadow-sm border-2 border-amber-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-amber-100 rounded-full mb-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Maintenance History</h3>
              <p className="text-sm text-muted-foreground mb-4">Quick access to past inspections and repairs</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/maintenance-history')}
              >
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Inspection Forms History Card */}
          <Card className="bg-card shadow-sm border-2 border-blue-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 rounded-full mb-3">
                <ClipboardCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Inspection Forms History</h3>
              <p className="text-sm text-muted-foreground mb-4">View all submitted inspection records</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/inspection-forms-history')}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Forms by Suite Section */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Compliance Forms By Suite</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Industry-specific compliance forms organized by regulatory suite.
                </p>
              </div>
              <Select value={activeFormFilter} onValueChange={setActiveFormFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4" />
                    <SelectValue placeholder="Select Suite" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="msha">MSHA</SelectItem>
                  <SelectItem value="tceq">TCEQ</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form) => (
                <Card key={form.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Category Badge */}
                      <Badge className={`${form.categoryColor} text-white text-xs`}>
                        {form.category}
                      </Badge>
                      
                      {/* Title */}
                      <h3 className="font-semibold text-foreground">{form.title}</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {form.description}
                      </p>
                      
                      {/* Required indicator */}
                      {form.required && (
                        <div className="flex items-center gap-1">
                          <span className="text-red-500 text-lg">•</span>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <Button 
                        className="w-full bg-minetrak-gold hover:bg-minetrak-gold/90 text-minetrak-dark"
                        onClick={() => navigate(form.route)}
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Start Form
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
                <p className="text-sm mt-1">Select a different compliance suite</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OperatorDashboard;
