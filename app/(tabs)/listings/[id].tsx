import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getListing, Listing } from '@/services/listings';
import Carousel from 'react-native-reanimated-carousel';

export default function ListingDetailsScreen() {
  const params = useLocalSearchParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = Dimensions.get('window').width;

  useEffect(() => {
    console.log('Listing params:', params);
    const fetchListing = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid listing ID');
        return;
      }

      try {
        const data = await getListing(params.id);
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
  }, [params.id]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {listing.images && listing.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width}
            height={300}
            data={listing.images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          />
        </View>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  carouselContainer: {
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
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
