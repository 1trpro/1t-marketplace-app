import { Stack } from 'expo-router';

export default function ListingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerBackTitle: 'Tillbaka',
        }}
      />
    </Stack>
  );
}
