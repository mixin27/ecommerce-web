'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Folder } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreateCategoryDocument,
  DeleteCategoryDocument,
  GetCategoriesDocument,
  GetCategoriesQuery,
  UpdateCategoryDocument,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const { data, loading, refetch } = useQuery<GetCategoriesQuery>(
    GetCategoriesDocument,
  );

  const [createCategory, { loading: creating }] = useMutation(
    CreateCategoryDocument,
    {
      onCompleted: () => {
        refetch();
        setIsCreateDialogOpen(false);
        setNewCategory({ name: '', slug: '', description: '', image: '' });
      },
    },
  );

  const [deleteCategory, { loading: deletingCategory }] = useMutation(
    DeleteCategoryDocument,
    {
      onCompleted: () => {
        refetch();
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      },
    },
  );

  const [updateCategory, { loading: updating }] = useMutation(
    UpdateCategoryDocument,
    {
      onCompleted: () => {
        refetch();
        setIsEditDialogOpen(false);
        setEditingCategory(null);
      },
    },
  );

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory({
        variables: {
          input: {
            name: newCategory.name,
            slug:
              newCategory.slug ||
              newCategory.name.toLowerCase().replace(/\s+/g, '-'),
            description: newCategory.description || undefined,
            image: newCategory.image || undefined,
          },
        },
      });
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory({
        variables: {
          id: editingCategory.id,
          input: {
            id: editingCategory.id,
            name: editFormData.name,
            slug: editFormData.slug,
            description: editFormData.description || undefined,
            image: editFormData.image || undefined,
          },
        },
      });
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update category');
    }
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory({ variables: { id: categoryToDelete.id } });
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const categories = data?.categories || [];
  const rootCategories = categories.filter((cat: any) => !cat.parent);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Organize your products into categories
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize your products
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, slug: e.target.value })
                    }
                    placeholder="Auto-generated from name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newCategory.image}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category details for {editingCategory?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCategory}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={editFormData.slug}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    value={editFormData.image}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
          isLoading={deletingCategory}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rootCategories.map((category: any) => (
            <Card key={category.id} className="overflow-hidden">
              {category.image && (
                <div className="aspect-video bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center">
                      <Folder className="w-5 h-5 mr-2 text-primary" />
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.children && category.children.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">Subcategories:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.children.map((child: any) => (
                          <span
                            key={child.id}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {child.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
