import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  Truck, 
  Edit, 
  Trash2, 
  Grid, 
  List,
  FileText,
  X
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Site {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'active' | 'inactive';
  memberCount: number;
  equipmentCount: number;
  createdAt: string;
  updatedAt: string;
  assignedUsers: string[];
  assignedEquipment: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
}

const mockUsers: User[] = [
  { id: 'user-001', name: 'John Operator', email: 'john@mine.com', role: 'Operator' },
  { id: 'user-002', name: 'Sarah Tech', email: 'sarah@mine.com', role: 'Technician' },
  { id: 'user-003', name: 'Mike Manager', email: 'mike@mine.com', role: 'Site Manager' },
  { id: 'user-004', name: 'Jane Admin', email: 'jane@mine.com', role: 'Admin' },
  { id: 'user-005', name: 'Tom Engineer', email: 'tom@mine.com', role: 'Engineer' },
  { id: 'user-006', name: 'Lisa Supervisor', email: 'lisa@mine.com', role: 'Supervisor' },
];

const mockEquipment: Equipment[] = [
  { id: 'eq-001', name: 'Excavator CAT 320', type: 'Excavator' },
  { id: 'eq-002', name: 'Dump Truck Volvo A40G', type: 'Haul Truck' },
  { id: 'eq-003', name: 'Bulldozer CAT D8T', type: 'Bulldozer' },
  { id: 'eq-004', name: 'Loader CAT 966M', type: 'Wheel Loader' },
  { id: 'eq-005', name: 'Grader CAT 140M3', type: 'Motor Grader' },
];

const mockSites: Site[] = [
  {
    id: 'site-001',
    name: 'North Pit Mine',
    location: 'Queensland, Australia',
    description: 'Primary excavation site for coal mining operations',
    status: 'active',
    memberCount: 24,
    equipmentCount: 18,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    assignedUsers: ['user-001', 'user-002', 'user-003'],
    assignedEquipment: ['eq-001', 'eq-002', 'eq-003']
  },
  {
    id: 'site-002',
    name: 'South Processing Plant',
    location: 'Western Australia',
    description: 'Ore processing and refining facility',
    status: 'active',
    memberCount: 16,
    equipmentCount: 12,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-08',
    assignedUsers: ['user-004', 'user-005'],
    assignedEquipment: ['eq-004', 'eq-005']
  },
  {
    id: 'site-003',
    name: 'East Ridge Exploration',
    location: 'Northern Territory',
    description: 'New exploration and survey site',
    status: 'inactive',
    memberCount: 8,
    equipmentCount: 6,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
    assignedUsers: ['user-006'],
    assignedEquipment: []
  }
];

