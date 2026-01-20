// Extend expect with React Native Testing Library matchers
// Note: For RNTL v13+, matchers are auto-extended when using jest-expo preset

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}))

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}))

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  }
})

// Export mock functions for Linking tests
export const mockOpenURL = jest.fn(() => Promise.resolve())
export const mockCanOpenURL = jest.fn(() => Promise.resolve(true))

export const mockLinking = {
  openURL: mockOpenURL,
  canOpenURL: mockCanOpenURL,
}

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View
  const Animated = {
    View,
  }

  // Create chainable animation config objects
  const createChainable = () => {
    const obj: Record<string, () => Record<string, () => Record<string, unknown>>> = {}
    obj.duration = () => createChainable()
    obj.delay = () => createChainable()
    obj.springify = () => createChainable()
    return obj
  }

  return {
    __esModule: true,
    default: Animated,
    FadeIn: createChainable(),
    FadeOut: createChainable(),
    Layout: createChainable(),
    SlideInRight: createChainable(),
    SlideOutLeft: createChainable(),
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDelay: jest.fn((_, animation) => animation),
    runOnJS: jest.fn((fn) => fn),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      bezier: jest.fn(() => jest.fn()),
    },
  }
})

// Silence console warnings in tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('NativeWind') || args[0].includes('Animated'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})
