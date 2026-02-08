'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import {
    AddToCartDocument,
  GetMyCartDocument,
  GetMyWishlistDocument,
  GetMyWishlistQuery,
  RemoveFromWishlistDocument,
} from '@/graphql/generated/graphql';

export default function WishlistPage() {
  const { data, loading, refetch } = useQuery<GetMyWishlistQuery>(
    GetMyWishlistDocument,
  );

  const [removeFromWishlist, { loading: removing }] = useMutation(
    RemoveFromWishlistDocument,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
        console.error('Remove from wishlist error:', error);
        alert('Failed to remove from wishlist');
      },
    },
  );

  const [addToCart, { loading: addingToCart }] = useMutation(AddToCartDocument, {
    refetchQueries: [{ query: GetMyCartDocument }],
    onCompleted: () => {
      alert('Product added to cart!');
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    },
  });

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist({
        variables: { productId },
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        variables: {
          input: {
            productId,
            quantity: 1,
          },
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading wishlist...</div>;
  }

  const wishlist = data?.myWishlist;
  const items = wishlist?.items || [];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add products you love to your wishlist
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
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any) => (
          <Card key={item.id} className="overflow-hidden">
            <Link href={`/shop/products/${item.product.slug}`}>
              <div className="aspect-square relative bg-gray-100">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    No Image
                  </div>
                )}
                {!item.product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>
            </Link>
            <CardHeader>
              <Link href={`/shop/products/${item.product.slug}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                  {item.product.name}
                </h3>
              </Link>
              {item.product.category && (
                <p className="text-sm text-muted-foreground">
                  {item.product.category.name}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${parseFloat(item.product.price).toFixed(2)}
                  </span>
                  {item.product.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${parseFloat(item.product.comparePrice).toFixed(2)}
                    </span>
                  )}
                </div>
                {item.product.averageRating && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">
                      {item.product.averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      ({item.product.reviewCount})
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
                {item.product.stock > 0 ? (
                  <span className="text-sm text-green-600 font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(item.product.id)}
                disabled={
                  item.product.stock === 0 ||
                  addingToCart ||
                  !item.product.isActive
                }
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemove(item.product.id)}
                disabled={removing}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
