import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/forest.jpg');

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
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlayContainer}>
        <View style={styles.textBox}>
          <Text style={styles.title}>Tervetuloa Retkisovellukseen!</Text>
          <Text style={styles.description}>
            Tämä sovellus auttaa sinua seuraamaan ja tallentamaan retkiäsi. Voit aloittaa uuden retken, 
            tallentaa reittisi ja katsella aiempia retkiäsi. Tutustu ja nauti luonnosta!
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textBox: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
