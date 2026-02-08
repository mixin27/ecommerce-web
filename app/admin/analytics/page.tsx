'use client';

import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
  ShoppingBag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  GetInventoryAnalyticsDocument,
  GetInventoryAnalyticsQuery,
  GetReorderRecommendationsDocument,
  GetReorderRecommendationsQuery,
} from '@/graphql/generated/graphql';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const { data: inventoryData, loading: inventoryLoading } =
    useQuery<GetInventoryAnalyticsQuery>(GetInventoryAnalyticsDocument);
  const { data: reorderData, loading: reorderLoading } =
    useQuery<GetReorderRecommendationsQuery>(GetReorderRecommendationsDocument);

  if (inventoryLoading || reorderLoading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  const inventory = inventoryData?.inventoryAnalytics;
  const reorderRecommendations = reorderData?.reorderRecommendations || [];

  const inventoryStats = [
    {
      title: 'Total Products',
      value: inventory?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Products',
      value: inventory?.activeProducts || 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Stock Value',
      value: `$${inventory?.totalStockValue?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Low Stock Items',
      value: inventory?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Out of Stock',
      value: inventory?.outOfStockCount || 0,
      icon: ShoppingBag,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Avg Turnover Rate',
      value: `${inventory?.averageTurnoverRate?.toFixed(2) || 0}x`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const stockDistributionData = [
    { name: 'Active', value: inventory?.activeProducts || 0 },
    { name: 'Low Stock', value: inventory?.lowStockCount || 0 },
    { name: 'Out of Stock', value: inventory?.outOfStockCount || 0 },
  ];

  const urgentReorders = reorderRecommendations.filter(
    (item: any) => item.urgency === 'HIGH' || item.urgency === 'CRITICAL',
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          Detailed insights into your inventory and business performance
        </p>
      </div>

      {/* Inventory Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventoryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <PieChart>
                <Pie
                  data={stockDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Reorder Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Urgent Reorder Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {urgentReorders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No urgent reorders needed
              </div>
            ) : (
              <ChartContainer config={{}}>
                <BarChart data={urgentReorders.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="product.name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="averageDailySales"
                    fill="#00C49F"
                    name="Avg Daily Sales"
                  />
                  <Bar
                    dataKey="daysUntilStockOut"
                    fill="#FF8042"
                    name="Days Until Stock Out"
                  />
                  <Bar
                    dataKey="recommendedOrderQuantity"
                    fill="#0088FE"
                    name="Recommended Order Quantity"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reorder Recommendations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {reorderRecommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reorder recommendations at this time
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Current Stock</th>
                    <th className="text-left p-4">Avg Daily Sales</th>
                    <th className="text-left p-4">Days Until Out</th>
                    <th className="text-left p-4">Recommended Order</th>
                    <th className="text-left p-4">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {reorderRecommendations.map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${parseFloat(item.product.price).toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.product.stock < 10
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.product.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        {item.averageDailySales?.toFixed(2) || 0}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-medium ${
                            item.daysUntilStockOut < 7
                              ? 'text-red-600'
                              : item.daysUntilStockOut < 14
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}
                        >
                          {item.daysUntilStockOut} days
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        {item.recommendedOrderQuantity} units
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.urgency === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : item.urgency === 'HIGH'
                                ? 'bg-orange-100 text-orange-800'
                                : item.urgency === 'MEDIUM'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
