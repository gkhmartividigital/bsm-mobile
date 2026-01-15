import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks';
import { loginSchema, LoginFormData } from '@/utils';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);
    if (!success && error) {
      Alert.alert('Login Failed', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bebias-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo / Header */}
            <View className="mb-12 items-center">
              <Text className="text-4xl font-bold text-white">BSM</Text>
              <Text className="mt-2 text-lg text-gray-400">
                Shipping Manager
              </Text>
            </View>

            {/* Login Form */}
            <View className="rounded-2xl bg-white p-6">
              <Text className="mb-6 text-center text-2xl font-bold text-gray-900">
                Welcome Back
              </Text>

              {/* Error Message */}
              {error && (
                <View className="mb-4 rounded-lg bg-red-50 p-3">
                  <Text className="text-center text-sm text-red-600">
                    {error}
                  </Text>
                </View>
              )}

              {/* Email Input */}
              <View className="mb-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                    />
                  )}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                    />
                  )}
                />
              </View>

              {/* Login Button */}
              <Button
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </View>

            {/* Footer */}
            <Text className="mt-8 text-center text-sm text-gray-500">
              BEBIAS Shipping Manager v1.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
