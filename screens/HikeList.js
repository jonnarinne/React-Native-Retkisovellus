import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

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

  const renderHike = ({ item }) => (
    <View style={styles.hikeItem}>
      <Text style={styles.hikeName}>{item.name}</Text>
      <Button
        title="Lisätiedot"
        onPress={() => navigation.navigate('HikeDetails', { hike: item })}
      />
    </View>
  );

  return (
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
        <Text style={styles.noHikesText}>Ei retkiä löytynyt.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7e6',
  },
  hikeItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
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
  noHikesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
