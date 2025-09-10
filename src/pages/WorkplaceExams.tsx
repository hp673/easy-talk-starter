import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useOffline } from '@/contexts/OfflineContext';
import { useToast } from '@/hooks/use-toast';
import WorkplaceExamForm from '@/components/WorkplaceExamForm';
import { 
  MapPin, Calendar, Clock, AlertTriangle, CheckCircle, 
  Search, Filter, ArrowLeft, Plus, Edit, Eye, Lock,
  Wifi, WifiOff, History, FileText
} from 'lucide-react';

interface WorkplaceTemplate {
  id: string;
  name: string;
  areas: Array<{
    id: string;
    name: string;
    description?: string;
    subAreas: Array<{
      id: string;
      name: string;
      description?: string;
      canToggle: boolean;
      notesRequired: boolean;
      photoRequired: boolean;
    }>;
  }>;
  primaryInspector: string;
  backupInspector: string;
  helpText?: string;
  canResolutionRules: {
    requireNotification: boolean;
    requireSignoff: boolean;
  };
}

interface WorkplaceExamData {
  id: string;
  templateId: string;
  templateName: string;
  date: string;
  location: string;
  inspector: string;
  shift?: string;
  status: 'in-progress' | 'completed' | 'locked';
  areas: {
    [areaId: string]: {
      [subAreaId: string]: {
        status: 'ok' | 'can' | 'na';
        notes?: string;
        photos?: string[];
        canNotified?: boolean;
        canMethod?: string;
        canTime?: string;
        canResolved?: boolean;
        resolvedBy?: string;
        resolvedDate?: string;
        resolvedNotes?: string;
      };
    };
  };
  additionalNotes?: string;
  lastSaved: string;
  unsynced: boolean;
}

