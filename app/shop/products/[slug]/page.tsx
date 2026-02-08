'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Heart, Truck, Shield } from 'lucide-react';
import { use, useState } from 'react';
import Link from 'next/link';
import {
  AddToCartDocument,
  AddToCartMutation,
  GetMyCartDocument,
  GetProductDocument,
  GetProductQuery,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);

  const { data, loading } = useQuery<GetProductQuery>(GetProductDocument, {
    variables: { slug },
  });

  const [addToCart, { loading: addingToCart }] = useMutation<AddToCartMutation>(
    AddToCartDocument,
    {
      refetchQueries: [{ query: GetMyCartDocument }],
      onCompleted: () => {
        toast.success('Product added to cart!');
      },
      onError: (error) => {
        console.error('Add to cart error:', error);
        toast.error('Failed to add product to cart');
      },
    },
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!data?.product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const product = data.product;

  const handleAddToCart = async () => {
    try {
      await addToCart({
        variables: {
          input: {
            productId: product.id,
            quantity,
          },
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        {' / '}
        {product.category && (
          <>
            <Link
              href={`/shop/categories/${product.category.slug}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
            {' / '}
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images
                .slice(1, 5)
                .map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <Link href={`/shop/categories/${product.category.slug}`}>
                <p className="text-muted-foreground hover:text-primary">
                  {product.category.name}
                </p>
              </Link>
            )}
          </div>

          {/* Rating */}
          {product.averageRating !== undefined && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.averageRating?.toFixed(1)} ({product.reviewCount}{' '}
                reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${parseFloat(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-6 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">
                    100% secure transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">
                          {review.user.name}
                        </span>
                        {review.isVerified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
