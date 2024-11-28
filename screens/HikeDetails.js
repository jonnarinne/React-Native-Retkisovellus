import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

export default function HikeDetails({ route, navigation }) {
  const { hike } = route.params;  // Haetaan retken tiedot navigoinnista

  // Navigoi muokkausnäkymään
  const handleEditPress = () => {
    navigation.navigate('EditHike', { hike });  // Siirry muokkausnäkymään
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
