'use client';

import { use, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
  GetOrderDocument,
  GetOrderQuery,
  UpdateOrderStatusDocument,
  UpdateOrderStatusMutation,
} from '@/graphql/generated/graphql';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { data, loading, refetch } = useQuery<GetOrderQuery>(GetOrderDocument, {
    variables: { id },
  });

  const [updateOrderStatus] = useMutation<UpdateOrderStatusMutation>(
    UpdateOrderStatusDocument,
    {
      onCompleted: () => {
        refetch();
        setUpdatingStatus(false);
      },
      onError: (error) => {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
        setUpdatingStatus(false);
      },
    },
  );

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    await updateOrderStatus({
      variables: {
        id,
        input: { status: newStatus as any },
      },
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  const order = data?.order;

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link href="/admin/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-center p-4 font-medium">Qty</th>
                      <th className="text-right p-4 font-medium">Price</th>
                      <th className="text-right p-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {item.product.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground font-mono">
                                ID: {item.product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">{item.quantity}</td>
                        <td className="p-4 text-right">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-bold">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={3}
                        className="p-4 text-right text-muted-foreground"
                      >
                        Subtotal
                      </td>
                      <td className="p-4 text-right">
                        ${parseFloat(order.subtotal).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="p-4 text-right text-muted-foreground"
                      >
                        Shipping
                      </td>
                      <td className="p-4 text-right">
                        ${parseFloat(order.shippingCost).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="p-4 text-right text-muted-foreground"
                      >
                        Tax
                      </td>
                      <td className="p-4 text-right">
                        ${parseFloat(order.tax).toFixed(2)}
                      </td>
                    </tr>
                    {parseFloat(order.discount) > 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-4 text-right text-green-600"
                        >
                          Discount
                        </td>
                        <td className="p-4 text-right text-green-600">
                          -${parseFloat(order.discount).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2">
                      <td
                        colSpan={3}
                        className="p-4 text-right font-bold text-lg"
                      >
                        Total
                      </td>
                      <td className="p-4 text-right font-bold text-lg">
                        ${parseFloat(order.total).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {order.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Link href={`/admin/users/${order.user.id}/activity`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Customer History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="font-semibold">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tracking Number
                  </p>
                  <p className="font-mono">
                    {order.trackingNumber || 'Not assigned'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {(order.customerNotes || order.adminNotes) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {order.customerNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm p-3 bg-yellow-50 rounded italic border border-yellow-100">
                      "{order.customerNotes}"
                    </p>
                  </CardContent>
                </Card>
              )}
              {order.adminNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">
                      Internal Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm p-3 bg-blue-50 rounded italic border border-blue-100">
                      "{order.adminNotes}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-semibold">
                  {order.shippingAddress.fullName}
                </p>
                <p className="flex items-center text-muted-foreground pb-2">
                  <Phone className="w-3 h-3 mr-2" />
                  {order.shippingAddress.phone}
                </p>
                <div className="pt-2 border-t">
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium uppercase">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">
                  TXN-{order.id.split('-')[0].toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-px h-full bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
