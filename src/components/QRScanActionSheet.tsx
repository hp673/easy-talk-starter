import { useAuth, AppRole } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Wrench,
  ClipboardCheck,
  Edit,
  UserPlus,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QRScanActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  equipmentName: string;
}

interface Action {
  id: string;
  label: string;
  icon: typeof FileText;
  requiredRoles: AppRole[];
  variant?: "default" | "destructive" | "outline";
  description: string;
}

const availableActions: Action[] = [
  {
    id: "view-details",
    label: "View Equipment Details",
    icon: Eye,
    requiredRoles: ["operator", "maintenance", "site_admin", "org_admin"],
    variant: "outline",
    description: "View full equipment information",
  },
  {
    id: "start-inspection",
    label: "Start Inspection",
    icon: ClipboardCheck,
    requiredRoles: ["operator", "maintenance", "site_admin", "org_admin"],
    variant: "default",
    description: "Begin pre-shift or compliance inspection",
  },
  {
    id: "create-maintenance",
    label: "Create Maintenance Request",
    icon: AlertTriangle,
    requiredRoles: ["maintenance", "site_admin", "org_admin"],
    variant: "outline",
    description: "Report issue or schedule maintenance",
  },
  {
    id: "update-maintenance",
    label: "Update/Close Maintenance",
    icon: CheckCircle,
    requiredRoles: ["maintenance", "site_admin", "org_admin"],
    variant: "outline",
    description: "Update or complete maintenance work",
  },
  {
    id: "assign-inspector",
    label: "Assign Inspector",
    icon: UserPlus,
    requiredRoles: ["site_admin", "org_admin"],
    variant: "outline",
    description: "Designate inspector for this equipment",
  },
  {
    id: "edit-equipment",
    label: "Edit Equipment",
    icon: Edit,
    requiredRoles: ["site_admin", "org_admin"],
    variant: "outline",
    description: "Update equipment settings and details",
  },
];

export const QRScanActionSheet = ({
  open,
  onOpenChange,
  equipmentId,
  equipmentName,
}: QRScanActionSheetProps) => {
  const { getCurrentSiteRoles } = useAuth();
  const userRoles = getCurrentSiteRoles();

  const canPerformAction = (action: Action): boolean => {
    return action.requiredRoles.some((role) => userRoles.includes(role));
  };

  const allowedActions = availableActions.filter(canPerformAction);
  const disabledActions = availableActions.filter((a) => !canPerformAction(a));

  const handleAction = (actionId: string) => {
    console.log(`Performing action: ${actionId} on equipment: ${equipmentId}`);
    // In real implementation, navigate to appropriate screen
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="font-rajdhani text-2xl">
            {equipmentName}
          </SheetTitle>
          <SheetDescription>ID: {equipmentId}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Available Actions */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Available Actions
            </h3>
            <div className="space-y-2">
              {allowedActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || "outline"}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => handleAction(action.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{action.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Disabled Actions */}
          {disabledActions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Requires Additional Permissions
                </h3>
                <div className="space-y-2">
                  {disabledActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={action.id}
                        className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30 opacity-60"
                      >
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {action.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {action.description}
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {action.requiredRoles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className="text-xs"
                              >
                                {role.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
