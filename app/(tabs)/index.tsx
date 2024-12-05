import { StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import ListingCard from '@/components/ListingCard';
import { setupNotificationHandler } from '@/utils/notifications';
import { getListings, Listing } from '@/services/listings';

export default function TabOneScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setupNotificationHandler();
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setError(null);
      const fetchedListings = await getListings();
      console.log('Fetched listings:', fetchedListings);
      setListings(fetchedListings);
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Error fetching listings:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const handleListingPress = (id: string) => {
    console.log('Navigating to listing:', id);
    router.push(`/(tabs)/listings/${id}`);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleListingPress(item.id)}>
            <ListingCard
              title={item.title}
              price={item.price}
              imageUrl={item.images[0]}
              onPress={() => handleListingPress(item.id)}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No listings found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
