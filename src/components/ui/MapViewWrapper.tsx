import React, { useState, useCallback } from 'react'
import { View, Text, Pressable, Platform, Linking, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface MapViewWrapperProps {
  latitude: number
  longitude: number
  title?: string
  description?: string
  height?: number
}

interface ErrorBoundaryState {
  hasError: boolean
}

// Error boundary class component for catching MapView errors
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('MapView error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Fallback component when map is unavailable
function MapFallback({
  latitude,
  longitude,
  title,
  description,
  height,
  onPress,
}: MapViewWrapperProps & { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-100 rounded-lg items-center justify-center"
      style={{ height }}
    >
      <View className="items-center">
        <View className="bg-primary-100 rounded-full p-4 mb-3">
          <Ionicons name="location" size={32} color="#4f46e5" />
        </View>
        <Text className="text-gray-700 font-medium text-center px-4">
          {title || 'Location available'}
        </Text>
        {description && (
          <Text className="text-gray-500 text-sm text-center px-4 mt-1" numberOfLines={2}>
            {description}
          </Text>
        )}
        <View className="flex-row items-center mt-3 bg-white px-4 py-2 rounded-full shadow-sm">
          <Ionicons name="navigate" size={16} color="#4f46e5" />
          <Text className="text-primary-600 font-medium ml-2">
            Open in Maps
          </Text>
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Text>
      </View>
    </Pressable>
  )
}

export function MapViewWrapper({
  latitude,
  longitude,
  title,
  description,
  height = 200,
}: MapViewWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadError, setHasLoadError] = useState(false)

  const openExternalMap = useCallback(() => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    })
    const url = Platform.select({
      ios: `${scheme}?q=${latitude},${longitude}`,
      android: `${scheme}${latitude},${longitude}?q=${latitude},${longitude}`,
    })
    Linking.openURL(url || `https://www.google.com/maps?q=${latitude},${longitude}`)
  }, [latitude, longitude])

  const handleMapReady = () => {
    setIsLoading(false)
  }


  // Show fallback if there was an error loading the map
  if (hasLoadError) {
    return (
      <MapFallback
        latitude={latitude}
        longitude={longitude}
        title={title}
        description={description}
        height={height}
        onPress={openExternalMap}
      />
    )
  }

  // Lazy load MapView to prevent crashes when module isn't available
  let MapView: typeof import('react-native-maps').default | null = null
  let Marker: typeof import('react-native-maps').Marker | null = null

  try {
    const maps = require('react-native-maps')
    MapView = maps.default
    Marker = maps.Marker
  } catch (e) {
    console.warn('react-native-maps not available:', e)
    return (
      <MapFallback
        latitude={latitude}
        longitude={longitude}
        title={title}
        description={description}
        height={height}
        onPress={openExternalMap}
      />
    )
  }

  const fallbackComponent = (
    <MapFallback
      latitude={latitude}
      longitude={longitude}
      title={title}
      description={description}
      height={height}
      onPress={openExternalMap}
    />
  )

  return (
    <MapErrorBoundary fallback={fallbackComponent}>
      <Pressable onPress={openExternalMap} className="rounded-lg overflow-hidden">
        <View style={{ height, width: '100%' }}>
          {isLoading && (
            <View
              className="absolute inset-0 bg-gray-100 items-center justify-center z-10"
              style={{ height }}
            >
              <ActivityIndicator size="small" color="#4f46e5" />
              <Text className="text-gray-500 text-sm mt-2">Loading map...</Text>
            </View>
          )}
          {MapView && Marker && (
            <MapView
              style={{ height, width: '100%' }}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              onMapReady={handleMapReady}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={title}
                description={description}
              />
            </MapView>
          )}
        </View>
        <View className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-full shadow">
          <Text className="text-sm font-medium text-primary-600">
            Tap to navigate
          </Text>
        </View>
      </Pressable>
    </MapErrorBoundary>
  )
}
