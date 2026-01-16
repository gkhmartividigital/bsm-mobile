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
- Expo SDK 54
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

## CI Checks (Run Before Pushing!)
**⚠️ ALWAYS run these before pushing to remote:**
```bash
npm run typecheck && npm run lint && npm test -- --passWithNoTests
```
If any check fails, fix it before committing.

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

**⚠️ CRITICAL: Always update ClickUp task status immediately when:**
- Starting work on a task → set to `In progress`
- Code is done and committed → set to `Ready for review`
- User says "it works", "good", "done", or confirms success → set to `Completed`

**DO NOT wait for user to remind you. Update status the moment the trigger happens.**

### Task Status Flow
| Status | Trigger |
|--------|---------|
| `To do` | Task not started |
| `In progress` | You start working on a task |
| `Ready for review` | Code committed, awaiting user test |
| `Completed` | User confirms it works (any positive confirmation) |

### Bug Tracking

**IMPORTANT: Log bugs in parallel - don't wait!**
- When bug appears, create ClickUp task AND start debugging in the same message (parallel tool calls)
- Never delay bug logging - it's step 1, not an afterthought

**When bug/error occurs:**
- Create task in `Bugs > Reported` (list: 901815161942) IMMEDIATELY
- Include: error message, stack trace, what caused it
- Do this in parallel with starting to debug

**When bug is fixed:**
- Move task to `Bugs > Fixed` (list: 901815161949)
- Update description with: what was wrong + how it was fixed + files changed
- Do this in parallel with continuing other work

### Lists Reference
- Features: 901815161937
- Sprint: 901815161930
- Backlog: 901815161922
- Bugs/Reported: 901815161942
- Bugs/Fixed: 901815161949
