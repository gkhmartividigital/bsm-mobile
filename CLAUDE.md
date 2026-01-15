# CLAUDE.md - BSM Mobile (Bebias Shipping Manager)

## Project
Mobile app for Bebias Shipping Manager - iOS & Android using Expo.

## Locations
- **This project**: `C:\Users\userr\Documents\projects\bsm-mobile`
- **Web app**: `C:\Users\userr\Documents\projects\bebias-shipping-manager`
- **GitHub**: https://github.com/geganoza/bebias-shipping-manager

## Status
- ✅ Backend complete (Prisma + PostgreSQL on Vercel)
- ✅ Web app deployed
- 🚧 Mobile app - IN PROGRESS

## Tech Stack
- Expo SDK 52+
- React Native + TypeScript
- Expo Router
- NativeWind (TailwindCSS)
- React Query

## Backend (DO NOT MODIFY)
- Next.js API routes on Vercel
- Prisma ORM + PostgreSQL
- Models: Order, WoltPreorder, ConfirmedLocation, AddressRecord, Settings

## Key Models

### Order
```typescript
{
  id, externalId, customerName, customerPhone, customerAddress,
  city, productName, quantity, notes, status, trackingCode,
  shippingProvider, shippingMethod, lat, lon, woltPrice,
  woltOrderId, woltTrackingUrl, woltStatus, carrierStatus
}
```

### OrderStatus
```
PENDING | CONFIRMED | PROCESSING | SHIPPED | IN_TRANSIT | 
OUT_FOR_DELIVERY | DELIVERED | CANCELLED | RETURNED | FAILED
```

## API Endpoints
```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
DELETE /api/orders/:id
```

## Commands
- `npx expo start` - Dev server
- `npx expo start --ios` - iOS
- `npx expo start --android` - Android
- `eas build --platform ios --profile preview` - TestFlight
- `eas build --platform android --profile preview` - APK

## Rules
- ❌ Don't modify backend/API
- ❌ Don't modify Prisma schema
- ✅ Test on both iOS and Android
- ✅ Handle loading/error/empty states
- ✅ Use existing API endpoints

## Preferences
- Run debugger agent in background (user continues working while debugging)
