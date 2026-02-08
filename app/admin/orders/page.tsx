'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  GetOrdersDocument,
  GetOrdersQuery,
  OrderStatus,
  UpdateOrderStatusDocument,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const ORDER_STATUSES = [
  { value: 'ALL', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusUpdateConfirmOpen, setStatusUpdateConfirmOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    newStatus: string;
  } | null>(null);

  const { data, loading, refetch } = useQuery<GetOrdersQuery>(
    GetOrdersDocument,
    {
      variables: {
        input: {
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          limit: 50,
          offset: 0,
        },
      },
    },
  );

  const [updateOrderStatus, { loading: updatingStatus }] = useMutation(
    UpdateOrderStatusDocument,
    {
      onCompleted: () => {
        refetch();
        setStatusUpdateConfirmOpen(false);
        setPendingStatusUpdate(null);
      },
    },
  );

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setPendingStatusUpdate({ orderId, newStatus });
    setStatusUpdateConfirmOpen(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (pendingStatusUpdate) {
      try {
        await updateOrderStatus({
          variables: {
            id: pendingStatusUpdate.orderId,
            input: { status: mapOrderStatus(pendingStatusUpdate.newStatus) },
          },
        });
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Failed to update order status');
      }
    }
  };

  const mapOrderStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return OrderStatus.Pending;
      case 'PROCESSING':
        return OrderStatus.Processing;
      case 'SHIPPED':
        return OrderStatus.Shipped;
      case 'DELIVERED':
        return OrderStatus.Delivered;
      case 'CANCELLED':
        return OrderStatus.Cancelled;
      case 'REFUNDED':
        return OrderStatus.Refunded;
      default:
        return OrderStatus.Pending;
    }
  };

  const orders = data?.orders || [];
  const filteredOrders = orders.filter(
    (order: any) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center flex-1 space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Order Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o: any) => o.status === 'PENDING').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o: any) => o.status === 'PROCESSING').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o: any) => o.status === 'DELIVERED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium">Order #</th>
                    <th className="text-left p-4 font-medium">Customer</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Payment</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex -space-x-2">
                          {order.items
                            .slice(0, 3)
                            .map(
                              (item: any, idx: number) =>
                                item.product.images?.[0] && (
                                  <img
                                    key={idx}
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  />
                                ),
                            )}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        ${parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(order.id, value)
                          }
                        >
                          <SelectTrigger
                            className={`w-32 ${getStatusColor(order.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">
                              Processing
                            </SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={statusUpdateConfirmOpen}
        onOpenChange={setStatusUpdateConfirmOpen}
        onConfirm={handleStatusUpdateConfirm}
        title="Update Order Status"
        description={`Are you sure you want to update the order status to ${pendingStatusUpdate?.newStatus}?`}
        confirmText="Update Status"
        isLoading={updatingStatus}
      />
    </div>
  );
}
