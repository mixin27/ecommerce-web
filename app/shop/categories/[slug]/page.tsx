'use client';

import { use, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart, Star, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  AddToCartDocument,
  GetCategoryDocument,
  GetCategoryQuery,
  GetMyCartDocument,
} from '@/graphql/generated/graphql';

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all');

  const { slug } = use(params);
  const { data, loading } = useQuery<GetCategoryQuery>(GetCategoryDocument, {
    variables: { slug },
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
    return <div className="text-center py-12">Loading category...</div>;
  }

  if (!data?.category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Link href="/shop/categories">
          <Button>Browse Categories</Button>
        </Link>
      </div>
    );
  }

  const category = data.category;
  let products = category.products || [];

  // Filter by price
  if (priceFilter !== 'all') {
    products = products.filter((p: any) => {
      const price = parseFloat(p.price);
      if (priceFilter === 'under50') return price < 50;
      if (priceFilter === '50to100') return price >= 50 && price <= 100;
      if (priceFilter === '100to200') return price >= 100 && price <= 200;
      if (priceFilter === 'over200') return price > 200;
      return true;
    });
  }

  // Sort products
  products = [...products].sort((a: any, b: any) => {
    if (sortBy === 'price-low')
      return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high')
      return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating')
      return (b.averageRating || 0) - (a.averageRating || 0);
    return 0; // newest (default order)
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span>/</span>
        <Link href="/shop/categories" className="hover:text-primary">
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Category Header */}
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/shop/categories">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category.children.map((child: any) => (
              <Link key={child.id} href={`/shop/category/${child.slug}`}>
                <Button variant="outline" size="sm">
                  {child.name}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filters & Sort</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Price:</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under50">Under $50</SelectItem>
                    <SelectItem value="50to100">$50 - $100</SelectItem>
                    <SelectItem value="100to200">$100 - $200</SelectItem>
                    <SelectItem value="over200">Over $200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Sort:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
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

      {/* Products Grid */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {products.length}{' '}
          {products.length === 1 ? 'product' : 'products'}
        </p>
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found in this category
          </div>
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
                  {product.averageRating !== undefined && (
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
    </div>
  );
}
