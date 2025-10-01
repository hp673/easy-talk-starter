import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, Calendar, Users, Mail, AlertCircle, CheckCircle, 
  XCircle, Clock, Play, RotateCw, Filter, Search 
} from 'lucide-react';

interface SchedulerStats {
  lastRun: string | null;
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  pendingCount: number;
}

interface NotificationExecution {
  id: string;
  config_id: string;
  form_id: string;
  form_name: string;
  notification_type: string;
  scheduled_time: string;
  executed_at: string | null;
  status: 'pending' | 'sent' | 'failed';
  delivery_methods: string[];
  recipients: string[];
  error_message: string | null;
  metadata: any;
  completed: boolean;
  created_at: string;
}

export const NotificationExecutionMonitor: React.FC = () => {
  const [stats, setStats] = useState<SchedulerStats>({
    lastRun: null,
    totalExecutions: 0,
    successCount: 0,
    failureCount: 0,
    pendingCount: 0,
  });
  const [executions, setExecutions] = useState<NotificationExecution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<NotificationExecution | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    loadStats();
    loadExecutions();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_executions')
        .select('status, executed_at, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const executions = data || [];
      setStats({
        lastRun: executions.length > 0 ? executions[0].created_at : null,
        totalExecutions: executions.length,
        successCount: executions.filter(e => e.status === 'sent').length,
        failureCount: executions.filter(e => e.status === 'failed').length,
        pendingCount: executions.filter(e => e.status === 'pending').length,
      });
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const loadExecutions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('notification_executions')
        .select('*')
        .order('scheduled_time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('notification_type', typeFilter as any);
      }

      if (dateFrom) {
        query = query.gte('scheduled_time', dateFrom);
      }

      if (dateTo) {
        query = query.lte('scheduled_time', dateTo);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      let filtered = (data || []) as NotificationExecution[];
      if (searchTerm) {
        filtered = filtered.filter(e =>
          e.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.form_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setExecutions(filtered);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceSchedule = async () => {
    toast({
      title: 'Force Schedule',
      description: 'This feature would trigger the scheduling process immediately. (Demo mode)',
    });
    // In production, this would call an edge function to trigger scheduling
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-success text-success-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      pre_inspection: 'Pre-Inspection',
      due_reminder: 'Due Reminder',
      missed_reminder: 'Missed Reminder',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Scheduler Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Scheduler Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Last Run</p>
                <p className="text-sm font-medium">
                  {stats.lastRun ? new Date(stats.lastRun).toLocaleString() : 'Never'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalExecutions}</p>
                <p className="text-xs text-muted-foreground">Total Executions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{stats.successCount}</p>
                <p className="text-xs text-muted-foreground">Successful</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{stats.failureCount}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleForceSchedule} variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Force Push & Schedule Now
          </Button>
          <Button onClick={loadExecutions} variant="outline" size="sm">
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Form name or ID..."
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pre_inspection">Pre-Inspection</SelectItem>
                  <SelectItem value="due_reminder">Due Reminder</SelectItem>
                  <SelectItem value="missed_reminder">Missed Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-xs"
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          <Button onClick={loadExecutions} size="sm">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Execution Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Execution History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading executions...</p>
          ) : executions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No executions found
            </p>
          ) : (
            <div className="space-y-2">
              {executions.map((execution) => (
                <Card
                  key={execution.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedExecution(execution);
                    setShowDetailDrawer(true);
                  }}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(execution.status)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{execution.form_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(execution.notification_type)}
                            </Badge>
                            <Badge className={getStatusColor(execution.status)}>
                              {execution.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(execution.scheduled_time).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {execution.recipients.join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {execution.delivery_methods.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Detail Drawer */}
      <Dialog open={showDetailDrawer} onOpenChange={setShowDetailDrawer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
          </DialogHeader>
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Form Name</Label>
                  <p className="font-medium">{selectedExecution.form_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Notification Type</Label>
                  <p className="font-medium">{getTypeLabel(selectedExecution.notification_type)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedExecution.status)}>
                    {selectedExecution.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Scheduled Time</Label>
                  <p>{new Date(selectedExecution.scheduled_time).toLocaleString()}</p>
                </div>
                {selectedExecution.executed_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Executed At</Label>
                    <p>{new Date(selectedExecution.executed_at).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Recipients</Label>
                  <p className="capitalize">{selectedExecution.recipients.join(', ')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Delivery Methods</Label>
                  <p className="capitalize">{selectedExecution.delivery_methods.join(', ')}</p>
                </div>
              </div>

              {selectedExecution.error_message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {selectedExecution.error_message}
                  </AlertDescription>
                </Alert>
              )}

              {selectedExecution.metadata && (
                <div>
                  <Label className="text-xs text-muted-foreground">Metadata</Label>
                  <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedExecution.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};