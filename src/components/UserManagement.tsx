import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Shield, Star, Users } from "lucide-react";
import { AppRole } from "@/contexts/AuthContext";

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: { siteId: string; siteName: string; roles: AppRole[] }[];
  isPrimaryInspector: boolean;
  isBackupInspector: boolean;
  status: "active" | "inactive";
}

const mockUsers: UserData[] = [
  {
    id: "1",
    name: "John Operator",
    email: "operator@minetrak.com",
    roles: [
      { siteId: "site-001", siteName: "North Mining Site", roles: ["operator"] },
    ],
    isPrimaryInspector: false,
    isBackupInspector: false,
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Maintenance",
    email: "maintenance@minetrak.com",
    roles: [
      { siteId: "site-001", siteName: "North Mining Site", roles: ["operator", "maintenance"] },
    ],
    isPrimaryInspector: true,
    isBackupInspector: false,
    status: "active",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@minetrak.com",
    roles: [
      { siteId: "site-001", siteName: "North Mining Site", roles: ["operator", "maintenance", "site_admin"] },
      { siteId: "site-002", siteName: "South Mining Site", roles: ["site_admin"] },
    ],
    isPrimaryInspector: false,
    isBackupInspector: true,
    status: "active",
  },
];

const roleColors: Record<AppRole, string> = {
  operator: "bg-blue-500",
  maintenance: "bg-orange-500",
  site_admin: "bg-purple-500",
  org_admin: "bg-red-500",
};

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (roleFilter === "all") return matchesSearch;
    if (roleFilter === "inspector") {
      return matchesSearch && (user.isPrimaryInspector || user.isBackupInspector);
    }
    
    return matchesSearch && user.roles.some((r) => r.roles.includes(roleFilter as AppRole));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-rajdhani font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="operator">Operators</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="site_admin">Site Admins</SelectItem>
                <SelectItem value="inspector">Inspectors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles by Site</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {user.roles.map((siteRole) => (
                        <div key={siteRole.siteId} className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {siteRole.siteName}
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {siteRole.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="secondary"
                                className="text-xs"
                              >
                                <div className={`w-2 h-2 rounded-full ${roleColors[role]} mr-1`} />
                                {role.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.isPrimaryInspector && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                      {user.isBackupInspector && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Backup
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-1" />
                      Manage Roles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
