# Create Screen

Create a new screen: $ARGUMENTS

## Steps

1. Determine location:
   - Tab screen → `app/(tabs)/$ARGUMENTS.tsx`
   - Stack screen → `app/$ARGUMENTS.tsx`
   - Detail screen → `app/[id].tsx`

2. Create with this template:

```tsx
import { View, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { useQuery } from '@tanstack/react-query'

export default function $ARGUMENTSScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['$ARGUMENTS'],
    queryFn: fetchData,
  })

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: '$ARGUMENTS' }} />
      {/* Content */}
    </SafeAreaView>
  )
}
```

3. Add to navigation if needed

4. Test on iOS and Android