const SiteManagement = () => {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    assignedUsers: [] as string[],
    assignedEquipment: [] as string[]
  });

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSite = () => {
    const newSite: Site = {
      id: `site-${String(sites.length + 1).padStart(3, '0')}`,
      ...formData,
      memberCount: formData.assignedUsers.length,
      equipmentCount: formData.assignedEquipment.length,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setSites([...sites, newSite]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: 'Site Created',
      description: `${newSite.name} has been added with ${formData.assignedUsers.length} members.`
    });
  };

  const handleUpdateSite = () => {
    if (!editingSite) return;
    
    setSites(sites.map(site => 
      site.id === editingSite.id 
        ? { 
            ...site, 
            ...formData, 
            memberCount: formData.assignedUsers.length,
            equipmentCount: formData.assignedEquipment.length,
            updatedAt: new Date().toISOString().split('T')[0] 
          }
        : site
    ));
    setEditingSite(null);
    resetForm();
    toast({
      title: 'Site Updated',
      description: 'Site information has been updated successfully.'
    });
  };

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(site => site.id !== siteId));
    toast({
      title: 'Site Deleted',
      description: 'Site has been removed from the system.',
      variant: 'destructive'
    });
  };

  const openEditDialog = (site: Site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      location: site.location,
      description: site.description,
      status: site.status,
      assignedUsers: site.assignedUsers,
      assignedEquipment: site.assignedEquipment
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      status: 'active',
      assignedUsers: [],
      assignedEquipment: []
    });
  };

  const toggleUserAssignment = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };

  const toggleEquipmentAssignment = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedEquipment: prev.assignedEquipment.includes(equipmentId)
        ? prev.assignedEquipment.filter(id => id !== equipmentId)
        : [...prev.assignedEquipment, equipmentId]
    }));
  };

  const removeUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.filter(id => id !== userId)
    }));
  };

  const removeEquipment = (equipmentId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedEquipment: prev.assignedEquipment.filter(id => id !== equipmentId)
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-rajdhani font-bold uppercase tracking-wide mb-2">
          Site Management
        </h1>
        <p className="text-muted-foreground">
          Manage mining sites, assign equipment and team members
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sites</p>
                <p className="text-2xl font-bold font-rajdhani">{sites.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sites</p>
                <p className="text-2xl font-bold font-rajdhani">
                  {sites.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Equipment</p>
                <p className="text-2xl font-bold font-rajdhani">
                  {sites.reduce((sum, site) => sum + site.equipmentCount, 0)}
                </p>
              </div>
              <Truck className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)} className="font-rajdhani">
          <Plus className="h-4 w-4 mr-2" />
          Create Site
        </Button>
      </div>

      {/* Sites Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map(site => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-rajdhani text-lg">{site.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {site.location}
                    </CardDescription>
                  </div>
                  <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {site.description}
                </p>
                
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{site.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{site.equipmentCount} equipment</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditDialog(site)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-rajdhani">Site Name</TableHead>
                <TableHead className="font-rajdhani">Location</TableHead>
                <TableHead className="font-rajdhani">Status</TableHead>
                <TableHead className="font-rajdhani">Members</TableHead>
                <TableHead className="font-rajdhani">Equipment</TableHead>
                <TableHead className="font-rajdhani">Updated</TableHead>
                <TableHead className="font-rajdhani">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map(site => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell>
                    <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{site.memberCount}</TableCell>
                  <TableCell>{site.equipmentCount}</TableCell>
                  <TableCell>{site.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(site)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSite(site.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateDialogOpen || !!editingSite} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingSite(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-xl">
              {editingSite ? 'Edit Site' : 'Create New Site'}
            </DialogTitle>
            <DialogDescription>
              {editingSite ? 'Update site information and settings' : 'Add a new mining site to your organization'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., North Pit Mine"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Queensland, Australia"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the site and its operations..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Assign Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assign Members
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select users who will have access to this site
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formData.assignedUsers.length} selected
                  </Badge>
                </div>

                {/* Selected Users */}
                {formData.assignedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                    {formData.assignedUsers.map(userId => {
                      const user = mockUsers.find(u => u.id === userId);
                      return user ? (
                        <Badge key={userId} variant="secondary" className="gap-2">
                          {user.name}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeUser(userId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                {/* User Selection List */}
                <div className="border rounded-lg">
                  <ScrollArea className="h-[200px]">
                    <div className="p-2 space-y-1">
                      {mockUsers.map(user => (
                        <div 
                          key={user.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => toggleUserAssignment(user.id)}
                        >
                          <Checkbox 
                            checked={formData.assignedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserAssignment(user.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email} • {user.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <Separator />

              {/* Assign Equipment */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Assign Equipment
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select equipment that will be used at this site
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formData.assignedEquipment.length} selected
                  </Badge>
                </div>

                {/* Selected Equipment */}
                {formData.assignedEquipment.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                    {formData.assignedEquipment.map(equipmentId => {
                      const equipment = mockEquipment.find(e => e.id === equipmentId);
                      return equipment ? (
                        <Badge key={equipmentId} variant="secondary" className="gap-2">
                          {equipment.name}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeEquipment(equipmentId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Equipment Selection List */}
                <div className="border rounded-lg">
                  <ScrollArea className="h-[200px]">
                    <div className="p-2 space-y-1">
                      {mockEquipment.map(equipment => (
                        <div 
                          key={equipment.id}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => toggleEquipmentAssignment(equipment.id)}
                        >
                          <Checkbox 
                            checked={formData.assignedEquipment.includes(equipment.id)}
                            onCheckedChange={() => toggleEquipmentAssignment(equipment.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{equipment.name}</p>
                            <p className="text-xs text-muted-foreground">{equipment.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingSite(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingSite ? handleUpdateSite : handleCreateSite}
              disabled={!formData.name || !formData.location}
              className="font-rajdhani"
            >
              {editingSite ? 'Update Site' : 'Create Site'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SiteManagement;
