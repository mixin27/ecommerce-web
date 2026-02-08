'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  CreateReviewDocument,
  CreateReviewMutation,
  GetOrderDocument,
  GetOrderQuery,
  GetProductDocument,
  GetProductQuery,
} from '@/graphql/generated/graphql';
import { toast } from 'sonner';

export default function WriteReviewPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const { id: orderId, productId } = use(params);
  console.log(orderId, productId);
  const { data: orderData } = useQuery<GetOrderQuery>(GetOrderDocument, {
    variables: { id: orderId },
  });

  const [createReview, { loading }] = useMutation<CreateReviewMutation>(
    CreateReviewDocument,
    {
      onCompleted: () => {
        toast.success('Review submitted successfully!');
        router.push(`/shop/orders/${orderId}`);
      },
      onError: (error) => {
        console.error('Review submission error:', error);
        toast.error('Failed to submit review. Please try again.');
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await createReview({
        variables: {
          input: {
            productId,
            rating,
            title: title || undefined,
            comment: comment || undefined,
          },
        },
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const order = orderData?.order;
  const product = order?.items.find(
    (item: any) => item.product.id === productId,
  )?.product;

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/shop/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/shop/orders/${orderId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Write a Review</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience with this product
          </p>
        </div>
      </div>

      {/* Product Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-4 text-sm font-medium">
                    {rating} {rating === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Review Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Sum up your review in one line"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Review Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <textarea
                id="comment"
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">
                Tips for writing a great review:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about what you liked or didn't like</li>
                <li>• Include details about quality, features, and value</li>
                <li>• Mention how you use the product</li>
                <li>• Be honest and fair</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Link href={`/shop/orders/${orderId}`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
