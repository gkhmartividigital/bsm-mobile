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

## ClickUp Integration
**Workspace ID**: 90182241209

### Task Status Flow (update automatically)
| Status | When |
|--------|------|
| `To do` | Task not started |
| `In progress` | Started working on task |
| `Ready for review` | Code done, needs user testing |
| `Completed` | User confirmed it works |

### Bug Tracking

**When bug/error occurs:**
- Create task in `Bugs > Reported` (list: 901815161942)
- Include: error message, stack trace, what caused it

**When bug is fixed:**
- Move task to `Bugs > Fixed` (list: 901815161949)
- Update description with: what was wrong + how it was fixed + files changed

### Lists Reference
- Features: 901815161937
- Sprint: 901815161930
- Backlog: 901815161922
- Bugs/Reported: 901815161942
- Bugs/Fixed: 901815161949
