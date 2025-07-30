import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  equipmentCount: number;
}

// Mock categories data
const mockCategories: Category[] = [
  { id: '1', name: 'Haul Trucks', createdAt: '2024-01-15', updatedAt: '2024-01-15', equipmentCount: 5 },
  { id: '2', name: 'Excavators', createdAt: '2024-01-16', updatedAt: '2024-01-16', equipmentCount: 3 },
  { id: '3', name: 'Wheel Loaders', createdAt: '2024-01-17', updatedAt: '2024-01-17', equipmentCount: 2 },
  { id: '4', name: 'Dozers', createdAt: '2024-01-18', updatedAt: '2024-01-18', equipmentCount: 1 },
  { id: '5', name: 'Graders', createdAt: '2024-01-19', updatedAt: '2024-01-19', equipmentCount: 0 },
];

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      equipmentCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Category created successfully",
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names (excluding the current category)
    if (categories.some(cat => 
      cat.id !== editingCategory.id && 
      cat.name.toLowerCase() === editingCategory.name.toLowerCase()
    )) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...editingCategory, updatedAt: new Date().toISOString().split('T')[0] }
        : cat
    ));

    setEditingCategory(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.equipmentCount > 0) {
      toast({
        title: "Cannot Delete",
        description: `Cannot delete category "${category.name}" as it is assigned to ${category.equipmentCount} equipment item(s)`,
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(cat => cat.id !== category.id));
    
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Manage Categories</h3>
        
        {/* Add Category Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-mining w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="input-mining"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAddCategory}
                  className="btn-mining flex-1"
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewCategoryName('');
                    setIsAddDialogOpen(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="input-mining pl-10"
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="hidden sm:table-cell">Equipment Count</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No categories found matching your search' : 'No categories created yet'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">
                        {category.equipmentCount} items
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {category.createdAt}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {category.updatedAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {/* Edit Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>

                        {/* Delete Button */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"?
                                {category.equipmentCount > 0 && (
                                  <span className="block mt-2 text-destructive font-medium">
                                    Warning: This category is assigned to {category.equipmentCount} equipment item(s) and cannot be deleted.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category)}
                                disabled={category.equipmentCount > 0}
                                className={category.equipmentCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
                placeholder="Enter category name"
                className="input-mining"
                onKeyDown={(e) => e.key === 'Enter' && handleEditCategory()}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleEditCategory}
                className="btn-mining flex-1"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingCategory(null);
                  setIsEditDialogOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;