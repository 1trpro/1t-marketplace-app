import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getListing, Listing } from '@/services/listings';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Listing ID:', id);
    const fetchListing = async () => {
      if (!id) {
        setError('No listing ID provided');
        return;
      }

      try {
        const data = await getListing(id);
        console.log('Fetched listing data:', data);
        if (!data) {
          setError('Listing not found');
          return;
        }
        setListing(data);
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Failed to load listing');
      }
    };

    fetchListing();
  }, [id]);

  return (
    <>
      <Stack.Screen 
        options={{
          title: listing?.title || 'Loading...',
        }} 
      />
      <ScrollView style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : !listing ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            {listing.images && listing.images.length > 0 && (
              <Image
                source={{ uri: listing.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <View style={styles.content}>
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.price}>{listing.price} kr</Text>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => listing.link && Linking.openURL(listing.link)}
              >
                <Text style={styles.buttonText}>Öppna annons</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
