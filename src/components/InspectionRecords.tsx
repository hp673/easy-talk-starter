import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Eye, Download, ExternalLink, Calendar } from 'lucide-react';

interface InspectionRecord {
  id: string;
  equipmentName: string;
  equipmentCategory: string;
  siteName: string;
  submittedBy: string;
  submittedByRole: 'operator' | 'maintainer';
  formType: string;
  suiteName: string;
  status: 'ok' | 'issues_found' | 'critical';
  ticketLinked: boolean;
  ticketId?: string;
  dateSubmitted: string;
  formData?: any;
}

const mockInspections: InspectionRecord[] = [
  {
    id: 'INS-2024-001',
    equipmentName: 'CAT-789C Haul Truck #12',
    equipmentCategory: 'Haul Truck',
    siteName: 'Texas North',
    submittedBy: 'John Operator',
    submittedByRole: 'operator',
    formType: 'Daily Pre-Shift Inspection',
    suiteName: 'MSHA Part 56',
    status: 'ok',
    ticketLinked: false,
    dateSubmitted: '2024-01-22T08:30:00Z',
    formData: {
      vehicleCondition: 'Good',
      brakes: 'Pass',
      lights: 'Pass',
      tires: 'Pass',
      notes: 'All systems operational'
    }
  },
  {
    id: 'INS-2024-002',
    equipmentName: 'KOM-PC5500 Excavator #5',
    equipmentCategory: 'Excavator',
    siteName: 'Austin East',
    submittedBy: 'Sarah Maintainer',
    submittedByRole: 'maintainer',
    formType: 'Weekly Safety Check',
    suiteName: 'MSHA Part 56',
    status: 'issues_found',
    ticketLinked: true,
    ticketId: 'TKT-2024-045',
    dateSubmitted: '2024-01-21T14:20:00Z',
    formData: {
      hydraulics: 'Minor leak detected',
      structure: 'Pass',
      safety: 'Pass',
      notes: 'Hydraulic hose requires replacement'
    }
  },
  {
    id: 'INS-2024-003',
    equipmentName: 'CAT-994K Wheel Loader #8',
    equipmentCategory: 'Wheel Loader',
    siteName: 'Texas North',
    submittedBy: 'Mike Operator',
    submittedByRole: 'operator',
    formType: 'Daily Pre-Shift Inspection',
    suiteName: 'TCEQ',
    status: 'critical',
    ticketLinked: true,
    ticketId: 'TKT-2024-046',
    dateSubmitted: '2024-01-20T07:15:00Z',
    formData: {
      brakes: 'Critical - brake fluid low',
      steering: 'Pass',
      lights: 'Pass',
      notes: 'Equipment tagged out until brake service'
    }
  }
];

export const InspectionRecords: React.FC = () => {
  const [inspections] = useState<InspectionRecord[]>(mockInspections);
  const [selectedInspection, setSelectedInspection] = useState<InspectionRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  // Filters
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ticketFilter, setTicketFilter] = useState<string>('all');
  const [suiteFilter, setSuiteFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-success/20 text-success border-success/30';
      case 'issues_found':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'operator':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'maintainer':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    if (siteFilter !== 'all' && inspection.siteName !== siteFilter) return false;
    if (categoryFilter !== 'all' && inspection.equipmentCategory !== categoryFilter) return false;
    if (statusFilter !== 'all' && inspection.status !== statusFilter) return false;
    if (ticketFilter !== 'all') {
      if (ticketFilter === 'yes' && !inspection.ticketLinked) return false;
      if (ticketFilter === 'no' && inspection.ticketLinked) return false;
    }
    if (suiteFilter !== 'all' && inspection.suiteName !== suiteFilter) return false;
    return true;
  });

  const handleViewInspection = (inspection: InspectionRecord) => {
    setSelectedInspection(inspection);
    setViewModalOpen(true);
  };

  const handleDownloadPDF = (inspectionId: string) => {
    console.log('Download PDF for:', inspectionId);
    // TODO: Implement PDF download
  };

  const handleOpenTicket = (ticketId?: string) => {
    if (ticketId) {
      console.log('Open ticket:', ticketId);
      // TODO: Navigate to ticket view
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Inspection Records Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site</label>
              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="Texas North">Texas North</SelectItem>
                  <SelectItem value="Austin East">Austin East</SelectItem>
                  <SelectItem value="Newcastle">Newcastle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Equipment Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Haul Truck">Haul Truck</SelectItem>
                  <SelectItem value="Excavator">Excavator</SelectItem>
                  <SelectItem value="Wheel Loader">Wheel Loader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Suite/Form Type</label>
              <Select value={suiteFilter} onValueChange={setSuiteFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suites</SelectItem>
                  <SelectItem value="MSHA Part 56">MSHA Part 56</SelectItem>
                  <SelectItem value="TCEQ">TCEQ</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="issues_found">Issues Found</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ticket Linked</label>
              <Select value={ticketFilter} onValueChange={setTicketFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Completed Inspections</CardTitle>
            <Badge variant="outline" className="text-base">
              {filteredInspections.length} Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection ID</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Suite/Form</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No inspection records found matching the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-mono text-sm">{inspection.id}</TableCell>
                      <TableCell className="font-medium">{inspection.equipmentName}</TableCell>
                      <TableCell>{inspection.equipmentCategory}</TableCell>
                      <TableCell>{inspection.siteName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{inspection.submittedBy}</div>
                          <Badge className={getRoleColor(inspection.submittedByRole)}>
                            {inspection.submittedByRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{inspection.formType}</div>
                          <div className="text-xs text-muted-foreground">{inspection.suiteName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(inspection.status)}>
                          {inspection.status === 'ok' ? 'OK' : 
                           inspection.status === 'issues_found' ? 'Issues Found' : 'Critical'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inspection.ticketLinked ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {inspection.ticketId}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(inspection.dateSubmitted).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewInspection(inspection)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadPDF(inspection.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {inspection.ticketLinked && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenTicket(inspection.ticketId)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Inspection Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInspection && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-rajdhani">
                  {selectedInspection.formType} - {selectedInspection.id}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Left Side Summary */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Inspection Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Equipment</div>
                        <div className="font-medium">{selectedInspection.equipmentName}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Category</div>
                        <div className="font-medium">{selectedInspection.equipmentCategory}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Site</div>
                        <div className="font-medium">{selectedInspection.siteName}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Submitted By</div>
                        <div className="font-medium">{selectedInspection.submittedBy}</div>
                        <Badge className={getRoleColor(selectedInspection.submittedByRole)}>
                          {selectedInspection.submittedByRole}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                        <Badge className={getStatusColor(selectedInspection.status)}>
                          {selectedInspection.status === 'ok' ? 'OK' : 
                           selectedInspection.status === 'issues_found' ? 'Issues Found' : 'Critical'}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Date</div>
                        <div className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedInspection.dateSubmitted).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {selectedInspection.ticketLinked && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Linked Ticket</div>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {selectedInspection.ticketId}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side Form Data */}
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Inspection Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedInspection.formData && Object.entries(selectedInspection.formData).map(([key, value]) => (
                        <div key={key} className="border-b border-border pb-3 last:border-0">
                          <div className="text-sm font-medium text-muted-foreground capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-medium">{String(value)}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button onClick={() => handleDownloadPDF(selectedInspection.id)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedInspection.ticketLinked && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenTicket(selectedInspection.ticketId)}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Ticket
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectionRecords;
