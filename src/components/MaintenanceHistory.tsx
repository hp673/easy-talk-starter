import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, Search, Filter, Eye, Calendar, 
  Wrench, User, Clock, FileText 
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentType: string;
  defectType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Cancelled';
  reportedDate: string;
  completedDate?: string;
  reportedBy: string;
  assignedTo: string;
  partsUsed: string[];
  laborHours: number;
  totalCost: number;
  notes: string;
  photos: string[];
}

const mockHistoryData: MaintenanceRecord[] = [
  {
    id: 'R-001',
    equipmentId: 'CAT-789C-001',
    equipmentType: 'Haul Truck',
    defectType: 'Hydraulic System',
    severity: 'Critical',
    status: 'Completed',
    reportedDate: '2024-01-20T08:30:00Z',
    completedDate: '2024-01-21T16:45:00Z',
    reportedBy: 'John Operator',
    assignedTo: 'Mike Johnson',
    partsUsed: ['Hydraulic Seal Kit', 'Hydraulic Fluid (20L)'],
    laborHours: 6.5,
    totalCost: 1250.00,
    notes: 'Replaced main cylinder seals and flushed hydraulic system. Equipment tested and operational.',
    photos: ['before.jpg', 'repair1.jpg', 'after.jpg']
  },
  {
    id: 'R-002',
    equipmentId: 'KOM-PC5500-002',
    equipmentType: 'Excavator',
    defectType: 'Engine Cooling',
    severity: 'High',
    status: 'Completed',
    reportedDate: '2024-01-18T14:20:00Z',
    completedDate: '2024-01-19T11:30:00Z',
    reportedBy: 'Sarah Tech',
    assignedTo: 'Lisa Chen',
    partsUsed: ['Radiator', 'Coolant (10L)', 'Thermostat'],
    laborHours: 4.0,
    totalCost: 890.00,
    notes: 'Replaced faulty radiator and thermostat. System pressure tested successfully.',
    photos: ['engine_before.jpg', 'new_radiator.jpg']
  },
  {
    id: 'R-003',
    equipmentId: 'CAT-994K-003',
    equipmentType: 'Wheel Loader',
    defectType: 'Brake System',
    severity: 'Medium',
    status: 'In Progress',
    reportedDate: '2024-01-21T09:15:00Z',
    reportedBy: 'John Operator',
    assignedTo: 'Tom Wilson',
    partsUsed: ['Brake Pads (Set)'],
    laborHours: 2.0,
    totalCost: 320.00,
    notes: 'Brake pad replacement in progress. Awaiting hydraulic fluid delivery.',
    photos: ['brake_inspection.jpg']
  }
];

interface MaintenanceHistoryProps {
  userRole?: 'operator' | 'maintainer' | 'admin';
  assignedEquipment?: string[];
}

export const MaintenanceHistory: React.FC<MaintenanceHistoryProps> = ({ 
  userRole = 'maintainer',
  assignedEquipment = []
}) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockHistoryData);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>(mockHistoryData);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [defectTypeFilter, setDefectTypeFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  // Filter records based on user role
  React.useEffect(() => {
    let filtered = records;

    // Filter by user role and assigned equipment
    if (userRole === 'operator' && assignedEquipment.length > 0) {
      filtered = filtered.filter(record => 
        assignedEquipment.includes(record.equipmentId)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.defectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Apply defect type filter
    if (defectTypeFilter !== 'all') {
      filtered = filtered.filter(record => record.defectType === defectTypeFilter);
    }

    // Apply equipment filter
    if (equipmentFilter !== 'all') {
      filtered = filtered.filter(record => record.equipmentId === equipmentFilter);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, statusFilter, defectTypeFilter, equipmentFilter, userRole, assignedEquipment]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const uniqueEquipment = [...new Set(records.map(r => r.equipmentId))];
  const uniqueDefectTypes = [...new Set(records.map(r => r.defectType))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            Maintenance History
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'operator' ? 'View maintenance records for your assigned equipment' : 'Complete maintenance history and records'}
          </p>
        </div>
        <Badge variant="outline">
          {filteredRecords.length} Records
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Equipment ID, defect type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Equipment</label>
              <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  {uniqueEquipment.map(equipment => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Defect Type</label>
              <Select value={defectTypeFilter} onValueChange={setDefectTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueDefectTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDefectTypeFilter('all');
                  setEquipmentFilter('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Defect Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono">{record.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.equipmentId}</div>
                      <div className="text-sm text-muted-foreground">{record.equipmentType}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.defectType}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(record.severity)}>
                      {record.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.assignedTo}</TableCell>
                  <TableCell>
                    {record.completedDate 
                      ? new Date(record.completedDate).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>${record.totalCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Maintenance Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-1">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Record ID</label>
                    <p className="font-mono">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Equipment</label>
                    <p>{selectedRecord.equipmentId} ({selectedRecord.equipmentType})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Defect Type</label>
                    <p>{selectedRecord.defectType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Severity</label>
                    <Badge className={getSeverityColor(selectedRecord.severity)}>
                      {selectedRecord.severity}
                    </Badge>
                  </div>
                </div>

                {/* Personnel & Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reported By</label>
                    <p>{selectedRecord.reportedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                    <p>{selectedRecord.assignedTo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reported Date</label>
                    <p>{new Date(selectedRecord.reportedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completed Date</label>
                    <p>{selectedRecord.completedDate 
                      ? new Date(selectedRecord.completedDate).toLocaleDateString()
                      : 'In Progress'
                    }</p>
                  </div>
                </div>

                {/* Parts & Labor */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Parts Used</label>
                    <ul className="text-sm space-y-1">
                      {selectedRecord.partsUsed.map((part, index) => (
                        <li key={index}>• {part}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Labor Hours</label>
                    <p>{selectedRecord.laborHours}h</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Cost</label>
                    <p className="text-lg font-semibold">${selectedRecord.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Repair Notes</label>
                  <div className="bg-muted p-3 rounded text-sm">
                    {selectedRecord.notes}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Photo Documentation ({selectedRecord.photos.length})
                  </label>
                  <div className="flex gap-2 mt-2">
                    {selectedRecord.photos.map((photo, index) => (
                      <div key={index} className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};