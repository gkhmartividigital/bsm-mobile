import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { OrderStatus, STATUS_COLORS } from '@/constants';

interface Tab {
  key: 'all' | OrderStatus;
  label: string;
  count: number;
}

interface OrderStatusTabsProps {
  activeTab: 'all' | OrderStatus;
  onTabChange: (tab: 'all' | OrderStatus) => void;
  counts: {
    pending: number;
    ready: number;
    shipped: number;
    delivered: number;
    total: number;
  };
}

export function OrderStatusTabs({
  activeTab,
  onTabChange,
  counts,
}: OrderStatusTabsProps) {
  const tabs: Tab[] = [
    { key: 'all', label: 'All', count: counts.total },
    { key: 'PENDING', label: 'Pending', count: counts.pending },
    { key: 'READY', label: 'Ready', count: counts.ready },
    { key: 'SHIPPED', label: 'Shipped', count: counts.shipped },
    { key: 'DELIVERED', label: 'Delivered', count: counts.delivered },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        const color =
          tab.key === 'all'
            ? '#0ea5e9'
            : STATUS_COLORS[tab.key as OrderStatus] || '#6b7280';

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className={`mr-2 flex-row items-center rounded-full px-4 py-2 ${
              isActive ? 'border-2' : 'bg-gray-100'
            }`}
            style={
              isActive
                ? { borderColor: color, backgroundColor: `${color}10` }
                : undefined
            }
          >
            <Text
              className={`font-medium ${isActive ? '' : 'text-gray-600'}`}
              style={isActive ? { color } : undefined}
            >
              {tab.label}
            </Text>
            <View
              className="ml-2 rounded-full px-2 py-0.5"
              style={{ backgroundColor: isActive ? color : '#e5e7eb' }}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? 'text-white' : 'text-gray-600'
                }`}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
