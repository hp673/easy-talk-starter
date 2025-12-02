import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  MessageSquare,
  Package,
  History,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface QRScanActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  equipmentName: string;
  category?: string;
  siteName?: string;
  status?: string;
}

interface Action {
  id: string;
  label: string;
  icon: typeof FileText;
  requiredRoles: AppRole[];
  variant?: "default" | "destructive" | "outline";
  description: string;
  navigateTo?: string;
}

const availableActions: Action[] = [
  // Operator Actions
  {
    id: "start-inspection",
    label: "Start Inspection",
    icon: ClipboardCheck,
    requiredRoles: ["operator"],
    variant: "default",
    description: "Begin pre-shift or compliance inspection",
    navigateTo: "/equipment-selection",
  },
  {
    id: "view-past-inspections",
    label: "View Past Inspections",
    icon: History,
    requiredRoles: ["operator"],
    variant: "outline",
    description: "Review inspection history for this equipment",
    navigateTo: "/operator-history",
  },
  {
    id: "report-defect",
    label: "Report a Defect",
    icon: AlertTriangle,
    requiredRoles: ["operator"],
    variant: "outline",
    description: "Create maintenance request for an issue",
    navigateTo: "/defect-documentation",
  },
  
  // Maintainer Actions
  {
    id: "view-maintenance",
    label: "View Maintenance Requests",
    icon: Wrench,
    requiredRoles: ["maintenance"],
    variant: "outline",
    description: "View all maintenance requests for this equipment",
    navigateTo: "/maintenance-dashboard",
  },
  {
    id: "update-status",
    label: "Update Maintenance Status",
    icon: CheckCircle,
    requiredRoles: ["maintenance"],
    variant: "outline",
    description: "Update progress on maintenance work",
    navigateTo: "/maintenance-dashboard",
  },
  {
    id: "add-comments",
    label: "Add Comments",
    icon: MessageSquare,
    requiredRoles: ["maintenance"],
    variant: "outline",
    description: "Add notes to maintenance ticket",
    navigateTo: "/maintenance-dashboard",
  },
  {
    id: "mark-resolved",
    label: "Mark as Resolved",
    icon: CheckCircle,
    requiredRoles: ["maintenance"],
    variant: "default",
    description: "Close maintenance ticket",
    navigateTo: "/maintenance-dashboard",
  },
  {
    id: "view-parts",
    label: "View Parts Required",
    icon: Package,
    requiredRoles: ["maintenance"],
    variant: "outline",
    description: "Check parts inventory and requirements",
  },
  
  // Site Admin Actions
  {
    id: "edit-equipment",
    label: "Edit Equipment Details",
    icon: Edit,
    requiredRoles: ["site_admin"],
    variant: "outline",
    description: "Update equipment settings and information",
    navigateTo: "/admin-portal",
  },
  {
    id: "assign-site",
    label: "Assign Equipment to Another Site",
    icon: MapPin,
    requiredRoles: ["site_admin"],
    variant: "outline",
    description: "Transfer equipment to different site",
    navigateTo: "/admin-portal",
  },
  {
    id: "view-all-tickets",
    label: "View All Tickets",
    icon: FileText,
    requiredRoles: ["site_admin"],
    variant: "outline",
    description: "View complete ticket history for this equipment",
    navigateTo: "/admin-portal",
  },
  
  // Organization Admin Actions
  {
    id: "view-audit",
    label: "View Audit History",
    icon: History,
    requiredRoles: ["org_admin"],
    variant: "outline",
    description: "View full audit trail and history",
    navigateTo: "/role-dashboard",
  },
  {
    id: "assign-technician",
    label: "Reassign to Technician",
    icon: UserPlus,
    requiredRoles: ["org_admin"],
    variant: "outline",
    description: "Assign maintenance work to specific technician",
    navigateTo: "/role-dashboard",
  },
];

export const QRScanActionSheet = ({
  open,
  onOpenChange,
  equipmentId,
  equipmentName,
  category = "Haul Truck",
  siteName = "North Mining Site",
  status = "Active",
}: QRScanActionSheetProps) => {
  const { getCurrentSiteRoles } = useAuth();
  const navigate = useNavigate();
  const userRoles = getCurrentSiteRoles();

  const canPerformAction = (action: Action): boolean => {
    return action.requiredRoles.some((role) => userRoles.includes(role));
  };

  const allowedActions = availableActions.filter(canPerformAction);
  const disabledActions = availableActions.filter((a) => !canPerformAction(a));

  const handleAction = (action: Action) => {
    console.log(`Performing action: ${action.id} on equipment: ${equipmentId}`);
    onOpenChange(false);
    
    if (action.navigateTo) {
      navigate(action.navigateTo);
    }
  };

  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "critical":
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case "under maintenance":
        return <Badge className="bg-yellow-600 text-white">Under Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="text-left space-y-4">
          <SheetTitle className="font-rajdhani text-2xl">
            {equipmentName}
          </SheetTitle>
          
          {/* Equipment Details Card */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Equipment ID:</span>
                <p className="font-semibold">{equipmentId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-semibold">{category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Site:</span>
                <p className="font-semibold">{siteName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Showing actions for your roles: {userRoles.map(r => r.replace('_', ' ')).join(', ')}</span>
          </div>
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
                    onClick={() => handleAction(action)}
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
