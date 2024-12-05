import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native';
import Airtable from 'airtable';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const AIRTABLE_API_KEY = "patSbAJRdP9deCKvo.b83daa397f6edc23edbeb055fe33c9c5b9584c3a403f83396d69f9c29893c544";
const AIRTABLE_BASE_ID = "appIfwlLhEOnogfBz";
const AIRTABLE_TABLE_NAME = "tblXTBWxdCjnEV5RQ";

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export default function TabTwoScreen() {
  const [modelName, setModelName] = useState('');
  const [price, setPrice] = useState('');

  const addRowToAirtable = async () => {
    try {
      console.log('Price before sending:', price);
      const sanitizedPrice = price.replace(/[^0-9]/g, '');
      console.log('Sanitized price:', sanitizedPrice);
      const newRow = { "Model_Name_Prediction": modelName, "Genomsnittspris": parseInt(sanitizedPrice) };
      await base(AIRTABLE_TABLE_NAME).create(newRow);
      alert(`${modelName} har lagts till i bevakningslistan!`);
    } catch (error) {
      console.error('Error adding row:', error);
      alert('Failed to add row.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Add New Item</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Model Name"
          placeholderTextColor="#808080"
          value={modelName}
          onChangeText={setModelName}
          color="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#808080"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          color="#ffffff"
        />
        <Button title="Add Row" onPress={addRowToAirtable} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  inputContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    color: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#404040',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#1a1a1a',
  },
});
