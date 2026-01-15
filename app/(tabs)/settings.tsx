import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks';
import { Card, Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        {/* User Info */}
        <Card variant="elevated" className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">
            Account
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Name</Text>
              <Text className="font-medium text-gray-900">{user?.name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Email</Text>
              <Text className="font-medium text-gray-900">{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* App Info */}
        <Card variant="elevated" className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">
            App Info
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Version</Text>
              <Text className="font-medium text-gray-900">
                {APP_CONFIG.VERSION}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Name</Text>
              <Text className="font-medium text-gray-900">
                {APP_CONFIG.APP_NAME}
              </Text>
            </View>
          </View>
        </Card>

        {/* Notifications */}
        <Card variant="elevated" className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">
            Notifications
          </Text>
          <Text className="mb-4 text-gray-500">
            Push notifications for new orders and status updates
          </Text>
          <Button
            title="Configure Notifications"
            variant="outline"
            fullWidth
            onPress={() => {
              // TODO: Implement notification settings
              Alert.alert('Coming Soon', 'Notification settings coming in Phase 2');
            }}
          />
        </Card>

        {/* Sync Settings */}
        <Card variant="elevated" className="mb-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">
            Data Sync
          </Text>
          <Text className="mb-4 text-gray-500">
            Auto-refresh interval: 30 seconds
          </Text>
          <Button
            title="Force Sync Now"
            variant="outline"
            fullWidth
            onPress={() => {
              Alert.alert('Sync', 'Pull down on the orders list to refresh');
            }}
          />
        </Card>

        {/* Logout */}
        <Card variant="outlined" className="mb-8">
          <Button
            title="Logout"
            variant="danger"
            fullWidth
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
  );
}
