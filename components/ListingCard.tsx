import React, { forwardRef } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, View } from './Themed';

interface ListingCardProps {
  title: string;
  price: number;
  imageUrl: string;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

const ListingCard = forwardRef<TouchableOpacity, ListingCardProps>(
  ({ title, price, imageUrl, onPress }, ref) => {
    return (
      <TouchableOpacity ref={ref} onPress={onPress} style={styles.card}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.price}>{price} kr</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f95dc',
  },
});
