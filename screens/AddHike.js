import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/forest.jpg');

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
    setRoute([]);
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

    navigation.navigate('SaveHike', { route });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlayContainer}>
        <View style={styles.box}>
          <View style={styles.mapContainer}>
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
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={tracking ? 'Lopeta reitin tallennus' : 'Aloita reitin tallennus'}
              onPress={tracking ? stopTracking : startTracking}
              color="#2e8b57"
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: 'rgba(245, 245, 220, 0.9)', // Vaalean beige laatikko
    borderRadius: 10, // Pyöristetyt kulmat
    padding: 20,
    width: '90%', // Laatikon leveys
    shadowColor: '#000', // Varjo
    shadowOffset: { width: 0, height: 2 }, // Varjon siirtymä
    shadowOpacity: 0.3, // Varjon läpinäkyvyys
    shadowRadius: 4, // Varjon sumeus
    elevation: 5, // Varjo Androidille
  },
  mapContainer: {
    height: 300, // Kartan korkeus
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden', // Pyöristettyjen kulmien säilyttäminen
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
