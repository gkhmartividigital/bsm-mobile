# BSM Mobile - BEBIAS Shipping Manager

Mobile app for the BEBIAS Shipping Manager system built with React Native and Expo.

## Features

- **Order Management**: View, filter, and manage shipping orders
- **Status Updates**: Update order status (Pending → Ready → Shipped → Delivered)
- **Wolt Integration**: Send orders to Wolt, track deliveries
- **Real-time Sync**: Auto-refresh orders every 30 seconds
- **Georgian Address Support**: Full support for Georgian addresses

## Tech Stack

- **Framework**: React Native 0.81 + Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand + React Query
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript
- **API Client**: Axios
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
bsm-mobile/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth screens (login)
│   ├── (tabs)/            # Main tab screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── orders/       # Order-specific components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client & services
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── constants/        # App constants
├── assets/               # Images, fonts
└── global.css           # Tailwind CSS entry
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bsm-mobile.git
   cd bsm-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your API URL:
   ```
   EXPO_PUBLIC_API_URL=https://your-api-url.vercel.app
   ```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview

# Build for production
eas build --platform all --profile production
```

## API Endpoints Used

The app connects to the Shipping Manager backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/mobile-signin` | POST | User authentication |
| `/api/auth/mobile-session` | GET | Verify session |
| `/api/orders` | GET | List active orders |
| `/api/orders/[id]` | GET/PATCH | Get/update order |
| `/api/orders/mark-delivered` | POST | Mark order delivered |
| `/api/orders/[id]/send-to-wolt` | POST | Send to Wolt |
| `/api/sync-improved` | POST | Sync from Firestore |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API URL |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (Android) |

## Development Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Order list with filtering
- [x] Order details view
- [x] Status updates
- [x] Wolt integration
- [x] Pull-to-refresh

### Phase 2
- [ ] Barcode/QR scanning
- [ ] Push notifications
- [ ] Offline support
- [ ] Photo capture for deliveries

### Phase 3
- [ ] Driver tracking
- [ ] Customer signature capture
- [ ] Analytics dashboard
- [ ] Multi-user roles

## Scripts

```bash
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web
npm run lint     # Run ESLint
npm run format   # Format with Prettier
npm run test     # Run tests
npm run typecheck # TypeScript check
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run typecheck`
4. Create a pull request

## License

Private - BEBIAS © 2026
