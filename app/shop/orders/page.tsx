'use client';

import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import {
  GetMyOrdersDocument,
  GetMyOrdersQuery,
} from '@/graphql/generated/graphql';

export default function OrdersPage() {
  const { data, loading } = useQuery<GetMyOrdersQuery>(GetMyOrdersDocument);

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  const orders = data?.myOrders || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

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

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">
          Start shopping to see your orders here
        </p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × $
                        {parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.addressLine1}
                  <br />
                  {order.shippingAddress.addressLine2 && (
                    <>
                      {order.shippingAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${parseFloat(order.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${parseFloat(order.tax).toFixed(2)}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-sm mb-1 text-green-600">
                    <span>Discount</span>
                    <span>-${parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Tracking */}
              {order.trackingNumber && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Tracking Number</p>
                  <p className="text-sm text-muted-foreground">
                    {order.trackingNumber}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/shop/orders/${order.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                {order.status === 'DELIVERED' && (
                  <Button variant="outline">Leave Review</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
