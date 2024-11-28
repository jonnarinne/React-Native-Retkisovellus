import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getAuth } from 'firebase/auth'; // Haetaan Firebase Auth

export default function HikeDetails({ route, navigation }) {
  const { hike } = route.params; // Haetaan retken tiedot navigoinnista
  const auth = getAuth(); // Haetaan autentikointipalvelu
  const user = auth.currentUser; // Kirjautunut käyttäjä

  useEffect(() => {
    if (user) {
      console.log('Kirjautuneen käyttäjän ID:', user.uid); // Näytetään käyttäjän ID konsolissa
    } else {
      console.log('Ei kirjautunutta käyttäjää'); // Debug-loki
    }
  }, [user]); // Tarkkaillaan käyttäjätietoja

  // Navigoi muokkausnäkymään
  const handleEditPress = () => {
    if (user) {
      navigation.navigate('EditHike', { hike }); // Ei tarvitse välittää userId:tä
    } else {
      Alert.alert(
        'Virhe',
        'Kirjaudu sisään muokataksesi retken tietoja.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hike.name}</Text>
      <Text>{hike.additionalInfo}</Text>
      <Text>{hike.createdAt ? new Date(hike.createdAt).toLocaleDateString() : ''}</Text>

      {/* Näytetään reitti MapView-komponentissa */}
      {hike.route && hike.route.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: hike.route[0].latitude,
            longitude: hike.route[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline coordinates={hike.route} strokeColor="#2e8b57" strokeWidth={3} />
        </MapView>
      )}

      {/* Muokkaa retken tietoja -painike */}
      <Button title="Muokkaa retken tietoja" onPress={handleEditPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    flex: 1,
    borderRadius: 5,
    marginTop: 20,
  },
});
