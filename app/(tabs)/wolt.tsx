import React from 'react'
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, EmptyState, LoadingScreen } from '@/components/ui'

// Placeholder screen - will be fully implemented in "Implement Wolt Preorders Screen" task
export default function WoltScreen() {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <EmptyState
          title="Wolt Preorders"
          description="Wolt preorder management coming soon. This screen will show orders pending warehouse confirmation before sending to Wolt."
        />
      </View>
    </SafeAreaView>
  )
}
