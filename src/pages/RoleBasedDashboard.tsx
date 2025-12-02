import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import OperatorDashboard from "./OperatorDashboard";
import MaintenanceDashboard from "./MaintenanceDashboard";
import SiteManagerDashboard from "./SiteManagerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FileText, Settings, BarChart3, Shield, QrCode } from "lucide-react";
import { QRScanActionSheet } from '@/components/QRScanActionSheet';

// Organization Admin Dashboard
const OrgAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [qrScanOpen, setQrScanOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-rajdhani font-bold mb-2">Organization Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage sites, users, and organization-wide settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setQrScanOpen(true)} className="btn-mining">
            <QrCode className="h-4 w-4 mr-2" />
            Scan Equipment QR
          </Button>
          {['overview', 'sites', 'templates', 'compliance', 'analytics'].map((section) => (
            <Button
              key={section}
              variant={activeSection === section ? 'default' : 'outline'}
              onClick={() => setActiveSection(section)}
              size="sm"
              className="capitalize"
            >
              {section}
            </Button>
          ))}
        </div>
      </div>

      {activeSection === 'overview' && (
        <>
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
        </>
      )}

      {activeSection === 'sites' && (
        <Card>
          <CardHeader>
            <CardTitle>Site Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Create and manage sites across your organization</p>
                <Button>
                  <Building2 className="w-4 h-4 mr-2" />
                  Create New Site
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['North Mining Site', 'South Mining Site', 'East Quarry', 'West Operations'].map((site) => (
                  <Card key={site}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="font-semibold">{site}</div>
                        <div className="text-xs text-muted-foreground">34 Equipment • 28 Users</div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">Manage</Button>
                          <Button variant="outline" size="sm">
                            <Users className="w-3 h-3 mr-1" />
                            Assign Admin
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle>Global Form Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage organization-wide inspection and compliance form templates</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-semibold">MSHA Compliance Suite</div>
                  <div className="text-xs text-muted-foreground">12 sites using • Last updated 2 days ago</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-semibold">Workplace Exam Forms</div>
                  <div className="text-xs text-muted-foreground">8 sites using • Last updated 1 week ago</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'compliance' && (
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="font-semibold mb-2">MSHA Compliance</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium text-green-600">Compliant</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Audit:</span>
                    <div className="font-medium">Dec 15, 2024</div>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-semibold mb-2">Equipment Categories</div>
                <div className="flex gap-2 flex-wrap">
                  {['Haul Trucks', 'Excavators', 'Loaders', 'Drills', 'Graders'].map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'analytics' && (
        <Card>
          <CardHeader>
            <CardTitle>Role & Permission Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">248</div>
                    <div className="text-xs text-muted-foreground">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-xs text-muted-foreground">Operators</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">68</div>
                    <div className="text-xs text-muted-foreground">Maintenance</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-xs text-muted-foreground">Site Admins</div>
                  </CardContent>
                </Card>
              </div>
              <div className="border-l-2 border-primary pl-4 space-y-2">
                <div className="font-medium">Recent Role Changes</div>
                {[
                  'Sarah M. promoted to Site Admin at North Site',
                  'John D. assigned Maintenance role at South Site',
                  'Mike R. designated Primary Inspector at East Quarry'
                ].map((change, i) => (
                  <div key={i} className="text-sm text-muted-foreground">• {change}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* QR Scan Action Sheet */}
      <QRScanActionSheet
        open={qrScanOpen}
        onOpenChange={setQrScanOpen}
        equipmentId="CAT-789C-001"
        equipmentName="Haul Truck CAT 789C"
        category="Haul Truck"
        siteName="North Mining Site"
        status="Active"
      />
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
