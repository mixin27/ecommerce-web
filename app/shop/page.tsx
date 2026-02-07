'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import {
  GetProductsDocument,
  GetProductsQuery,
} from '@/graphql/generated/graphql';

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem } = useCartStore();

  const { data, loading } = useQuery<GetProductsQuery>(GetProductsDocument, {
    variables: {
      input: {
        first: 50,
        filter: {
          isActive: true,
          search: searchTerm || undefined,
        },
      },
    },
  });

  const products = data?.products?.edges?.map((edge: any) => edge.node) || [];
  const featuredProducts = products.filter((p: any) => p.isFeatured);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.images?.[0],
    });
    alert('Product added to cart!');
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary to-blue-600 rounded-lg p-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopNow</h1>
        <p className="text-xl mb-6">
          Discover amazing products at great prices
        </p>
        <div className="max-w-md">
          <div className="flex items-center bg-white text-muted-foreground rounded-lg p-2">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: any) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/shop/products/${product.slug}`}>
        <div className="aspect-square relative bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              No Image
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
      </Link>
      <CardHeader>
        <Link href={`/shop/products/${product.slug}`}>
          <CardTitle className="text-lg hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        {product.category && (
          <p className="text-sm text-muted-foreground">
            {product.category.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${parseFloat(product.comparePrice).toFixed(2)}
            </span>
          )}
        </div>
        {product.averageRating && (
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
