import React from 'react';
import { View, Text } from 'react-native';
import { OrderStatus, STATUS_COLORS } from '@/constants';

interface BadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  READY: 'Ready',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.PENDING;

  const sizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
  };

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <View
      className={`rounded-full ${sizeStyles[size]}`}
      style={{ backgroundColor: `${color}20` }}
    >
      <Text
        className={`font-semibold ${textSize[size]}`}
        style={{ color }}
      >
        {STATUS_LABELS[status] || status}
      </Text>
    </View>
  );
}

interface ProviderBadgeProps {
  provider: 'wolt' | 'trackings_ge' | 'manual' | string | null;
}

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  const config = {
    wolt: { label: 'Wolt', color: '#00c2e8', bg: '#00c2e820' },
    trackings_ge: { label: 'Trackings', color: '#f59e0b', bg: '#f59e0b20' },
    manual: { label: 'Manual', color: '#6b7280', bg: '#6b728020' },
  };

  const { label, color, bg } = config[provider as keyof typeof config] || config.manual;

  return (
    <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: bg }}>
      <Text className="text-xs font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
