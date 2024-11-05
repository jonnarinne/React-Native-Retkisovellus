import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddHike() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lisää uusi retki</Text>
      {/* Lisää retken lisäyslomake tähän */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f7e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e8b57',
  },
});
