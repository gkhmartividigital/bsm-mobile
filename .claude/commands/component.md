# Create Component

Create a component: $ARGUMENTS

## Steps

1. Location:
   - UI component → `src/components/ui/$ARGUMENTS.tsx`
   - Feature component → `src/components/$ARGUMENTS.tsx`

2. Template:

```tsx
import { View, Text, Pressable } from 'react-native'
import { cn } from '@/lib/utils'

interface $ARGUMENTSProps {
  className?: string
}

export function $ARGUMENTS({ className }: $ARGUMENTSProps) {
  return (
    <View className={cn('bg-white p-4 rounded-lg', className)}>
      {/* content */}
    </View>
  )
}
```

3. Export from index if in ui folder

4. Create test file

5. Test on iOS and Android
