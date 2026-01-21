import React, { useState, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { Button } from './Button'

interface LocationPickerModalProps {
  visible: boolean
  onClose: () => void
  onSave: (lat: number, lon: number) => void
  initialLat?: number | null
  initialLon?: number | null
  title?: string
}

// Default location (Tbilisi center)
const DEFAULT_LOCATION = {
  lat: 41.7151,
  lon: 44.8271,
}

export function LocationPickerModal({
  visible,
  onClose,
  onSave,
  initialLat,
  initialLon,
  title = 'Select Location',
}: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState<number>(
    initialLat ?? DEFAULT_LOCATION.lat
  )
  const [selectedLon, setSelectedLon] = useState<number>(
    initialLon ?? DEFAULT_LOCATION.lon
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  // Update selected location when initial values change
  useEffect(() => {
    if (visible) {
      setSelectedLat(initialLat ?? DEFAULT_LOCATION.lat)
      setSelectedLon(initialLon ?? DEFAULT_LOCATION.lon)
    }
  }, [visible, initialLat, initialLon])

  const handleGetCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please enable location permissions in settings to use this feature.'
        )
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      setSelectedLat(location.coords.latitude)
      setSelectedLon(location.coords.longitude)
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please try again.')
      console.error('Location error:', error)
    } finally {
      setIsLoadingLocation(false)
    }
  }, [])

  const handleSave = useCallback(() => {
    onSave(selectedLat, selectedLon)
    onClose()
  }, [selectedLat, selectedLon, onSave, onClose])

  const handleMapPress = useCallback((event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setSelectedLat(latitude)
    setSelectedLon(longitude)
  }, [])

  // Lazy load MapView
  let MapView: typeof import('react-native-maps').default | null = null
  let Marker: typeof import('react-native-maps').Marker | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const maps = require('react-native-maps')
    MapView = maps.default
    Marker = maps.Marker
  } catch (e) {
    console.warn('react-native-maps not available:', e)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>
          <View className="w-10" />
        </View>

        {/* Map */}
        <View className="flex-1">
          {MapView && Marker ? (
            <>
              {!mapReady && (
                <View className="absolute inset-0 bg-gray-100 items-center justify-center z-10">
                  <ActivityIndicator size="large" color="#4f46e5" />
                  <Text className="text-gray-500 mt-2">Loading map...</Text>
                </View>
              )}
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: selectedLat,
                  longitude: selectedLon,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                region={{
                  latitude: selectedLat,
                  longitude: selectedLon,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
                onMapReady={() => setMapReady(true)}
                showsUserLocation
                showsMyLocationButton={false}
              >
                <Marker
                  coordinate={{ latitude: selectedLat, longitude: selectedLon }}
                  draggable
                  onDragEnd={(e) => {
                    setSelectedLat(e.nativeEvent.coordinate.latitude)
                    setSelectedLon(e.nativeEvent.coordinate.longitude)
                  }}
                />
              </MapView>
            </>
          ) : (
            <View className="flex-1 bg-gray-100 items-center justify-center">
              <Ionicons name="map-outline" size={64} color="#9ca3af" />
              <Text className="text-gray-500 mt-4">Map not available</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Enter coordinates manually below
              </Text>
            </View>
          )}

          {/* Instructions overlay */}
          <View className="absolute top-4 left-4 right-4 bg-white/90 rounded-lg px-4 py-2 shadow-sm">
            <Text className="text-gray-600 text-center text-sm">
              Tap on map or drag marker to select location
            </Text>
          </View>
        </View>

        {/* Coordinates display */}
        <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <Text className="text-xs text-gray-500 mb-1">Selected coordinates:</Text>
          <Text className="font-mono text-gray-700">
            {selectedLat.toFixed(6)}, {selectedLon.toFixed(6)}
          </Text>
        </View>

        {/* Actions */}
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <Button
            title={isLoadingLocation ? 'Getting location...' : 'Use My Current Location'}
            variant="outline"
            fullWidth
            onPress={handleGetCurrentLocation}
            loading={isLoadingLocation}
            icon={<Ionicons name="locate" size={18} color="#4f46e5" />}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Save Location"
            variant="primary"
            fullWidth
            onPress={handleSave}
            style={{ backgroundColor: '#0284c7' }}
            icon={<Ionicons name="checkmark" size={18} color="#ffffff" />}
          />
        </View>
      </View>
    </Modal>
  )
}
