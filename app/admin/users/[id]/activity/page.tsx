'use client';

import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  GetOrdersDocument,
  GetOrdersQuery,
  GetUserDocument,
  GetUserQuery,
} from '@/graphql/generated/graphql';
import { use } from 'react';

export default function UserActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: userData, loading: loadingUser } = useQuery<GetUserQuery>(
    GetUserDocument,
    {
      variables: { id },
    },
  );

  const { data: ordersData, loading: loadingOrders } = useQuery<GetOrdersQuery>(
    GetOrdersDocument,
    {
      variables: {
        input: {
          limit: 100,
          offset: 0,
          userId: id,
        },
      },
    },
  );

  if (loadingUser || loadingOrders) {
    return <div className="text-center py-12">Loading activity...</div>;
  }

  const user = userData?.user;
  const orders = ordersData?.orders || [];

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <Link href="/admin/users">
          <Button>Back to Users</Button>
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum: number, order: any) => sum + parseFloat(order.total),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const completedOrders = orders.filter(
    (o: any) => o.status === 'DELIVERED',
  ).length;

  // Orders by status
  const ordersByStatus = {
    PENDING: orders.filter((o: any) => o.status === 'PENDING').length,
    PROCESSING: orders.filter((o: any) => o.status === 'PROCESSING').length,
    SHIPPED: orders.filter((o: any) => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter((o: any) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o: any) => o.status === 'CANCELLED').length,
  };

  const statusChartData = [
    { name: 'Pending', value: ordersByStatus.PENDING },
    { name: 'Processing', value: ordersByStatus.PROCESSING },
    { name: 'Shipped', value: ordersByStatus.SHIPPED },
    { name: 'Delivered', value: ordersByStatus.DELIVERED },
    { name: 'Cancelled', value: ordersByStatus.CANCELLED },
  ];

  // Orders over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const ordersOverTime = last30Days.map((date) => {
    const dayOrders = orders.filter(
      (o: any) => o.createdAt.split('T')[0] === date,
    );
    const dayRevenue = dayOrders.reduce(
      (sum: number, o: any) => sum + parseFloat(o.total),
      0,
    );
    return {
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      orders: dayOrders.length,
      revenue: dayRevenue,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name}'s Activity</h1>
          <p className="text-muted-foreground mt-2">
            Customer insights and order history
          </p>
        </div>
        <Link href={`/admin/users/${id}/edit`}>
          <Button variant="outline">Edit User</Button>
        </Link>
      </div>

      {/* User Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order</p>
                <p className="text-3xl font-bold">
                  ${averageOrderValue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedOrders}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3B82F6"
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({orders.slice(0, 10).length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 10).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Package className="w-3 h-3 mr-1" />
                        {order.items.length}{' '}
                        {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="flex items-center">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {order.paymentMethod}
                      </span>
                      {order.shippingAddress && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${parseFloat(order.total).toFixed(2)}
                    </p>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Saved Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {user.addresses.map((address: any) => (
                <div key={address.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{address.fullName}</p>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && (
                    <p className="text-sm text-muted-foreground">
                      {address.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.country}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
