'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClearCartDocument,
  GetMyCartDocument,
  GetMyCartQuery,
  RemoveFromCartDocument,
  UpdateCartItemDocument,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function CartPage() {
  const router = useRouter();
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false);

  const { data, loading, refetch } = useQuery<GetMyCartQuery>(
    GetMyCartDocument,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [updateCartItem, { loading: updating }] = useMutation(
    UpdateCartItemDocument,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        console.error('Update cart error:', error);
        toast.error('Failed to update cart');
      },
    },
  );

  const [removeFromCart, { loading: removing }] = useMutation(
    RemoveFromCartDocument,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        console.error('Remove from cart error:', error);
        toast.error('Failed to remove item from cart');
      },
    },
  );

  const [clearCart, { loading: clearing }] = useMutation(ClearCartDocument, {
    onCompleted: () => {
      refetch();
      setIsClearCartDialogOpen(false);
    },
    onError: (error) => {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    },
  });

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItem({
        variables: {
          input: {
            itemId,
            quantity,
          },
        },
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart({
        variables: { itemId },
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleClearCartClick = () => {
    setIsClearCartDialogOpen(true);
  };

  const handleClearCartConfirm = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = () => {
    router.push('/shop/checkout');
  };

  if (loading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  const cart = data?.myCart;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const itemCount = cart?.itemCount || 0;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to get started
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <Link href={`/shop/products/${item.product.slug}`}>
                      <h3 className="font-semibold text-lg hover:text-primary">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground">
                      ${parseFloat(item.product.price).toFixed(2)} each
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {item.product.stock} available
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        disabled={updating || item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          updating || item.quantity >= item.product.stock
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      $
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removing}
                      className="mt-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {removing ? 'Removing...' : 'Remove'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={handleClearCartClick}
            disabled={clearing}
            className="w-full"
          >
            {clearing ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isClearCartDialogOpen}
        onOpenChange={setIsClearCartDialogOpen}
        onConfirm={handleClearCartConfirm}
        title="Clear Cart"
        description="Are you sure you want to remove all items from your cart?"
        confirmText="Clear Cart"
        variant="destructive"
        isLoading={clearing}
      />
    </div>
  );
}
