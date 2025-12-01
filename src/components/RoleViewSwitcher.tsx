import { useAuth, AppRole } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Wrench, Shield, Building2 } from "lucide-react";

const roleConfig: Record<AppRole, { label: string; icon: typeof User; color: string }> = {
  operator: { label: "Operator View", icon: User, color: "bg-blue-500" },
  maintenance: { label: "Maintenance View", icon: Wrench, color: "bg-orange-500" },
  site_admin: { label: "Site Admin View", icon: Shield, color: "bg-purple-500" },
  org_admin: { label: "Org Admin View", icon: Building2, color: "bg-red-500" },
};

export const RoleViewSwitcher = () => {
  const { currentRoleView, setCurrentRoleView, getCurrentSiteRoles, getInspectorFlags } = useAuth();
  const availableRoles = getCurrentSiteRoles();
  const inspectorFlags = getInspectorFlags();

  if (availableRoles.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentRoleView || undefined}
        onValueChange={(value) => setCurrentRoleView(value as AppRole)}
      >
        <SelectTrigger className="w-[200px] bg-background border-border">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            return (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  <Icon className="w-4 h-4" />
                  {config.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      {inspectorFlags && (inspectorFlags.isPrimary || inspectorFlags.isBackup) && (
        <div className="flex gap-1">
          {inspectorFlags.isPrimary && (
            <Badge variant="default" className="text-xs">
              Primary Inspector
            </Badge>
          )}
          {inspectorFlags.isBackup && (
            <Badge variant="secondary" className="text-xs">
              Backup Inspector
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
