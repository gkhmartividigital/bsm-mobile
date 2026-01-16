import React, { useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks'
import { Card, Button } from '@/components/ui'
import { APP_CONFIG } from '@/constants'

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <View className="flex-row items-center mb-3">
      <Text className="text-lg mr-2">{icon}</Text>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-100">
      <Text className="text-gray-500">{label}</Text>
      <Text className="font-medium text-gray-900">{value}</Text>
    </View>
  )
}

function UserAvatar({ name }: { name?: string }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <View className="w-16 h-16 rounded-full bg-primary-600 items-center justify-center mb-4">
      <Text className="text-white text-xl font-bold">{initials}</Text>
    </View>
  )
}

export default function SettingsScreen() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true)
          try {
            await logout()
          } finally {
            setIsLoggingOut(false)
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* User Info */}
        <Card variant="elevated" className="mb-4">
          <SectionHeader icon="👤" title="Account" />
          <UserAvatar name={user?.name} />
          <View>
            <InfoRow label="Name" value={user?.name || '-'} />
            <View className="mt-2">
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Email</Text>
                <Text className="font-medium text-gray-900">{user?.email || '-'}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* App Info */}
        <Card variant="elevated" className="mb-4">
          <SectionHeader icon="ℹ️" title="App Info" />
          <View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-500">Version</Text>
              <Text className="font-medium text-gray-900">
                {APP_CONFIG.VERSION}
              </Text>
            </View>
          </View>
        </Card>

        {/* Notifications */}
        <Card variant="elevated" className="mb-4">
          <SectionHeader icon="🔔" title="Notifications" />
          <Text className="mb-4 text-gray-500">
            Push notifications for new orders and status updates
          </Text>
          <Button
            title="Configure Notifications"
            variant="outline"
            fullWidth
            onPress={() => {
              Alert.alert('Coming Soon', 'Notification settings coming in Phase 2')
            }}
          />
        </Card>

        {/* Sync Settings */}
        <Card variant="elevated" className="mb-4">
          <SectionHeader icon="🔄" title="Data Sync" />
          <Text className="mb-4 text-gray-500">
            Auto-refresh interval: 30 seconds
          </Text>
          <Button
            title="Force Sync Now"
            variant="outline"
            fullWidth
            onPress={() => {
              Alert.alert('Sync', 'Pull down on the orders list to refresh')
            }}
          />
        </Card>

        {/* Logout */}
        <Card variant="outlined" className="mb-8">
          <SectionHeader icon="🚪" title="Logout" />
          <Button
            title={isLoggingOut ? 'Logging out...' : 'Logout'}
            variant="danger"
            fullWidth
            loading={isLoggingOut}
            onPress={handleLogout}
          />
        </Card>

        {/* Footer */}
        <Text className="mb-8 text-center text-sm text-gray-400">
          BEBIAS Shipping Manager{'\n'}
          Built with Expo & React Native
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
