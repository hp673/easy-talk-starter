import { useAuth } from "@/contexts/AuthContext";
import OperatorDashboard from "./OperatorDashboard";
import MaintenanceDashboard from "./MaintenanceDashboard";
import SiteManagerDashboard from "./SiteManagerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FileText, Settings, BarChart3, Shield } from "lucide-react";

// Organization Admin Dashboard
const OrgAdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-rajdhani font-bold mb-2">Organization Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage sites, users, and organization-wide settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">Across all sites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Global templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Organization-wide</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Sites Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {['North Mining Site', 'South Mining Site', 'East Quarry', 'West Operations'].map((site) => (
                <div key={site} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{site}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <Settings className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Organization Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Inspections Completed</span>
                  <span className="text-sm font-medium">1,247 / 1,280</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '97%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Maintenance On-Time</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">User Compliance Training</span>
                  <span className="text-sm font-medium">234 / 248</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const RoleBasedDashboard = () => {
  const { currentRoleView } = useAuth();

  switch (currentRoleView) {
    case 'operator':
      return <OperatorDashboard />;
    case 'maintenance':
      return <MaintenanceDashboard />;
    case 'site_admin':
      return <SiteManagerDashboard />;
    case 'org_admin':
      return <OrgAdminDashboard />;
    default:
      return <OperatorDashboard />;
  }
};

export default RoleBasedDashboard;
