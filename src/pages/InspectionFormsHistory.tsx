import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  ClipboardCheck
} from 'lucide-react';

interface InspectionRecord {
  id: string;
  formName: string;
  formType: string;
  equipmentId: string;
  equipmentName: string;
  inspectionDate: string;
  status: 'Passed' | 'Defect' | 'Draft';
  submittedBy: string;
  suite: string;
  notes?: string;
  defectDetails?: string;
}

const mockInspectionData: InspectionRecord[] = [
  {
    id: 'INS-001',
    formName: 'Heavy Equipment Daily Inspection Form',
    formType: 'Pre-Operation',
    equipmentId: 'EQP002',
    equipmentName: '1127 Excavator',
    inspectionDate: '2025-11-18',
    status: 'Passed',
    submittedBy: 'John Operator',
    suite: 'MSHA',
    notes: 'All systems operational. Minor dust accumulation noted on air filter.'
  },
  {
    id: 'INS-002',
    formName: 'Haul Truck Pre-Operation Inspection',
    formType: 'Pre-Operation',
    equipmentId: 'EQP001',
    equipmentName: '1092 Haul Truck',
    inspectionDate: '2025-11-11',
    status: 'Defect',
    submittedBy: 'John Operator',
    suite: 'MSHA',
    notes: 'Brake warning light illuminated.',
    defectDetails: 'Hydraulic brake system pressure below threshold. Maintenance ticket created.'
  },
  {
    id: 'INS-003',
    formName: 'Loader Daily Inspection',
    formType: 'Pre-Operation',
    equipmentId: 'EQP003',
    equipmentName: 'CAT 966M Loader',
    inspectionDate: '2025-11-10',
    status: 'Passed',
    submittedBy: 'Sarah Tech',
    suite: 'Construction',
    notes: 'Equipment in good working condition.'
  },
  {
    id: 'INS-004',
    formName: 'Workplace Exam',
    formType: 'Workplace',
    equipmentId: 'SITE-A',
    equipmentName: 'North Pit Area',
    inspectionDate: '2025-11-09',
    status: 'Passed',
    submittedBy: 'John Operator',
    suite: 'MSHA',
    notes: 'Area clear of hazards. All safety equipment in place.'
  },
  {
    id: 'INS-005',
    formName: 'Fire Extinguisher Inspection',
    formType: 'Safety',
    equipmentId: 'FE-012',
    equipmentName: 'Fire Extinguisher Unit 12',
    inspectionDate: '2025-11-08',
    status: 'Draft',
    submittedBy: 'John Operator',
    suite: 'TCEQ',
    notes: 'Inspection in progress'
  },
  {
    id: 'INS-006',
    formName: 'Bulldozer Pre-Operation Check',
    formType: 'Pre-Operation',
    equipmentId: 'EQP004',
    equipmentName: 'CAT D8T Bulldozer',
    inspectionDate: '2025-11-07',
    status: 'Defect',
    submittedBy: 'Mike Johnson',
    suite: 'Construction',
    defectDetails: 'Track tension needs adjustment. Left track showing excessive wear.'
  }
];

const InspectionFormsHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  const uniqueEquipment = [...new Set(mockInspectionData.map(r => r.equipmentName))];
  const uniqueFormTypes = [...new Set(mockInspectionData.map(r => r.formType))];

  const filteredRecords = useMemo(() => {
    return mockInspectionData.filter(record => {
      // Search filter
      if (searchTerm && !record.formName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && record.status !== statusFilter) {
        return false;
      }
      // Form type filter
      if (formTypeFilter !== 'all' && record.formType !== formTypeFilter) {
        return false;
      }
      // Equipment filter
      if (equipmentFilter !== 'all' && record.equipmentName !== equipmentFilter) {
        return false;
      }
      // Date range filter
      if (dateRange.start && record.inspectionDate < dateRange.start) {
        return false;
      }
      if (dateRange.end && record.inspectionDate > dateRange.end) {
        return false;
      }
      return true;
    });
  }, [searchTerm, statusFilter, formTypeFilter, equipmentFilter, dateRange]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        );
      case 'Defect':
        return (
          <Badge className="bg-red-600 text-white hover:bg-red-700">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Defect
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSuiteBadge = (suite: string) => {
    switch (suite) {
      case 'MSHA':
        return <Badge className="bg-orange-600 text-white text-xs">{suite}</Badge>;
      case 'TCEQ':
        return <Badge className="bg-cyan-600 text-white text-xs">{suite}</Badge>;
      case 'Construction':
        return <Badge className="bg-yellow-600 text-white text-xs">{suite}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{suite}</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFormTypeFilter('all');
    setEquipmentFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/operator-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Inspection Forms History
            </h1>
            <p className="text-sm text-muted-foreground">
              Search and review past inspection submissions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Form name, equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>

              {/* Equipment Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Equipment</label>
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Equipment" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Equipment</SelectItem>
                    {uniqueEquipment.map(equipment => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Form Type</label>
                <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueFormTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Defect">Defect</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="space-y-2 md:col-start-4">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredRecords.length}</span> of {mockInspectionData.length} records
          </p>
        </div>

        {/* Records List */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No inspection records found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <Card key={record.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Form Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground font-mono">
                            Inspection Id: {record.id}
                          </span>
                          {getSuiteBadge(record.suite)}
                        </div>
                        <h3 className="font-semibold text-primary hover:underline cursor-pointer" 
                            onClick={() => setSelectedRecord(record)}>
                          {record.formName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {record.equipmentName} • {record.equipmentId}
                        </p>
                      </div>

                      {/* Middle: Status */}
                      <div className="flex items-center gap-3">
                        {getStatusBadge(record.status)}
                      </div>

                      {/* Right: Date & Action */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Inspected on:</p>
                          <p className="font-medium">{formatDate(record.inspectionDate)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                          className="whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Inspection Details
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-1">
                {/* Header Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSuiteBadge(selectedRecord.suite)}
                    <span className="text-sm text-muted-foreground font-mono">
                      {selectedRecord.id}
                    </span>
                  </div>
                  {getStatusBadge(selectedRecord.status)}
                </div>

                {/* Form Name */}
                <div>
                  <h3 className="text-lg font-semibold">{selectedRecord.formName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRecord.formType} Inspection</p>
                </div>

                {/* Equipment & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                    <p className="font-medium">{selectedRecord.equipmentName}</p>
                    <p className="text-sm text-muted-foreground">{selectedRecord.equipmentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Inspection Date</label>
                    <p className="font-medium">{formatDate(selectedRecord.inspectionDate)}</p>
                  </div>
                </div>

                {/* Submitted By */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                  <p className="font-medium">{selectedRecord.submittedBy}</p>
                </div>

                {/* Notes */}
                {selectedRecord.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Inspection Notes</label>
                    <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                      {selectedRecord.notes}
                    </div>
                  </div>
                )}

                {/* Defect Details */}
                {selectedRecord.defectDetails && (
                  <div>
                    <label className="text-sm font-medium text-red-600">Defect Details</label>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm mt-1 text-red-800">
                      {selectedRecord.defectDetails}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedRecord.status === 'Defect' && (
                    <Button variant="outline" className="flex-1">
                      Open Ticket
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectionFormsHistory;
