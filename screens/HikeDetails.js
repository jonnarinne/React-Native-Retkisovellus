import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ImageBackground,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';

const backgroundImage = require('../assets/forest.jpg');

export default function HikeDetails({ route, navigation }) {
  const { hike } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log('Kirjautuneen käyttäjän ID:', user.uid);
    } else {
      console.log('Ei kirjautunutta käyttäjää');
    }
  }, [user]);

  const haversine = (coord1, coord2) => {
    const R = 6371;
    const toRad = (value) => (value * Math.PI) / 180;

    const lat1 = toRad(coord1.latitude);
    const lon1 = toRad(coord1.longitude);
    const lat2 = toRad(coord2.latitude);
    const lon2 = toRad(coord2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateTotalDistance = (route) => {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += haversine(route[i], route[i + 1]);
    }
    return totalDistance.toFixed(2);
  };

  const totalDistance = hike.route && hike.route.length > 1 ? calculateTotalDistance(hike.route) : 0;

  const handleEditPress = () => {
    if (user) {
      navigation.navigate('EditHike', { hike });
    } else {
      Alert.alert(
        'Virhe',
        'Kirjaudu sisään muokataksesi retken tietoja.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    }
  };

  const handleDeletePress = () => {
    if (!user) {
      Alert.alert(
        'Virhe',
        'Kirjaudu sisään poistaaksesi retken.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
      return;
    }

    Alert.alert(
      'Vahvista poisto',
      `Haluatko varmasti poistaa retken "${hike.name}"?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = getDatabase();
              const hikeRef = ref(db, `hikes/${user.uid}/${hike.id}`);
              await remove(hikeRef);
              console.log('Retki poistettu:', hike.id);
              Alert.alert('Poisto onnistui', 'Retki on poistettu.');
              navigation.navigate('HikeList');
            } catch (error) {
              console.error('Virhe poistettaessa retkeä:', error);
              Alert.alert('Virhe', 'Retken poistaminen epäonnistui.');
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlayContainer}>
        <View style={styles.box}>
          <Text style={styles.title}>{hike.name}</Text>
          <Text style={styles.info}>{hike.additionalInfo}</Text>
          <Text style={styles.date}>
            {hike.createdAt ? new Date(hike.createdAt).toLocaleDateString() : ''}
          </Text>
          <Text style={styles.distance}>Reitin pituus: {totalDistance} km</Text>

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

          <View style={styles.buttonContainer}>
            <Button title="Muokkaa retken tietoja" onPress={handleEditPress} color="#2e8b57" />
          </View>

          <View style={styles.deleteButtonContainer}>
            <Button title="Poista retki" color="#ff4d4d" onPress={handleDeletePress} />
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
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 10,
    padding: 20,
    width: '90%',
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
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  distance: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#2e8b57',
  },
  map: {
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  deleteButtonContainer: {
    marginTop: 10,
  },
});
