import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, Image } from 'react-native'

// Wolt icon image
const woltIcon = require('../../assets/icons/wolt-icon.png')

// Tab icon component
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  // Use image for Wolt, emoji for others
  if (name === 'wolt') {
    return (
      <View className="items-center">
        <Image
          source={woltIcon}
          style={{
            width: 28,
            height: 28,
            opacity: focused ? 1 : 0.5,
          }}
          resizeMode="contain"
        />
      </View>
    )
  }

  const icons: Record<string, string> = {
    orders: '📦',
    settings: '⚙️',
  }

  return (
    <View className="items-center">
      <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
        {icons[name] || '📦'}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Orders',
          headerTitle: 'Shipping Manager',
          tabBarIcon: ({ focused }) => <TabIcon name="orders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wolt"
        options={{
          title: 'Wolt',
          headerTitle: 'Wolt Preorders',
          tabBarIcon: ({ focused }) => <TabIcon name="wolt" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders/[id]"
        options={{
          href: null, // Hide from tab bar
          title: 'Order Details',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
