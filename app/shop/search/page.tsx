'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ShoppingCart, Star, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  AddToCartDocument,
  GetMyCartDocument,
  GetProductsDocument,
  GetProductsQuery,
} from '@/graphql/generated/graphql';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data, loading } = useQuery<GetProductsQuery>(GetProductsDocument, {
    variables: {
      input: {
        first: 50,
        filter: {
          isActive: true,
          search: activeQuery || undefined,
          minPrice: minPrice ? parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        },
      },
    },
    skip: !activeQuery,
  });

  const [addToCart, { loading: addingToCart }] = useMutation(
    AddToCartDocument,
    {
      refetchQueries: [{ query: GetMyCartDocument }],
      onCompleted: () => {
        alert('Product added to cart!');
      },
      onError: (error) => {
        console.error('Add to cart error:', error);
        alert('Failed to add to cart');
      },
    },
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
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

  let products = data?.products?.edges?.map((edge: any) => edge.node) || [];

  // Sort products
  products = [...products].sort((a: any, b: any) => {
    if (sortBy === 'price-low')
      return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high')
      return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating')
      return (b.averageRating || 0) - (a.averageRating || 0);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {activeQuery && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Filters</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-muted-foreground">
                      Min Price:
                    </label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-muted-foreground">
                      Max Price:
                    </label>
                    <Input
                      type="number"
                      placeholder="$1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-muted-foreground">
                      Sort:
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="name">Name: A to Z</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  {products.length} result{products.length !== 1 ? 's' : ''} for
                  "{activeQuery}"
                </>
              )}
            </h2>

            {loading ? (
              <div className="text-center py-12">Searching...</div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Link href="/shop">
                    <Button>Browse All Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
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
                        <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
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
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0 || addingToCart}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {addingToCart
                          ? 'Adding...'
                          : product.stock === 0
                            ? 'Out of Stock'
                            : 'Add to Cart'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!activeQuery && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start searching</h3>
            <p className="text-muted-foreground">
              Enter a search term above to find products
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
