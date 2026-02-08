'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BulkActions from '@/components/admin/BulkActions';
import {
  Users as UsersIcon,
  Search,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DeleteUserDocument,
  DeleteUserMutation,
  GetUsersDocument,
  GetUsersQuery,
  ToggleUserStatusDocument,
  ToggleUserStatusMutation,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { data, loading, refetch } = useQuery<GetUsersQuery>(GetUsersDocument);

  const [deleteUser, { loading: deleting }] = useMutation<DeleteUserMutation>(
    DeleteUserDocument,
    {
      onCompleted: () => {
        refetch();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: (error) => {
        console.error('Delete error:', error);
        toast.error('Failed to delete user');
      },
    },
  );

  const [toggleUserStatus] = useMutation<ToggleUserStatusMutation>(
    ToggleUserStatusDocument,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        console.error('Toggle status error:', error);
        toast.error('Failed to update user status');
      },
    },
  );

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser({ variables: { id: userToDelete.id } });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus({ variables: { id: userId } });
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((u: any) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  let users = data?.users || [];

  // Apply filters
  users = users.filter((user: any) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && user.isActive) ||
      (filterStatus === 'INACTIVE' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Statistics
  const totalUsers = data?.users?.length || 0;
  const activeUsers = data?.users?.filter((u: any) => u.isActive).length || 0;
  const adminUsers =
    data?.users?.filter(
      (u: any) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN',
    ).length || 0;
  const customerUsers =
    data?.users?.filter((u: any) => u.role === 'CUSTOMER').length || 0;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'CUSTOMER':
        return <UsersIcon className="w-4 h-4 text-green-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CUSTOMER':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, roles, and permissions
          </p>
        </div>
        <Link href="/admin/users/new/edit">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-green-600">
                  {activeUsers}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-3xl font-bold text-purple-600">
                  {adminUsers}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-3xl font-bold text-green-600">
                  {customerUsers}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedUsers={selectedUsers}
          onComplete={refetch}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({users.length} {users.length === 1 ? 'user' : 'users'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your filters
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Email Status</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) =>
                            handleSelectUser(user.id, e.target.checked)
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? (
                            <span className="flex items-center">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <UserX className="w-3 h-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.emailVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/users/${user.id}/activity`}>
                            <Button
                              variant="outline"
                              size="sm"
                              title="View Activity"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/users/${user.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.role === 'SUPER_ADMIN'}
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}
