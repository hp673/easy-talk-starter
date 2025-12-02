import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanActionSheet } from "@/components/QRScanActionSheet";
import { QrCode } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function QRScanDemo() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, getCurrentSiteRoles } = useAuth();

  const handleScan = () => {
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              QR Scan Action Sheet Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/20">
              <h3 className="font-semibold mb-2">Current User: {user?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Active Roles: {getCurrentSiteRoles().join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                The action sheet below will show different options based on your assigned roles.
              </p>
            </div>

            <Button onClick={handleScan} className="w-full" size="lg">
              <QrCode className="w-5 h-5 mr-2" />
              Simulate QR Scan
            </Button>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Test with different users:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>OP001 (1234) - Operator only</li>
                <li>MAINT002 (5678) - Operator + Maintenance</li>
                <li>ADM003 (0000) - Operator + Maintenance + Site Admin</li>
                <li>ORGADM004 (9999) - All roles</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <QRScanActionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        equipmentId="CAT-789C-001"
        equipmentName="Haul Truck CAT 789C"
        category="Haul Truck"
        siteName="North Mining Site"
        status="Active"
      />
    </div>
  );
}
