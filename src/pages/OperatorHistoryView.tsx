import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaintenanceHistory } from '@/components/MaintenanceHistory';
import { ArrowLeft, History } from 'lucide-react';

const OperatorHistoryView = () => {
  const navigate = useNavigate();

  // Mock assigned equipment for operator
  const assignedEquipment = ['CAT-789C-001', 'KOM-PC5500-002', 'CAT-994K-003'];

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
              <History className="h-6 w-6" />
              Equipment Maintenance History
            </h1>
            <p className="text-sm text-muted-foreground">
              View maintenance records for your assigned equipment
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <MaintenanceHistory 
          userRole="operator" 
          assignedEquipment={assignedEquipment}
        />
      </div>
    </div>
  );
};

export default OperatorHistoryView;