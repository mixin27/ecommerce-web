'use client';

import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  GetCategoriesDocument,
  GetCategoriesQuery,
} from '@/graphql/generated/graphql';

export default function CategoriesPage() {
  const { data, loading } = useQuery<GetCategoriesQuery>(GetCategoriesDocument);

  if (loading) {
    return <div className="text-center py-12">Loading categories...</div>;
  }

  const categories = data?.categories || [];
  const rootCategories = categories.filter((cat: any) => !cat.parent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shop by Category</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rootCategories.map((category: any) => (
          <Link key={category.id} href={`/shop/categories/${category.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              {category.image && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Folder className="w-5 h-5 mr-2 text-primary" />
                    {category.name}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                )}
                {category.children && category.children.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Subcategories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.children.slice(0, 5).map((child: any) => (
                        <span
                          key={child.id}
                          className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                        >
                          {child.name}
                        </span>
                      ))}
                      {category.children.length > 5 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{category.children.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {rootCategories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No categories available
        </div>
      )}
    </div>
  );
}
