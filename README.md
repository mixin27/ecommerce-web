# E-Commerce Next.js Application

A full-featured e-commerce web application built with Next.js 14, TypeScript, GraphQL, and Tailwind CSS. This application provides separate interfaces for Super Admin, Admin, and Customer roles.

## Features

### Customer Features

- 🛍️ Browse products with search and filtering
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 📦 Order tracking
- ⭐ Product reviews and ratings
- 👤 User account management
- 💳 Checkout and payment processing

### Admin Features

- 📊 Dashboard with analytics
- 📦 Product management (CRUD operations)
- 🏷️ Category management
- 📋 Order management and status updates
- 📈 Inventory analytics and reports
- 🔔 Notifications
- 📊 Revenue and sales reports

### Super Admin Features

- All Admin features
- 👥 User management
- 🔐 Advanced permissions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **GraphQL Client**: Apollo Client
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn or pnpm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ecommerce-nextjs-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your configuration:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://ecommerce-api-three-rho.vercel.app/graphql
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## GraphQL Code Generation

Generate TypeScript types from GraphQL schema:

```bash
npm run codegen
# or
yarn codegen
# or
pnpm codegen
```

## Project Structure

```
ecommerce-nextjs-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   ├── categories/    # Category management
│   │   │   └── analytics/     # Analytics & reports
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── shop/              # Customer-facing pages
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout process
│   │   │   ├── orders/        # Order history
│   │   │   ├── products/      # Product listing & details
│   │   │   └── account/       # User account
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # UI components (shadcn)
│   │   └── providers/        # Context providers
│   ├── graphql/              # GraphQL queries & mutations
│   │   ├── auth.ts           # Authentication operations
│   │   ├── products.ts       # Product operations
│   │   ├── orders.ts         # Order operations
│   │   ├── cart.ts           # Cart operations
│   │   └── dashboard.ts      # Dashboard operations
│   ├── store/                # Zustand stores
│   │   ├── auth-store.ts     # Authentication state
│   │   └── cart-store.ts     # Shopping cart state
│   ├── lib/                  # Utility functions
│   │   ├── apollo-client.ts  # Apollo Client setup
│   │   └── utils.ts          # Helper functions
│   └── generated/            # Generated GraphQL types
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── next.config.js           # Next.js configuration
├── codegen.ts               # GraphQL codegen config
└── package.json             # Dependencies
```

## User Roles

### Customer (CUSTOMER)

- Browse and search products
- Add products to cart and wishlist
- Place orders and track shipments
- Write product reviews
- Manage account and addresses

### Admin (ADMIN)

- All customer features
- Manage products and categories
- Process and update orders
- View analytics and reports
- Receive inventory notifications

### Super Admin (SUPER_ADMIN)

- All admin features
- Manage users and permissions
- Access advanced analytics
- System configuration

## Key Pages

### Public Pages

- `/auth/login` - User login
- `/auth/register` - User registration

### Customer Pages

- `/shop` - Product catalog
- `/shop/products/[slug]` - Product details
- `/shop/cart` - Shopping cart
- `/shop/checkout` - Checkout process
- `/shop/orders` - Order history
- `/shop/account` - Account settings

### Admin Pages

- `/admin/dashboard` - Admin dashboard with analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/categories` - Category management
- `/admin/analytics` - Advanced analytics

### Key Mutations

- `login` - User authentication
- `register` - User registration
- `createProduct` - Create new product
- `updateProduct` - Update product
- `createOrder` - Create new order
- `addToCart` - Add item to cart

### Key Queries

- `products` - Get products with pagination and filters
- `product` - Get single product details
- `myOrders` - Get user's orders
- `dashboardStats` - Get dashboard statistics
- `myCart` - Get user's cart

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Environment Variables

| Variable                             | Description          | Required |
| ------------------------------------ | -------------------- | -------- |
| `NEXT_PUBLIC_GRAPHQL_URL`            | GraphQL API endpoint | Yes      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key    | Optional |

## Authentication

The application uses JWT-based authentication:

- Tokens are stored in localStorage
- Auth state is managed with Zustand
- Protected routes redirect to login
- Role-based access control

## State Management

- **Zustand** for global state (auth, cart)
- **Apollo Client** for GraphQL state and caching
- Persistent stores for cart and auth

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui for accessible components
- Radix UI primitives
- Custom CSS variables for theming

## Testing

```bash
npm run test
# or
yarn test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, email support@example.com or open an issue.
