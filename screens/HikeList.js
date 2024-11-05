import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HikeList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tehdyt retket</Text>
      {/* Lisää tallennettujen retkien lista tähän */}
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
