import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';

export default function Home({ navigation }) {
  useEffect(() => {
    const auth = getAuth(); 
    const user = auth.currentUser;
    
    if (user) {
      console.log('Kirjautunut käyttäjä ID:', user.uid);
    } else {
      console.log('Ei kirjautunutta käyttäjää');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa Retkisovellukseen!</Text>
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
