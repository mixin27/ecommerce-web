import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalRevenue
      totalOrders
      totalCustomers
      totalProducts
      revenueGrowth
      ordersGrowth
      lowStockProducts
      pendingOrders
    }
  }
`;

export const GET_REVENUE_DATA = gql`
  query GetRevenueData($days: Float!) {
    revenueData(days: $days) {
      date
      revenue
      orders
    }
  }
`;

export const GET_INVENTORY_ANALYTICS = gql`
  query GetInventoryAnalytics {
    inventoryAnalytics {
      totalProducts
      activeProducts
      totalStockValue
      averageTurnoverRate
      lowStockCount
      outOfStockCount
    }
  }
`;

export const GET_REORDER_RECOMMENDATIONS = gql`
  query GetReorderRecommendations {
    reorderRecommendations {
      product {
        id
        name
        stock
        price
      }
      averageDailySales
      predictedStockOutDate
      daysUntilStockOut
      reorderPoint
      recommendedOrderQuantity
      urgency
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $offset: Int) {
    notifications(limit: $limit, offset: $offset) {
      id
      type
      title
      message
      data
      isRead
      readAt
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
      readAt
    }
  }
`;
