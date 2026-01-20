import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Icons
const woltIcon = require('../../assets/icons/wolt-icon.png')
const logo = require('../../assets/icon.png')

// Header title with logo
function HeaderLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={logo}
        style={{ width: 32, height: 32, borderRadius: 6, marginRight: 8 }}
        resizeMode="contain"
      />
      <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
        BEBIAS
      </Text>
    </View>
  )
}

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
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
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
          headerTitle: () => <HeaderLogo />,
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
        name="orders/edit"
        options={{
          href: null, // Hide from tab bar
          title: 'Edit Order',
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
