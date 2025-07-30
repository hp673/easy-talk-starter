import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Upload, QrCode, Download, User, Truck, FileText, RotateCcw } from 'lucide-react';

interface AddUserFormProps {
  onSubmit: (userData: any) => void;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator',
    pin: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate user ID
    const userId = `${formData.role.toUpperCase().slice(0, 3)}${Date.now().toString().slice(-3)}`;
    
    const userData = {
      ...formData,
      id: userId,
      lastLogin: new Date().toISOString()
    };

    onSubmit(userData);
    
    toast({
      title: "User Created",
      description: `User ${userData.name} created successfully with ID: ${userId}`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'operator',
      pin: '',
      status: 'active'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-mining">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input-mining"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-mining"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
              <SelectTrigger className="input-mining">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="site_manager">Site Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN (4-6 digits)</Label>
            <Input
              id="pin"
              type="password"
              value={formData.pin}
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
              className="input-mining"
              maxLength={6}
              pattern="[0-9]*"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
              <SelectTrigger className="input-mining">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-mining flex-1">
              Create User
            </Button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Bulk Import</Label>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV File
            </Button>
            <p className="text-xs text-muted-foreground">
              Upload a CSV file with columns: name, email, role, pin
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AddEquipmentFormProps {
  onSubmit: (equipmentData: any) => void;
}

export const AddEquipmentForm: React.FC<AddEquipmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    type: '',
    category: '',
    location: '',
    serialNumber: '',
    year: '',
    status: 'active'
  });

  // Mock categories - in real app, this would come from props or context
  const categories = [
    'Haul Trucks',
    'Excavators', 
    'Wheel Loaders',
    'Dozers',
    'Graders'
  ];

  const generateQRCode = (equipmentId: string) => {
    // Simulate QR code generation
    const qrCodeData = {
      id: equipmentId,
      data: JSON.stringify({ equipmentId, timestamp: Date.now() })
    };
    
    // In a real implementation, this would generate an actual QR code
    toast({
      title: "QR Code Generated",
      description: `QR code for equipment ${equipmentId} is ready for download.`,
    });
    
    return qrCodeData;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate equipment ID
    const prefix = formData.make.slice(0, 3).toUpperCase();
    const suffix = Date.now().toString().slice(-3);
    const equipmentId = `${prefix}-${formData.model.replace(/\s+/g, '').slice(0, 6).toUpperCase()}-${suffix}`;
    
    const equipmentData = {
      ...formData,
      id: equipmentId,
      addedDate: new Date().toISOString().split('T')[0]
    };

    // Generate QR Code
    const qrCode = generateQRCode(equipmentId);

    onSubmit({ ...equipmentData, qrCode });
    
    toast({
      title: "Equipment Added",
      description: `Equipment ${equipmentId} created successfully with QR code.`,
    });

    // Reset form
    setFormData({
      make: '',
      model: '',
      type: '',
      category: '',
      location: '',
      serialNumber: '',
      year: '',
      status: 'active'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-mining">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Add New Equipment
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData({...formData, make: e.target.value})}
                className="input-mining"
                placeholder="e.g., Caterpillar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="input-mining"
                placeholder="e.g., 789C"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="input-mining">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="input-mining">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haul Truck">Haul Truck</SelectItem>
                  <SelectItem value="Excavator">Excavator</SelectItem>
                  <SelectItem value="Wheel Loader">Wheel Loader</SelectItem>
                  <SelectItem value="Bulldozer">Bulldozer</SelectItem>
                  <SelectItem value="Grader">Grader</SelectItem>
                  <SelectItem value="Drill">Drill</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="input-mining"
              placeholder="e.g., Pit A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                className="input-mining"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="input-mining"
                min="1990"
                max="2030"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-mining flex-1">
              <QrCode className="h-4 w-4 mr-2" />
              Create & Generate QR
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const CreateTemplateForm: React.FC = () => {
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    sections: '',
    fields: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate JSON structure
      const sections = JSON.parse(templateData.sections);
      const fields = JSON.parse(templateData.fields);
      
      const template = {
        id: `template_${Date.now()}`,
        name: templateData.name,
        description: templateData.description,
        sections,
        fields,
        createdDate: new Date().toISOString()
      };

      // Save template (in real app, this would go to backend)
      localStorage.setItem(`template_${template.id}`, JSON.stringify(template));
      
      toast({
        title: "Template Created",
        description: `Template "${templateData.name}" created successfully.`,
      });

      // Reset form
      setTemplateData({
        name: '',
        description: '',
        sections: '',
        fields: ''
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax for sections and fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-mining">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Form Template
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateData.name}
              onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
              className="input-mining"
              placeholder="e.g., Heavy Equipment Daily Inspection"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={templateData.description}
              onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
              className="input-mining"
              placeholder="Brief description of the template..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sections">Sections (JSON)</Label>
            <Textarea
              id="sections"
              value={templateData.sections}
              onChange={(e) => setTemplateData({...templateData, sections: e.target.value})}
              className="input-mining font-mono text-sm"
              rows={8}
              placeholder={`[
  {
    "section_id": "basic_info",
    "title": "Basic Information",
    "fields": ["equipment", "date"]
  }
]`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fields">Fields (JSON)</Label>
            <Textarea
              id="fields"
              value={templateData.fields}
              onChange={(e) => setTemplateData({...templateData, fields: e.target.value})}
              className="input-mining font-mono text-sm"
              rows={8}
              placeholder={`[
  {
    "field_id": "equipment",
    "label": "Equipment",
    "field_type": "text",
    "is_required": true
  }
]`}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-mining flex-1">
              Create Template
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ResetPasswordForm: React.FC = () => {
  const [userId, setUserId] = useState('');

  const handleReset = () => {
    if (!userId) {
      toast({
        title: "User ID Required",
        description: "Please enter a user ID to reset password.",
        variant: "destructive"
      });
      return;
    }

    // Generate new PIN
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    toast({
      title: "Password Reset",
      description: `New PIN for ${userId}: ${newPin}. User will be notified.`,
    });

    setUserId('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset User Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetUserId">User ID</Label>
            <Input
              id="resetUserId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input-mining"
              placeholder="Enter user ID..."
            />
          </div>

          <Button onClick={handleReset} className="btn-mining w-full">
            Generate New PIN
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};