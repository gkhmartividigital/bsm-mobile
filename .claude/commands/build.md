# Build App

Build the app: $ARGUMENTS

Options: `ios`, `android`, `preview`, `production`

## Preview Build (Testing)

```bash
# iOS (TestFlight)
eas build --platform ios --profile preview

# Android (APK)
eas build --platform android --profile preview
```

## Production Build

```bash
eas build --platform all --profile production
```

## Before Building

```bash
npm run lint
npm run typecheck
npm test
npx expo-doctor
```

## After Building

1. Test on physical device
2. Verify API connections work
3. Check all screens load
