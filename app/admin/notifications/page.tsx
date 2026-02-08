'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Check,
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingDown,
  Info,
} from 'lucide-react';
import { gql } from '@apollo/client';
import {
  GetNotificationsDocument,
  GetNotificationsQuery,
  MarkNotificationAsReadDocument,
} from '@/graphql/generated/graphql';

const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export default function NotificationsPage() {
  const { data, loading, refetch } = useQuery<GetNotificationsQuery>(
    GetNotificationsDocument,
    {
      variables: { limit: 50, offset: 0 },
    },
  );

  const [markAsRead] = useMutation(MarkNotificationAsReadDocument, {
    onCompleted: () => {
      refetch();
    },
  });

  const [markAllAsRead] = useMutation(MARK_ALL_READ, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({ variables: { id } });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading notifications...</div>;
  }

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'ORDER':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'PRODUCT':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'SALES':
        return <TrendingDown className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            {unreadCount > 0 ? (
              <>
                {unreadCount} unread{' '}
                {unreadCount === 1 ? 'notification' : 'notifications'}
              </>
            ) : (
              'All caught up!'
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <Card
              key={notification.id}
              className={`${
                !notification.isRead
                  ? 'border-l-4 border-l-primary bg-primary/5'
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-full ${!notification.isRead ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center">
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                    {notification.data && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(notification.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
