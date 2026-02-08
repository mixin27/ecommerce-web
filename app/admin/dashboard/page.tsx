'use client';

import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import {
  GetDashboardStatsDocument,
  GetDashboardStatsQuery,
  GetRevenueDataDocument,
  GetRevenueDataQuery,
} from '@/graphql/generated/graphql';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function AdminDashboard() {
  const { data: statsData, loading: statsLoading } =
    useQuery<GetDashboardStatsQuery>(GetDashboardStatsDocument);
  const { data: revenueData, loading: revenueLoading } =
    useQuery<GetRevenueDataQuery>(GetRevenueDataDocument, {
      variables: { days: 30 },
    });

  if (statsLoading || revenueLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  const stats = statsData?.dashboardStats;
  const revenue = revenueData?.revenueData || [];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: DollarSign,
      trend: stats?.revenueGrowth || 0,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      trend: stats?.ordersGrowth || 0,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      trend: 0,
      trendLabel: 'active users',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      trend: 0,
      trendLabel: 'in catalog',
    },
  ];

  const alertCards = [
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: ShoppingCart,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Low Stock Products',
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your e-commerce store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.trend !== 0 && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {stat.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {Math.abs(stat.trend).toFixed(1)}%
                    </span>
                    <span className="ml-1">{stat.trendLabel}</span>
                  </div>
                )}
                {stat.trend === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trendLabel}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {alertCards.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {alert.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${alert.bgColor}`}>
                  <Icon className={`h-4 w-4 ${alert.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{alert.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Orders"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