const mockWorkplaceTemplates: WorkplaceTemplate[] = [
  {
    id: '1',
    name: 'Examination of Working Places - Daily Site Workplace Exam',
    areas: [
      {
        id: 'regular-areas',
        name: 'Location of all areas examined',
        description: 'Mark "CAN" box if "Corrective Action Needed" is found. IF conditions that may adversely affect safety or health cannot be corrected before miners are potentially exposed the miners must be promptly notified of the condition',
        subAreas: [
          { id: 'plant1', name: 'Plant 1', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'plant2', name: 'Plant 2', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'quarry', name: 'Quarry', description: 'The current mining area', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'crusher-screener', name: 'Crusher/Screener/Conveyor', description: 'Crusher and screener include immediate area', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'roadways', name: 'Roadways/Ramps', description: 'All roadways within site and ramps around crusher, stockpiles or roadways', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'maintenance', name: 'Maintenance Areas', description: 'Mantenance area and surrounding access ways', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'storage', name: 'Storage Areas', description: 'Storage connex or building and all access ways', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'scalehouse', name: 'Scalehouse', description: 'Scalehouse including immediate surounding area', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      },
      {
        id: 'not-regular',
        name: 'Location of all areas NOT Regularly Inspected',
        description: 'Areas Not Regularly Inspected MUST be inspected BEFORE work begins or as miners begin work in that place',
        subAreas: [
          { id: 'wash-plant', name: 'Wash Plant', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'other-areas', name: 'Other Areas', description: '', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'highwalls', name: 'Highwalls', description: 'All highwalls around quarry and/or mining area', canToggle: true, notesRequired: false, photoRequired: false },
          { id: 'berms', name: 'Berms', description: 'All berms around crusher hopper, stockpiles and ramps', canToggle: true, notesRequired: false, photoRequired: false }
        ]
      }
    ],
    primaryInspector: 'OP001',
    backupInspector: 'MAINT002',
    helpText: 'Working places must be examined at least once each shift, before work begins or as miners begin work in that place. Record ALL conditions found on entire shift. A competent person should be Task Trained to recognize hazards and conditions that are expected or known to occur in a specific work area.',
    canResolutionRules: {
      requireNotification: true,
      requireSignoff: true
    }
  },
  {
    id: '2',
    name: 'Weekly Site Safety Inspection - Processing Area',
    areas: [
      {
        id: 'processing',
        name: 'Processing Plant',
        description: 'Main processing and screening areas',
        subAreas: [
          { id: 'primary-crusher', name: 'Primary Crusher Area', description: '', canToggle: true, notesRequired: true, photoRequired: false },
          { id: 'screening-plant', name: 'Screening Plant and Surrounding Areas', description: '', canToggle: true, notesRequired: false, photoRequired: true }
        ]
      }
    ],
    primaryInspector: 'mike-wilson',
    backupInspector: 'emma-davis',
    helpText: 'Comprehensive weekly safety inspection of all processing areas. Focus on structural integrity and safety hazards.',
    canResolutionRules: {
      requireNotification: true,
      requireSignoff: true
    }
  }
];

const mockExamData: WorkplaceExamData[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Examination of Working Places - Daily Site Workplace Exam',
    date: '2024-01-22',
    location: 'Main Quarry Site',
    inspector: 'OP001',
    shift: '1st',
    status: 'completed',
    areas: {
      'regular-areas': {
        plant1: { status: 'ok', notes: 'All equipment functioning normally' },
        plant2: { status: 'can', notes: 'Conveyor belt showing wear, needs replacement', canNotified: true, canMethod: 'radio', canTime: '08:30' },
        quarry: { status: 'ok' },
        'crusher-screener': { status: 'ok' },
        roadways: { status: 'ok' },
        maintenance: { status: 'ok' },
        storage: { status: 'ok' },
        scalehouse: { status: 'ok' }
      },
      'not-regular': {
        'wash-plant': { status: 'ok' },
        'other-areas': { status: 'ok' },
        highwalls: { status: 'ok', notes: 'Stable condition, no loose material observed' },
        berms: { status: 'can', notes: 'Erosion damage on south berm requires repair', canNotified: true, canMethod: 'phone', canTime: '09:15' }
      }
    },
    additionalNotes: 'Overall site condition good. Weather conditions favorable. Conveyor belt replacement scheduled for next maintenance window.',
    lastSaved: '2024-01-22T10:30:00Z',
    unsynced: false
  },
  {
    id: '2',
    templateId: '1',
    templateName: 'Examination of Working Places - Daily Site Workplace Exam',
    date: '2024-01-23',
    location: 'Main Quarry Site',
    inspector: 'OP001',
    shift: '1st',
    status: 'in-progress',
    areas: {
      'regular-areas': {
        plant1: { status: 'ok' },
        plant2: { status: 'can', notes: 'Conveyor belt still requires attention from previous day', canNotified: true, canMethod: 'radio', canTime: '07:45' },
        quarry: { status: 'ok' }
      },
      'not-regular': {
        highwalls: { status: 'ok' },
        berms: { status: 'can', notes: 'Previous erosion issue still requires attention', canNotified: true, canMethod: 'phone', canTime: '08:00' }
      }
    },
    lastSaved: '2024-01-23T08:15:00Z',
    unsynced: true
  }
];

const WorkplaceExams = () => {
  const [selectedView, setSelectedView] = useState<'list' | 'form'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkplaceTemplate | null>(null);
  const [selectedExam, setSelectedExam] = useState<WorkplaceExamData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [examData, setExamData] = useState<WorkplaceExamData[]>(mockExamData);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const { toast } = useToast();

  const filteredExams = examData.filter(exam => {
    const matchesSearch = exam.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canEdit = (exam: WorkplaceExamData, template: WorkplaceTemplate) => {
    const currentUser = user?.id || '';
    const isPrimaryInspector = template.primaryInspector === currentUser;
    const isBackupInspector = template.backupInspector === currentUser;
    
    return (isPrimaryInspector || isBackupInspector) && 
           exam.status !== 'locked' && 
           exam.status !== 'completed';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'locked':
        return <Badge variant="outline"><Lock className="h-3 w-3 mr-1" />Locked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateNew = (template: WorkplaceTemplate) => {
    const newExam: WorkplaceExamData = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      date: new Date().toISOString().split('T')[0],
      location: '',
      inspector: user?.id || 'Current User',
      shift: '1st',
      status: 'in-progress',
      areas: {},
      lastSaved: new Date().toISOString(),
      unsynced: true
    };
    
    setSelectedTemplate(template);
    setSelectedExam(newExam);
    setSelectedView('form');
  };

  const handleEditExam = (exam: WorkplaceExamData) => {
    const template = mockWorkplaceTemplates.find(t => t.id === exam.templateId);
    if (template && canEdit(exam, template)) {
      setSelectedTemplate(template);
      setSelectedExam(exam);
      setSelectedView('form');
    }
  };

  const handleViewExam = (exam: WorkplaceExamData) => {
    const template = mockWorkplaceTemplates.find(t => t.id === exam.templateId);
    if (template) {
      setSelectedTemplate(template);
      setSelectedExam(exam);
      setSelectedView('form');
    }
  };

  const handleSave = (data: WorkplaceExamData) => {
    setExamData(prev => {
      const existingIndex = prev.findIndex(e => e.id === data.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = data;
        return updated;
      } else {
        return [...prev, data];
      }
    });
  };

  const handleSubmit = (data: WorkplaceExamData) => {
    handleSave(data);
    setSelectedView('list');
    setSelectedTemplate(null);
    setSelectedExam(null);
  };

  const handleBackToList = () => {
    setSelectedView('list');
    setSelectedTemplate(null);
    setSelectedExam(null);
  };

  if (selectedView === 'form' && selectedTemplate && selectedExam) {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-mining-dark">Workplace Examination</h1>
              <p className="text-muted-foreground">{selectedTemplate.name}</p>
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
          </div>
        </div>

        <WorkplaceExamForm
          template={selectedTemplate}
          examData={selectedExam}
          isReadOnly={!canEdit(selectedExam, selectedTemplate)}
          onSave={handleSave}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mining-dark flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Workplace Examinations
          </h1>
          <p className="text-muted-foreground">Manage site workplace safety examinations</p>
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
          <Button variant="outline" onClick={() => navigate('/operator-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">{examData.length}</p>
                <p className="text-sm text-muted-foreground">Total Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">
                  {examData.filter(e => e.status === 'in-progress').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">
                  {examData.filter(e => e.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-mining-dark">
                  {examData.filter(e => 
                    Object.values(e.areas).some(area => 
                      Object.values(area).some(subArea => subArea.status === 'can')
                    )
                  ).length}
                </p>
                <p className="text-sm text-muted-foreground">CAN Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Templates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start New Workplace Examination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWorkplaceTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.areas.length} areas • {template.areas.reduce((sum, area) => sum + area.subAreas.length, 0)} inspection points
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Primary: {template.primaryInspector.replace('-', ' ')}
                        </Badge>
                        {template.backupInspector && (
                          <Badge variant="outline" className="text-xs">
                            Backup: {template.backupInspector.replace('-', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button onClick={() => handleCreateNew(template)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search examinations..."
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Examinations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Examination History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const template = mockWorkplaceTemplates.find(t => t.id === exam.templateId);
              const canEditExam = template ? canEdit(exam, template) : false;
              const hasCANItems = Object.values(exam.areas).some(area => 
                Object.values(area).some(subArea => subArea.status === 'can')
              );

              return (
                <Card key={exam.id} className={`p-4 ${hasCANItems ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{exam.templateName}</h4>
                        {getStatusBadge(exam.status)}
                        {exam.unsynced && (
                          <Badge variant="outline" className="text-warning">
                            <Clock className="h-3 w-3 mr-1" />
                            Unsynced
                          </Badge>
                        )}
                        {hasCANItems && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            CAN Items
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exam.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exam.location || 'Location not set'}
                        </span>
                        <span>{exam.inspector}</span>
                        <span>Last saved: {new Date(exam.lastSaved).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEditExam ? (
                        <Button size="sm" onClick={() => handleEditExam(exam)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleViewExam(exam)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">No examinations found</h4>
              <p>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start your first workplace examination using the templates above'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkplaceExams;