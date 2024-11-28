import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth'; // Importoidaan Firebase Auth

export default function Home({ navigation }) {
  useEffect(() => {
    const auth = getAuth(); // Haetaan autentikointipalvelu
    const user = auth.currentUser; // Haetaan kirjautunut käyttäjä
    
    if (user) {
      console.log('Kirjautunut käyttäjä ID:', user.uid); // Näytetään userId konsolissa
    } else {
      console.log('Ei kirjautunutta käyttäjää'); // Jos käyttäjä ei ole kirjautunut
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa Retkisovellukseen!</Text>
      <Button
        title="Aloita retki"
        onPress={() => navigation.navigate('AddHike')}
      />
      <Button
        title="Retkeni"
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
