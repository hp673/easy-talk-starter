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
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  ClipboardCheck,
  Paperclip,
  User,
  X
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
  inspector: string;
  suite: string;
  notes?: string;
  defectDetails?: string;
  hasAttachments: boolean;
  attachmentCount: number;
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
    inspector: 'John Operator',
    suite: 'MSHA',
    notes: 'All systems operational. Minor dust accumulation noted on air filter.',
    hasAttachments: true,
    attachmentCount: 2
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
    inspector: 'John Operator',
    suite: 'MSHA',
    notes: 'Brake warning light illuminated.',
    defectDetails: 'Hydraulic brake system pressure below threshold. Maintenance ticket created.',
    hasAttachments: true,
    attachmentCount: 3
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
    inspector: 'Sarah Tech',
    suite: 'Construction',
    notes: 'Equipment in good working condition.',
    hasAttachments: false,
    attachmentCount: 0
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
    inspector: 'Mike Johnson',
    suite: 'MSHA',
    notes: 'Area clear of hazards. All safety equipment in place.',
    hasAttachments: true,
    attachmentCount: 1
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
    inspector: 'John Operator',
    suite: 'TCEQ',
    notes: 'Inspection in progress',
    hasAttachments: false,
    attachmentCount: 0
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
    inspector: 'Mike Johnson',
    suite: 'Construction',
    defectDetails: 'Track tension needs adjustment. Left track showing excessive wear.',
    hasAttachments: true,
    attachmentCount: 4
  }
];

const InspectionFormsHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [inspectorFilter, setInspectorFilter] = useState('all');
  const [attachmentFilter, setAttachmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  const uniqueEquipment = [...new Set(mockInspectionData.map(r => r.equipmentName))];
  const uniqueFormTypes = [...new Set(mockInspectionData.map(r => r.formType))];
  const uniqueInspectors = [...new Set(mockInspectionData.map(r => r.inspector))];

  const filteredRecords = useMemo(() => {
    return mockInspectionData.filter(record => {
      if (searchTerm && !record.formName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !record.equipmentId.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && record.status !== statusFilter) {
        return false;
      }
      if (formTypeFilter !== 'all' && record.formType !== formTypeFilter) {
        return false;
      }
      if (equipmentFilter !== 'all' && record.equipmentName !== equipmentFilter) {
        return false;
      }
      if (inspectorFilter !== 'all' && record.inspector !== inspectorFilter) {
        return false;
      }
      if (attachmentFilter === 'has' && !record.hasAttachments) {
        return false;
      }
      if (attachmentFilter === 'none' && record.hasAttachments) {
        return false;
      }
      if (dateRange.start && record.inspectionDate < dateRange.start) {
        return false;
      }
      if (dateRange.end && record.inspectionDate > dateRange.end) {
        return false;
      }
      return true;
    });
  }, [searchTerm, statusFilter, formTypeFilter, equipmentFilter, inspectorFilter, attachmentFilter, dateRange]);

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
    setInspectorFilter('all');
    setAttachmentFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || formTypeFilter !== 'all' || 
    equipmentFilter !== 'all' || inspectorFilter !== 'all' || attachmentFilter !== 'all' || 
    dateRange.start || dateRange.end;

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
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Button variant="outline" size="sm" onClick={() => navigate('/operator-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              Inspection Forms History – Audit View
            </h1>
            <p className="text-sm text-muted-foreground">
              Search and review past inspection submissions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filters Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {/* Search */}
              <div className="space-y-1.5 xl:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Form name, equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">To Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="h-9"
                />
              </div>

              {/* Form Type Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Form Type</label>
                <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                  <SelectTrigger className="bg-background h-9">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueFormTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Equipment</label>
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger className="bg-background h-9">
                    <SelectValue placeholder="All Equipment" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Equipment</SelectItem>
                    {uniqueEquipment.map(equipment => (
                      <SelectItem key={equipment} value={equipment}>{equipment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inspector Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Inspector</label>
                <Select value={inspectorFilter} onValueChange={setInspectorFilter}>
                  <SelectTrigger className="bg-background h-9">
                    <SelectValue placeholder="All Inspectors" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Inspectors</SelectItem>
                    {uniqueInspectors.map(inspector => (
                      <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background h-9">
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

              {/* Attachment Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Attachments</label>
                <Select value={attachmentFilter} onValueChange={setAttachmentFilter}>
                  <SelectTrigger className="bg-background h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="has">Has Attachments</SelectItem>
                    <SelectItem value="none">No Attachments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredRecords.length}</span> of {mockInspectionData.length} records
          </p>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Records Table */}
        <Card className="shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Form Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Equipment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Inspector</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Attachments</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <ClipboardCheck className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-muted-foreground">No inspection records found</p>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getSuiteBadge(record.suite)}
                          <div>
                            <p className="font-medium text-sm text-foreground hover:text-primary cursor-pointer"
                               onClick={() => setSelectedRecord(record)}>
                              {record.formName}
                            </p>
                            <p className="text-xs text-muted-foreground">{record.formType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{record.equipmentName}</p>
                        <p className="text-xs text-muted-foreground">{record.equipmentId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{formatDate(record.inspectionDate)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{record.inspector}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-4 py-3">
                        {record.hasAttachments ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span>{record.attachmentCount}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Inspection Details
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <ScrollArea className="max-h-[65vh]">
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

                {/* Inspector */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Inspector</label>
                  <p className="font-medium">{selectedRecord.inspector}</p>
                </div>

                {/* Submitted By */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                  <p className="font-medium">{selectedRecord.submittedBy}</p>
                </div>

                {/* Attachments */}
                {selectedRecord.hasAttachments && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedRecord.attachmentCount} file(s) attached</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedRecord.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedRecord.notes}</p>
                  </div>
                )}

                {/* Defect Details */}
                {selectedRecord.defectDetails && (
                  <div>
                    <label className="text-sm font-medium text-red-600">Defect Details</label>
                    <p className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      {selectedRecord.defectDetails}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
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
