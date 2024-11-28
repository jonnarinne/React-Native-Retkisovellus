import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, set, push } from 'firebase/database';  // Importoidaan Firebase Realtime Database
import { getAuth } from 'firebase/auth';  // Käyttäjätietojen hallinta

export default function AddHike({ navigation }) {
  const [route, setRoute] = useState([]);
  const [initialLocation, setInitialLocation] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sijainnin käyttö estetty', 'Lupa tarvitaan reitin tallentamiseen.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setInitialLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    requestLocationPermission();
  }, []);

  const startTracking = async () => {
    setRoute([]); // Nollaa reitti
    setTracking(true);

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        setRoute((currentRoute) => [...currentRoute, { latitude, longitude }]);
      }
    );
  };

  const stopTracking = async () => {
    setTracking(false);
  
    if (route.length === 0) {
      Alert.alert('Ei tallennettavaa reittiä', 'Reitin täytyy sisältää vähintään yksi sijainti.');
      return;
    }
  
    // Siirry "SaveHike"-sivulle, mutta älä tallenna Firebaseen vielä
    navigation.navigate('SaveHike', { route });
  };
  

  return (
    <View style={styles.container}>
      {initialLocation && (
        <MapView style={styles.map} region={initialLocation}>
          {route.length > 0 && (
            <>
              <Polyline coordinates={route} strokeColor="#2e8b57" strokeWidth={3} />
              <Marker coordinate={route[0]} title="Aloituspaikka" pinColor="green" />
              <Marker coordinate={route[route.length - 1]} title="Nykyinen sijainti" />
            </>
          )}
        </MapView>
      )}
      <Button
        title={tracking ? 'Lopeta reitin tallennus' : 'Aloita reitin tallennus'}
        onPress={tracking ? stopTracking : startTracking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7e6',
  },
  map: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});