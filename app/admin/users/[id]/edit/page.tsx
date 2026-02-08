'use client';

import { useState, useEffect, use } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  Shield,
  Mail,
  User as UserIcon,
  Calendar,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import {
  CreateUserDocument,
  CreateUserMutation,
  GetUserDocument,
  GetUserQuery,
  UpdateUserDocument,
  UpdateUserMutation,
} from '@/graphql/generated/graphql';

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    isActive: true,
    emailVerified: false,
  });

  const { data: userData, loading: loadingUser } = useQuery<GetUserQuery>(
    GetUserDocument,
    {
      variables: { id },
      skip: isNew,
    },
  );

  const [updateUser, { loading: updating }] = useMutation<UpdateUserMutation>(
    UpdateUserDocument,
    {
      onCompleted: () => {
        router.push('/admin/users');
      },
      onError: (error) => {
        console.error('Update error:', error);
        alert('Failed to update user');
      },
    },
  );

  const [createUser, { loading: creating }] = useMutation<CreateUserMutation>(
    CreateUserDocument,
    {
      onCompleted: () => {
        router.push('/admin/users');
      },
      onError: (error) => {
        console.error('Create error:', error);
        alert('Failed to create user');
      },
    },
  );

  useEffect(() => {
    if (!isNew && userData?.user) {
      const user = userData.user;
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
      });
    }
  }, [isNew, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      isActive: formData.isActive,
      emailVerified: formData.emailVerified,
    };

    if (isNew) {
      if (!formData.password) {
        alert('Password is required for new users');
        return;
      }
      input.password = formData.password;
    } else if (formData.password) {
      input.password = formData.password;
    }

    try {
      if (isNew) {
        await createUser({ variables: { input } });
      } else {
        await updateUser({ variables: { id, input } });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (!isNew && loadingUser) {
    return <div className="text-center py-12">Loading user...</div>;
  }

  const user = userData?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Create New User' : 'Edit User'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isNew
              ? 'Add a new user to the system'
              : `Manage ${user?.name}'s account`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password {isNew ? '*' : '(Leave blank to keep current)'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={isNew}
                    placeholder={isNew ? '' : 'Enter new password to change'}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.role === 'CUSTOMER' &&
                      'Can shop and place orders'}
                    {formData.role === 'ADMIN' &&
                      'Can manage products, orders, and view analytics'}
                    {formData.role === 'SUPER_ADMIN' &&
                      'Full system access including user management'}
                  </p>
                </div>

                {/* Status Toggles */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isActive">Account Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Inactive users cannot log in
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailVerified">Email Verification</Label>
                      <p className="text-xs text-muted-foreground">
                        Mark email as verified
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="emailVerified"
                        checked={formData.emailVerified}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailVerified: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={updating || creating}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updating || creating
                      ? 'Saving...'
                      : isNew
                        ? 'Create User'
                        : 'Update User'}
                  </Button>
                  {!isNew && (
                    <Link
                      href={`/admin/users/${id}/activity`}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        View Activity
                      </Button>
                    </Link>
                  )}
                  <Link href="/admin/users" className={isNew ? 'flex-1' : ''}>
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* User Details Sidebar */}
        <div className="space-y-6">
          {!isNew && user && (
            <>
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              {user.addresses && user.addresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Saved Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user.addresses.map((address: any) => (
                      <div
                        key={address.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <p className="font-medium text-sm">
                          {address.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {address.addressLine1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {address.country}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Role Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {formData.role === 'CUSTOMER' && (
                      <>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Browse and purchase products
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Manage cart and wishlist
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          View order history
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Write product reviews
                        </p>
                      </>
                    )}
                    {formData.role === 'ADMIN' && (
                      <>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          All customer permissions
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Manage products and categories
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Process and update orders
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          View analytics and reports
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Manage inventory
                        </p>
                      </>
                    )}
                    {formData.role === 'SUPER_ADMIN' && (
                      <>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          All admin permissions
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Manage users and roles
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          System configuration
                        </p>
                        <p className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Full access to all features
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
