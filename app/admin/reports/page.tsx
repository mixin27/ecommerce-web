'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  FileText,
  Table as TableIcon,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  GetDashboardStatsDocument,
  GetDashboardStatsQuery,
  GetInventoryAnalyticsDocument,
  GetInventoryAnalyticsQuery,
  GetOrdersDocument,
  GetOrdersQuery,
  GetRevenueDataDocument,
  GetRevenueDataQuery,
} from '@/graphql/generated/graphql';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30');

  const { data: statsData } = useQuery<GetDashboardStatsQuery>(
    GetDashboardStatsDocument,
  );
  const { data: revenueData } = useQuery<GetRevenueDataQuery>(
    GetRevenueDataDocument,
    {
      variables: { days: parseInt(dateRange) },
    },
  );
  const { data: inventoryData } = useQuery<GetInventoryAnalyticsQuery>(
    GetInventoryAnalyticsDocument,
  );
  const { data: ordersData } = useQuery<GetOrdersQuery>(GetOrdersDocument, {
    variables: { input: { limit: 1000, offset: 0 } },
  });

  const stats = statsData?.dashboardStats;
  const revenue = revenueData?.revenueData || [];
  const inventory = inventoryData?.inventoryAnalytics;
  const orders = ordersData?.orders || [];

  // Calculate sales by status
  const salesByStatus = [
    {
      name: 'Pending',
      value: orders.filter((o: any) => o.status === 'PENDING').length,
    },
    {
      name: 'Processing',
      value: orders.filter((o: any) => o.status === 'PROCESSING').length,
    },
    {
      name: 'Shipped',
      value: orders.filter((o: any) => o.status === 'SHIPPED').length,
    },
    {
      name: 'Delivered',
      value: orders.filter((o: any) => o.status === 'DELIVERED').length,
    },
    {
      name: 'Cancelled',
      value: orders.filter((o: any) => o.status === 'CANCELLED').length,
    },
  ];

  // Calculate payment status distribution
  const paymentByStatus = [
    {
      name: 'Paid',
      value: orders.filter((o: any) => o.paymentStatus === 'PAID').length,
    },
    {
      name: 'Pending',
      value: orders.filter((o: any) => o.paymentStatus === 'PENDING').length,
    },
    {
      name: 'Failed',
      value: orders.filter((o: any) => o.paymentStatus === 'FAILED').length,
    },
  ];

  // Revenue growth data
  const revenueGrowth = revenue.map((item: any, index: number) => {
    if (index === 0) return { ...item, growth: 0 };
    const prevRevenue = revenue[index - 1].revenue;
    const growth =
      prevRevenue > 0 ? ((item.revenue - prevRevenue) / prevRevenue) * 100 : 0;
    return { ...item, growth: growth.toFixed(1) };
  });

  const handleExportCSV = () => {
    let csvContent = '';

    if (reportType === 'sales') {
      csvContent = 'Date,Revenue,Orders\n';
      revenue.forEach((item: any) => {
        csvContent += `${item.date},${item.revenue},${item.orders}\n`;
      });
    } else if (reportType === 'orders') {
      csvContent = 'Order Number,Date,Customer,Total,Status,Payment Status\n';
      orders.forEach((order: any) => {
        csvContent += `${order.orderNumber},${new Date(order.createdAt).toLocaleDateString()},${order.user.name},${order.total},${order.status},${order.paymentStatus}\n`;
      });
    } else if (reportType === 'inventory') {
      csvContent = 'Metric,Value\n';
      csvContent += `Total Products,${inventory?.totalProducts || 0}\n`;
      csvContent += `Active Products,${inventory?.activeProducts || 0}\n`;
      csvContent += `Total Stock Value,$${inventory?.totalStockValue?.toFixed(2) || 0}\n`;
      csvContent += `Low Stock Count,${inventory?.lowStockCount || 0}\n`;
      csvContent += `Out of Stock Count,${inventory?.outOfStockCount || 0}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${reportType.toUpperCase()} REPORT`, 105, yPosition, {
      align: 'center',
    });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      105,
      yPosition,
      { align: 'center' },
    );
    doc.text(`Date Range: Last ${dateRange} days`, 105, yPosition + 5, {
      align: 'center',
    });

    yPosition += 20;

    if (reportType === 'sales') {
      // Sales Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Sales Summary', 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Total Revenue: $${stats?.totalRevenue?.toFixed(2) || 0}`,
        20,
        yPosition,
      );
      doc.text(`Total Orders: ${stats?.totalOrders || 0}`, 20, yPosition + 5);
      doc.text(
        `Revenue Growth: ${stats?.revenueGrowth?.toFixed(1) || 0}%`,
        20,
        yPosition + 10,
      );

      yPosition += 25;

      // Revenue Table
      doc.setFont('helvetica', 'bold');
      doc.text('Date', 20, yPosition);
      doc.text('Revenue', 80, yPosition);
      doc.text('Orders', 140, yPosition);

      yPosition += 5;
      doc.setFont('helvetica', 'normal');

      revenue.forEach((item: any, index: number) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(item.date, 20, yPosition);
        doc.text(`$${item.revenue.toFixed(2)}`, 80, yPosition);
        doc.text(item.orders.toString(), 140, yPosition);
        yPosition += 5;
      });
    } else if (reportType === 'inventory') {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Inventory Summary', 20, yPosition);

      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Total Products: ${inventory?.totalProducts || 0}`,
        20,
        yPosition,
      );
      doc.text(
        `Active Products: ${inventory?.activeProducts || 0}`,
        20,
        yPosition + 5,
      );
      doc.text(
        `Total Stock Value: $${inventory?.totalStockValue?.toFixed(2) || 0}`,
        20,
        yPosition + 10,
      );
      doc.text(
        `Low Stock Count: ${inventory?.lowStockCount || 0}`,
        20,
        yPosition + 15,
      );
      doc.text(
        `Out of Stock Count: ${inventory?.outOfStockCount || 0}`,
        20,
        yPosition + 20,
      );
      doc.text(
        `Average Turnover Rate: ${inventory?.averageTurnoverRate?.toFixed(2) || 0}x`,
        20,
        yPosition + 25,
      );
    }

    doc.save(
      `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reports</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive business analytics and insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <TableIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <label className="text-sm font-medium">Report Type:</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="orders">Orders Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="performance">
                    Performance Report
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <label className="text-sm font-medium">Date Range:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      {reportType === 'sales' && (
        <div className="grid gap-6">
          {/* Revenue Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-[350px]">
                <AreaChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Revenue ($)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Orders Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-[350px]">
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sales by Status */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="w-full h-[350px]">
                  <PieChart>
                    <Pie
                      data={salesByStatus}
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
                      {salesByStatus.map((entry, index) => (
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

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="w-full h-[350px]">
                  <BarChart data={paymentByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Orders Report */}
      {reportType === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Orders List ({orders.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">
                      Order #
                    </th>
                    <th className="text-left p-3 text-sm font-medium">Date</th>
                    <th className="text-left p-3 text-sm font-medium">
                      Customer
                    </th>
                    <th className="text-left p-3 text-sm font-medium">Total</th>
                    <th className="text-left p-3 text-sm font-medium">
                      Status
                    </th>
                    <th className="text-left p-3 text-sm font-medium">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 20).map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{order.orderNumber}</td>
                      <td className="p-3 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm">{order.user.name}</td>
                      <td className="p-3 text-sm font-medium">
                        ${parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && (
        <div className="grid gap-6">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold">
                      {inventory?.totalProducts || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Value</p>
                    <p className="text-3xl font-bold">
                      ${inventory?.totalStockValue?.toFixed(0) || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Low Stock Items
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {inventory?.lowStockCount || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Report */}
      {reportType === 'performance' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-[350px]">
                <LineChart data={revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Growth Rate (%)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Revenue Growth
                  </span>
                  <span className="font-bold text-green-600">
                    +{stats?.revenueGrowth?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Orders Growth
                  </span>
                  <span className="font-bold text-blue-600">
                    +{stats?.ordersGrowth?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg Order Value
                  </span>
                  <span className="font-bold">
                    $
                    {stats && stats?.totalOrders > 0
                      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Inventory Turnover
                  </span>
                  <span className="font-bold">
                    {inventory?.averageTurnoverRate?.toFixed(2) || 0}x
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Pending Orders
                  </span>
                  <span className="font-bold text-yellow-600">
                    {stats?.pendingOrders || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Low Stock Products
                  </span>
                  <span className="font-bold text-red-600">
                    {stats?.lowStockProducts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Active Products
                  </span>
                  <span className="font-bold text-green-600">
                    {inventory?.activeProducts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Customers
                  </span>
                  <span className="font-bold">
                    {stats?.totalCustomers || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
