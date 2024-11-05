import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa Luontoseikkailu-sovellukseen!</Text>
      <Button
        title="Lisää uusi retki"
        onPress={() => navigation.navigate('AddHike')}
      />
      <Button
        title="Tehdyt retket"
        onPress={() => navigation.navigate('HikeList')}
        style={styles.button}
      />
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
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2e8b57',
  },
  button: {
    marginTop: 10,
  },
});
