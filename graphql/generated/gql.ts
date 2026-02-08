/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation MarkAllNotificationsAsRead {\n    markAllNotificationsAsRead\n  }\n": typeof types.MarkAllNotificationsAsReadDocument,
    "\n  mutation BulkUpdateUsers($userIds: [ID!]!, $input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(userIds: $userIds, input: $input) {\n      success\n      updatedCount\n    }\n  }\n": typeof types.BulkUpdateUsersDocument,
    "\n  mutation BulkDeleteUsers($userIds: [ID!]!) {\n    bulkDeleteUsers(userIds: $userIds) {\n      success\n      deletedCount\n    }\n  }\n": typeof types.BulkDeleteUsersDocument,
    "\n  query GetUserAddresses {\n    userAddresses {\n      id\n      fullName\n      phone\n      addressLine1\n      addressLine2\n      city\n      state\n      country\n      postalCode\n      isDefault\n    }\n  }\n": typeof types.GetUserAddressesDocument,
    "\n  mutation CreateAddress($userId: ID!, $input: CreateAddressInput!) {\n    createAddress(userId: $userId, input: $input) {\n      id\n      fullName\n      addressLine1\n      city\n      state\n      country\n      postalCode\n    }\n  }\n": typeof types.CreateAddressDocument,
    "\n  mutation Login($input: LoginAuthInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterAuthInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.MeDocument,
    "\n  query GetMyCart {\n    myCart {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          slug\n          price\n          images\n          stock\n        }\n      }\n    }\n  }\n": typeof types.GetMyCartDocument,
    "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n": typeof types.AddToCartDocument,
    "\n  mutation UpdateCartItem($input: UpdateCartItemInput!) {\n    updateCartItem(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n": typeof types.UpdateCartItemDocument,
    "\n  mutation RemoveFromCart($itemId: ID!) {\n    removeFromCart(itemId: $itemId) {\n      id\n      subtotal\n      itemCount\n    }\n  }\n": typeof types.RemoveFromCartDocument,
    "\n  mutation ClearCart {\n    clearCart\n  }\n": typeof types.ClearCartDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetCategoriesDocument,
    "\n  query GetCategory($id: ID, $slug: String) {\n    category(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n        description\n        image\n      }\n      products {\n        id\n        name\n        slug\n        price\n        images\n        stock\n        isActive\n        isFeatured\n        averageRating\n        reviewCount\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetCategoryDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n      name\n    }\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  query GetDashboardStats {\n    dashboardStats {\n      totalRevenue\n      totalOrders\n      totalCustomers\n      totalProducts\n      revenueGrowth\n      ordersGrowth\n      lowStockProducts\n      pendingOrders\n    }\n  }\n": typeof types.GetDashboardStatsDocument,
    "\n  query GetRevenueData($days: Float!) {\n    revenueData(days: $days) {\n      date\n      revenue\n      orders\n    }\n  }\n": typeof types.GetRevenueDataDocument,
    "\n  query GetInventoryAnalytics {\n    inventoryAnalytics {\n      totalProducts\n      activeProducts\n      totalStockValue\n      averageTurnoverRate\n      lowStockCount\n      outOfStockCount\n    }\n  }\n": typeof types.GetInventoryAnalyticsDocument,
    "\n  query GetReorderRecommendations {\n    reorderRecommendations {\n      product {\n        id\n        name\n        stock\n        price\n      }\n      averageDailySales\n      predictedStockOutDate\n      daysUntilStockOut\n      reorderPoint\n      recommendedOrderQuantity\n      urgency\n    }\n  }\n": typeof types.GetReorderRecommendationsDocument,
    "\n  query GetNotifications($limit: Int, $offset: Int) {\n    notifications(limit: $limit, offset: $offset) {\n      id\n      type\n      title\n      message\n      data\n      isRead\n      readAt\n      createdAt\n    }\n  }\n": typeof types.GetNotificationsDocument,
    "\n  mutation MarkNotificationAsRead($id: ID!) {\n    markNotificationAsRead(id: $id) {\n      id\n      isRead\n      readAt\n    }\n  }\n": typeof types.MarkNotificationAsReadDocument,
    "\n  query GetMyOrders {\n    myOrders {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n    }\n  }\n": typeof types.GetMyOrdersDocument,
    "\n  query GetOrder($id: ID!) {\n    order(id: $id) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      customerNotes\n      adminNotes\n      createdAt\n      updatedAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          slug\n          images\n          price\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        phone\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": typeof types.GetOrderDocument,
    "\n  query GetOrders($input: OrdersInput!) {\n    orders(input: $input) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      user {\n        id\n        name\n        email\n      }\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n    }\n  }\n": typeof types.GetOrdersDocument,
    "\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      orderNumber\n      total\n      status\n      paymentStatus\n    }\n  }\n": typeof types.CreateOrderDocument,
    "\n  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {\n    updateOrderStatus(id: $id, input: $input) {\n      id\n      orderNumber\n      status\n      updatedAt\n    }\n  }\n": typeof types.UpdateOrderStatusDocument,
    "\n  query GetProducts($input: GetProductsInput!) {\n    products(input: $input) {\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n": typeof types.GetProductsDocument,
    "\n  query GetProduct($id: String, $slug: String) {\n    product(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      price\n      comparePrice\n      costPrice\n      images\n      sku\n      barcode\n      stock\n      lowStockThreshold\n      metaTitle\n      metaDescription\n      isActive\n      isFeatured\n      category {\n        id\n        name\n        slug\n      }\n      variants {\n        id\n        name\n        sku\n        price\n        stock\n        attributes\n      }\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetProductDocument,
    "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n": typeof types.CreateProductDocument,
    "\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n": typeof types.UpdateProductDocument,
    "\n  mutation DeleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      id\n      name\n    }\n  }\n": typeof types.DeleteProductDocument,
    "\n  mutation CreateReview($input: CreateReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      title\n      comment\n      isVerified\n      createdAt\n      user {\n        id\n        name\n      }\n      product {\n        id\n        name\n        averageRating\n        reviewCount\n      }\n    }\n  }\n": typeof types.CreateReviewDocument,
    "\n  query GetProductReviews($productId: String!) {\n    product(id: $productId) {\n      id\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n    }\n  }\n": typeof types.GetProductReviewsDocument,
    "\n  query GetUsers {\n    users {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n      addresses {\n        id\n        fullName\n        addressLine1\n        city\n        state\n        country\n        postalCode\n        isDefault\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id) {\n      id\n      email\n    }\n  }\n": typeof types.DeleteUserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation ToggleUserStatus($id: ID!) {\n    toggleUserStatus(id: $id) {\n      id\n      isActive\n    }\n  }\n": typeof types.ToggleUserStatusDocument,
    "\n  query GetMyWishlist {\n    myWishlist {\n      id\n      items {\n        id\n        addedAt\n        product {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetMyWishlistDocument,
    "\n  mutation AddToWishlist($productId: ID!) {\n    addToWishlist(productId: $productId) {\n      id\n      items {\n        id\n        product {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.AddToWishlistDocument,
    "\n  mutation RemoveFromWishlist($productId: ID!) {\n    removeFromWishlist(productId: $productId) {\n      id\n      items {\n        id\n      }\n    }\n  }\n": typeof types.RemoveFromWishlistDocument,
};
const documents: Documents = {
    "\n  mutation MarkAllNotificationsAsRead {\n    markAllNotificationsAsRead\n  }\n": types.MarkAllNotificationsAsReadDocument,
    "\n  mutation BulkUpdateUsers($userIds: [ID!]!, $input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(userIds: $userIds, input: $input) {\n      success\n      updatedCount\n    }\n  }\n": types.BulkUpdateUsersDocument,
    "\n  mutation BulkDeleteUsers($userIds: [ID!]!) {\n    bulkDeleteUsers(userIds: $userIds) {\n      success\n      deletedCount\n    }\n  }\n": types.BulkDeleteUsersDocument,
    "\n  query GetUserAddresses {\n    userAddresses {\n      id\n      fullName\n      phone\n      addressLine1\n      addressLine2\n      city\n      state\n      country\n      postalCode\n      isDefault\n    }\n  }\n": types.GetUserAddressesDocument,
    "\n  mutation CreateAddress($userId: ID!, $input: CreateAddressInput!) {\n    createAddress(userId: $userId, input: $input) {\n      id\n      fullName\n      addressLine1\n      city\n      state\n      country\n      postalCode\n    }\n  }\n": types.CreateAddressDocument,
    "\n  mutation Login($input: LoginAuthInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterAuthInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n": types.RegisterDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n": types.MeDocument,
    "\n  query GetMyCart {\n    myCart {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          slug\n          price\n          images\n          stock\n        }\n      }\n    }\n  }\n": types.GetMyCartDocument,
    "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n": types.AddToCartDocument,
    "\n  mutation UpdateCartItem($input: UpdateCartItemInput!) {\n    updateCartItem(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n": types.UpdateCartItemDocument,
    "\n  mutation RemoveFromCart($itemId: ID!) {\n    removeFromCart(itemId: $itemId) {\n      id\n      subtotal\n      itemCount\n    }\n  }\n": types.RemoveFromCartDocument,
    "\n  mutation ClearCart {\n    clearCart\n  }\n": types.ClearCartDocument,
    "\n  query GetCategories {\n    categories {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query GetCategory($id: ID, $slug: String) {\n    category(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n        description\n        image\n      }\n      products {\n        id\n        name\n        slug\n        price\n        images\n        stock\n        isActive\n        isFeatured\n        averageRating\n        reviewCount\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetCategoryDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n      name\n    }\n  }\n": types.DeleteCategoryDocument,
    "\n  query GetDashboardStats {\n    dashboardStats {\n      totalRevenue\n      totalOrders\n      totalCustomers\n      totalProducts\n      revenueGrowth\n      ordersGrowth\n      lowStockProducts\n      pendingOrders\n    }\n  }\n": types.GetDashboardStatsDocument,
    "\n  query GetRevenueData($days: Float!) {\n    revenueData(days: $days) {\n      date\n      revenue\n      orders\n    }\n  }\n": types.GetRevenueDataDocument,
    "\n  query GetInventoryAnalytics {\n    inventoryAnalytics {\n      totalProducts\n      activeProducts\n      totalStockValue\n      averageTurnoverRate\n      lowStockCount\n      outOfStockCount\n    }\n  }\n": types.GetInventoryAnalyticsDocument,
    "\n  query GetReorderRecommendations {\n    reorderRecommendations {\n      product {\n        id\n        name\n        stock\n        price\n      }\n      averageDailySales\n      predictedStockOutDate\n      daysUntilStockOut\n      reorderPoint\n      recommendedOrderQuantity\n      urgency\n    }\n  }\n": types.GetReorderRecommendationsDocument,
    "\n  query GetNotifications($limit: Int, $offset: Int) {\n    notifications(limit: $limit, offset: $offset) {\n      id\n      type\n      title\n      message\n      data\n      isRead\n      readAt\n      createdAt\n    }\n  }\n": types.GetNotificationsDocument,
    "\n  mutation MarkNotificationAsRead($id: ID!) {\n    markNotificationAsRead(id: $id) {\n      id\n      isRead\n      readAt\n    }\n  }\n": types.MarkNotificationAsReadDocument,
    "\n  query GetMyOrders {\n    myOrders {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n    }\n  }\n": types.GetMyOrdersDocument,
    "\n  query GetOrder($id: ID!) {\n    order(id: $id) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      customerNotes\n      adminNotes\n      createdAt\n      updatedAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          slug\n          images\n          price\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        phone\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n": types.GetOrderDocument,
    "\n  query GetOrders($input: OrdersInput!) {\n    orders(input: $input) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      user {\n        id\n        name\n        email\n      }\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n    }\n  }\n": types.GetOrdersDocument,
    "\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      orderNumber\n      total\n      status\n      paymentStatus\n    }\n  }\n": types.CreateOrderDocument,
    "\n  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {\n    updateOrderStatus(id: $id, input: $input) {\n      id\n      orderNumber\n      status\n      updatedAt\n    }\n  }\n": types.UpdateOrderStatusDocument,
    "\n  query GetProducts($input: GetProductsInput!) {\n    products(input: $input) {\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n": types.GetProductsDocument,
    "\n  query GetProduct($id: String, $slug: String) {\n    product(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      price\n      comparePrice\n      costPrice\n      images\n      sku\n      barcode\n      stock\n      lowStockThreshold\n      metaTitle\n      metaDescription\n      isActive\n      isFeatured\n      category {\n        id\n        name\n        slug\n      }\n      variants {\n        id\n        name\n        sku\n        price\n        stock\n        attributes\n      }\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetProductDocument,
    "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n": types.CreateProductDocument,
    "\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n": types.UpdateProductDocument,
    "\n  mutation DeleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      id\n      name\n    }\n  }\n": types.DeleteProductDocument,
    "\n  mutation CreateReview($input: CreateReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      title\n      comment\n      isVerified\n      createdAt\n      user {\n        id\n        name\n      }\n      product {\n        id\n        name\n        averageRating\n        reviewCount\n      }\n    }\n  }\n": types.CreateReviewDocument,
    "\n  query GetProductReviews($productId: String!) {\n    product(id: $productId) {\n      id\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n    }\n  }\n": types.GetProductReviewsDocument,
    "\n  query GetUsers {\n    users {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n      addresses {\n        id\n        fullName\n        addressLine1\n        city\n        state\n        country\n        postalCode\n        isDefault\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id) {\n      id\n      email\n    }\n  }\n": types.DeleteUserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation ToggleUserStatus($id: ID!) {\n    toggleUserStatus(id: $id) {\n      id\n      isActive\n    }\n  }\n": types.ToggleUserStatusDocument,
    "\n  query GetMyWishlist {\n    myWishlist {\n      id\n      items {\n        id\n        addedAt\n        product {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n": types.GetMyWishlistDocument,
    "\n  mutation AddToWishlist($productId: ID!) {\n    addToWishlist(productId: $productId) {\n      id\n      items {\n        id\n        product {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.AddToWishlistDocument,
    "\n  mutation RemoveFromWishlist($productId: ID!) {\n    removeFromWishlist(productId: $productId) {\n      id\n      items {\n        id\n      }\n    }\n  }\n": types.RemoveFromWishlistDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkAllNotificationsAsRead {\n    markAllNotificationsAsRead\n  }\n"): (typeof documents)["\n  mutation MarkAllNotificationsAsRead {\n    markAllNotificationsAsRead\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BulkUpdateUsers($userIds: [ID!]!, $input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(userIds: $userIds, input: $input) {\n      success\n      updatedCount\n    }\n  }\n"): (typeof documents)["\n  mutation BulkUpdateUsers($userIds: [ID!]!, $input: BulkUpdateUsersInput!) {\n    bulkUpdateUsers(userIds: $userIds, input: $input) {\n      success\n      updatedCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BulkDeleteUsers($userIds: [ID!]!) {\n    bulkDeleteUsers(userIds: $userIds) {\n      success\n      deletedCount\n    }\n  }\n"): (typeof documents)["\n  mutation BulkDeleteUsers($userIds: [ID!]!) {\n    bulkDeleteUsers(userIds: $userIds) {\n      success\n      deletedCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserAddresses {\n    userAddresses {\n      id\n      fullName\n      phone\n      addressLine1\n      addressLine2\n      city\n      state\n      country\n      postalCode\n      isDefault\n    }\n  }\n"): (typeof documents)["\n  query GetUserAddresses {\n    userAddresses {\n      id\n      fullName\n      phone\n      addressLine1\n      addressLine2\n      city\n      state\n      country\n      postalCode\n      isDefault\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAddress($userId: ID!, $input: CreateAddressInput!) {\n    createAddress(userId: $userId, input: $input) {\n      id\n      fullName\n      addressLine1\n      city\n      state\n      country\n      postalCode\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAddress($userId: ID!, $input: CreateAddressInput!) {\n    createAddress(userId: $userId, input: $input) {\n      id\n      fullName\n      addressLine1\n      city\n      state\n      country\n      postalCode\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginAuthInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginAuthInput!) {\n    login(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterAuthInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterAuthInput!) {\n    register(input: $input) {\n      user {\n        id\n        email\n        name\n        role\n        isActive\n        emailVerified\n      }\n      accessToken\n      refreshToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyCart {\n    myCart {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          slug\n          price\n          images\n          stock\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyCart {\n    myCart {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          slug\n          price\n          images\n          stock\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddToCart($input: AddToCartInput!) {\n    addToCart(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCartItem($input: UpdateCartItemInput!) {\n    updateCartItem(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCartItem($input: UpdateCartItemInput!) {\n    updateCartItem(input: $input) {\n      id\n      subtotal\n      itemCount\n      items {\n        id\n        quantity\n        product {\n          id\n          name\n          price\n          images\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFromCart($itemId: ID!) {\n    removeFromCart(itemId: $itemId) {\n      id\n      subtotal\n      itemCount\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFromCart($itemId: ID!) {\n    removeFromCart(itemId: $itemId) {\n      id\n      subtotal\n      itemCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ClearCart {\n    clearCart\n  }\n"): (typeof documents)["\n  mutation ClearCart {\n    clearCart\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    categories {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetCategories {\n    categories {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategory($id: ID, $slug: String) {\n    category(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n        description\n        image\n      }\n      products {\n        id\n        name\n        slug\n        price\n        images\n        stock\n        isActive\n        isFeatured\n        averageRating\n        reviewCount\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetCategory($id: ID, $slug: String) {\n    category(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      image\n      parent {\n        id\n        name\n        slug\n      }\n      children {\n        id\n        name\n        slug\n        description\n        image\n      }\n      products {\n        id\n        name\n        slug\n        price\n        images\n        stock\n        isActive\n        isFeatured\n        averageRating\n        reviewCount\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      image\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDashboardStats {\n    dashboardStats {\n      totalRevenue\n      totalOrders\n      totalCustomers\n      totalProducts\n      revenueGrowth\n      ordersGrowth\n      lowStockProducts\n      pendingOrders\n    }\n  }\n"): (typeof documents)["\n  query GetDashboardStats {\n    dashboardStats {\n      totalRevenue\n      totalOrders\n      totalCustomers\n      totalProducts\n      revenueGrowth\n      ordersGrowth\n      lowStockProducts\n      pendingOrders\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRevenueData($days: Float!) {\n    revenueData(days: $days) {\n      date\n      revenue\n      orders\n    }\n  }\n"): (typeof documents)["\n  query GetRevenueData($days: Float!) {\n    revenueData(days: $days) {\n      date\n      revenue\n      orders\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInventoryAnalytics {\n    inventoryAnalytics {\n      totalProducts\n      activeProducts\n      totalStockValue\n      averageTurnoverRate\n      lowStockCount\n      outOfStockCount\n    }\n  }\n"): (typeof documents)["\n  query GetInventoryAnalytics {\n    inventoryAnalytics {\n      totalProducts\n      activeProducts\n      totalStockValue\n      averageTurnoverRate\n      lowStockCount\n      outOfStockCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetReorderRecommendations {\n    reorderRecommendations {\n      product {\n        id\n        name\n        stock\n        price\n      }\n      averageDailySales\n      predictedStockOutDate\n      daysUntilStockOut\n      reorderPoint\n      recommendedOrderQuantity\n      urgency\n    }\n  }\n"): (typeof documents)["\n  query GetReorderRecommendations {\n    reorderRecommendations {\n      product {\n        id\n        name\n        stock\n        price\n      }\n      averageDailySales\n      predictedStockOutDate\n      daysUntilStockOut\n      reorderPoint\n      recommendedOrderQuantity\n      urgency\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNotifications($limit: Int, $offset: Int) {\n    notifications(limit: $limit, offset: $offset) {\n      id\n      type\n      title\n      message\n      data\n      isRead\n      readAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query GetNotifications($limit: Int, $offset: Int) {\n    notifications(limit: $limit, offset: $offset) {\n      id\n      type\n      title\n      message\n      data\n      isRead\n      readAt\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkNotificationAsRead($id: ID!) {\n    markNotificationAsRead(id: $id) {\n      id\n      isRead\n      readAt\n    }\n  }\n"): (typeof documents)["\n  mutation MarkNotificationAsRead($id: ID!) {\n    markNotificationAsRead(id: $id) {\n      id\n      isRead\n      readAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyOrders {\n    myOrders {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyOrders {\n    myOrders {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrder($id: ID!) {\n    order(id: $id) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      customerNotes\n      adminNotes\n      createdAt\n      updatedAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          slug\n          images\n          price\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        phone\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOrder($id: ID!) {\n    order(id: $id) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      customerNotes\n      adminNotes\n      createdAt\n      updatedAt\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          slug\n          images\n          price\n        }\n      }\n      shippingAddress {\n        id\n        fullName\n        phone\n        addressLine1\n        addressLine2\n        city\n        state\n        country\n        postalCode\n      }\n      user {\n        id\n        name\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrders($input: OrdersInput!) {\n    orders(input: $input) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      user {\n        id\n        name\n        email\n      }\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOrders($input: OrdersInput!) {\n    orders(input: $input) {\n      id\n      orderNumber\n      subtotal\n      tax\n      shippingCost\n      discount\n      total\n      status\n      paymentStatus\n      paymentMethod\n      trackingNumber\n      createdAt\n      user {\n        id\n        name\n        email\n      }\n      items {\n        id\n        quantity\n        price\n        product {\n          id\n          name\n          images\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      orderNumber\n      total\n      status\n      paymentStatus\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      id\n      orderNumber\n      total\n      status\n      paymentStatus\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {\n    updateOrderStatus(id: $id, input: $input) {\n      id\n      orderNumber\n      status\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOrderStatus($id: ID!, $input: UpdateOrderStatusInput!) {\n    updateOrderStatus(id: $id, input: $input) {\n      id\n      orderNumber\n      status\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProducts($input: GetProductsInput!) {\n    products(input: $input) {\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n"): (typeof documents)["\n  query GetProducts($input: GetProductsInput!) {\n    products(input: $input) {\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProduct($id: String, $slug: String) {\n    product(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      price\n      comparePrice\n      costPrice\n      images\n      sku\n      barcode\n      stock\n      lowStockThreshold\n      metaTitle\n      metaDescription\n      isActive\n      isFeatured\n      category {\n        id\n        name\n        slug\n      }\n      variants {\n        id\n        name\n        sku\n        price\n        stock\n        attributes\n      }\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetProduct($id: String, $slug: String) {\n    product(id: $id, slug: $slug) {\n      id\n      name\n      slug\n      description\n      price\n      comparePrice\n      costPrice\n      images\n      sku\n      barcode\n      stock\n      lowStockThreshold\n      metaTitle\n      metaDescription\n      isActive\n      isFeatured\n      category {\n        id\n        name\n        slug\n      }\n      variants {\n        id\n        name\n        sku\n        price\n        stock\n        attributes\n      }\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      id\n      name\n      slug\n      description\n      price\n      stock\n      images\n      isActive\n      isFeatured\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProduct($id: String!) {\n    deleteProduct(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateReview($input: CreateReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      title\n      comment\n      isVerified\n      createdAt\n      user {\n        id\n        name\n      }\n      product {\n        id\n        name\n        averageRating\n        reviewCount\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateReview($input: CreateReviewInput!) {\n    createReview(input: $input) {\n      id\n      rating\n      title\n      comment\n      isVerified\n      createdAt\n      user {\n        id\n        name\n      }\n      product {\n        id\n        name\n        averageRating\n        reviewCount\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProductReviews($productId: String!) {\n    product(id: $productId) {\n      id\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n    }\n  }\n"): (typeof documents)["\n  query GetProductReviews($productId: String!) {\n    product(id: $productId) {\n      id\n      reviews {\n        id\n        rating\n        title\n        comment\n        isVerified\n        createdAt\n        updatedAt\n        user {\n          id\n          name\n        }\n      }\n      averageRating\n      reviewCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    users {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n      addresses {\n        id\n        fullName\n        addressLine1\n        city\n        state\n        country\n        postalCode\n        isDefault\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: ID!) {\n    user(id: $id) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n      createdAt\n      updatedAt\n      addresses {\n        id\n        fullName\n        addressLine1\n        city\n        state\n        country\n        postalCode\n        isDefault\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id) {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteUser($id: ID!) {\n    deleteUser(id: $id) {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n      email\n      name\n      role\n      isActive\n      emailVerified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ToggleUserStatus($id: ID!) {\n    toggleUserStatus(id: $id) {\n      id\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleUserStatus($id: ID!) {\n    toggleUserStatus(id: $id) {\n      id\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyWishlist {\n    myWishlist {\n      id\n      items {\n        id\n        addedAt\n        product {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyWishlist {\n    myWishlist {\n      id\n      items {\n        id\n        addedAt\n        product {\n          id\n          name\n          slug\n          description\n          price\n          comparePrice\n          images\n          stock\n          isActive\n          isFeatured\n          averageRating\n          reviewCount\n          category {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddToWishlist($productId: ID!) {\n    addToWishlist(productId: $productId) {\n      id\n      items {\n        id\n        product {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddToWishlist($productId: ID!) {\n    addToWishlist(productId: $productId) {\n      id\n      items {\n        id\n        product {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFromWishlist($productId: ID!) {\n    removeFromWishlist(productId: $productId) {\n      id\n      items {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFromWishlist($productId: ID!) {\n    removeFromWishlist(productId: $productId) {\n      id\n      items {\n        id\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;