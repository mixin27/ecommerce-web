'use client';

import { useState } from 'react';
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
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import {
  ClearCartDocument,
  ClearCartMutation,
  CreateAddressDocument,
  CreateAddressMutation,
  CreateOrderDocument,
  CreateOrderMutation,
  GetMyCartDocument,
  GetMyCartQuery,
  GetUserAddressesDocument,
  GetUserAddressesQuery,
} from '@/graphql/generated/graphql';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const { user } = useAuthStore();

  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const { data: cartData, loading: cartLoading } = useQuery<GetMyCartQuery>(
    GetMyCartDocument,
    {
      fetchPolicy: 'network-only',
    },
  );
  const { data: addressData } = useQuery<GetUserAddressesQuery>(
    GetUserAddressesDocument,
  );

  const [createAddress] = useMutation<CreateAddressMutation>(
    CreateAddressDocument,
    {
      refetchQueries: ['GetUserAddresses'],
    },
  );

  const [clearCart] = useMutation<ClearCartMutation>(ClearCartDocument);

  const [createOrder, { loading: creating }] = useMutation<CreateOrderMutation>(
    CreateOrderDocument,
    {
      onCompleted: async (data) => {
        // Clear the cart after successful order
        await clearCart();
        router.push(`/shop/orders/${data.createOrder.id}`);
      },
      onError: (error) => {
        console.error('Order creation error:', error);
        toast.error('Failed to create order. Please try again.');
      },
    },
  );

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAddress({
        variables: {
          userId: user?.id || '',
          input: newAddress,
        },
      });
      if (!result.data) throw new Error('Failed to create address');

      setSelectedAddressId(result.data.createAddress.id);
      setShowNewAddress(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
    } catch (error) {
      console.error('Address creation error:', error);
      toast.error('Failed to create address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    try {
      await createOrder({
        variables: {
          input: {
            shippingAddressId: selectedAddressId,
            paymentMethod,
          },
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (cartLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  const cart = cartData?.myCart;
  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products before checking out
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const addresses = addressData?.userAddresses || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = 10.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/shop/cart">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.length > 0 && !showNewAddress ? (
                <div className="space-y-3">
                  {addresses.map((address: any) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{address.fullName}</p>
                          <p className="text-sm text-muted-foreground mt-1">
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
                          <p className="text-sm text-muted-foreground">
                            {address.phone}
                          </p>
                        </div>
                        {address.isDefault && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowNewAddress(true)}
                  >
                    Add New Address
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCreateAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={newAddress.fullName}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            fullName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine1: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={newAddress.postalCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postalCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Save Address
                    </Button>
                    {addresses.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddress(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                  <SelectItem value="PAYPAL">PayPal</SelectItem>
                  <SelectItem value="CASH_ON_DELIVERY">
                    Cash on Delivery
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      $
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || creating}
              >
                {creating ? 'Processing...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
