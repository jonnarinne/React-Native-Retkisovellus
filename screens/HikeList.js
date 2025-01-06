import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, ImageBackground } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const backgroundImage = require('../assets/forest.jpg');

export default function HikeList({ navigation }) {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHikes();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchHikes = () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const hikesRef = ref(db, `hikes/${user.uid}`);

      onValue(hikesRef, (snapshot) => {
        const data = snapshot.val();
        const hikesArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
        setHikes(hikesArray);
        setLoading(false);
      });
    } else {
      console.error('Käyttäjä ei ole kirjautunut.');
      setLoading(false);
    }
  };

  const renderHike = ({ item }) => {
    const totalDistance = item.route && item.route.length > 1 
      ? calculateTotalDistance(item.route) 
      : 0;

    return (
      <View style={styles.hikeItem}>
        <Text style={styles.hikeName}>{item.name}</Text>
        {item.createdAt && (
          <Text style={styles.hikeDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
        {totalDistance > 0 && (
          <Text style={styles.hikeDistance}>
            Pituus: {totalDistance} km
          </Text>
        )}
        <Button
          title="Näytä reitti"
          onPress={() => navigation.navigate('HikeDetails', { hike: item })}
        />
      </View>
    );
  };

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

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#2e8b57" />
        ) : hikes.length > 0 ? (
          <FlatList
            data={hikes}
            keyExtractor={(item) => item.id}
            renderItem={renderHike}
          />
        ) : (
          <Text style={styles.noHikesText}>Retkiä ei löytynyt.</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  hikeItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(245, 245, 220, 0.9)',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  hikeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hikeDate: {
    fontSize: 14,
    color: '#666',
  },
  hikeDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noHikesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
