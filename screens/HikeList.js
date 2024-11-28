import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';  // Importoidaan Realtime Database -moduulit
import { getAuth } from 'firebase/auth';  // Tuodaan autentikointimoduuli

export default function HikeList({ navigation }) {
  const [hikes, setHikes] = useState([]);

  useEffect(() => {
    const fetchHikes = async () => {
      try {
        const user = getAuth().currentUser;  // Haetaan nykyinen käyttäjä
        if (user) {
          const userId = user.uid;  // Käyttäjän ID
          const db = getDatabase();  // Hae Realtime Database
          const hikesRef = ref(db, 'hikes/' + userId);  // Viittaa käyttäjän omiin retkiin
          const snapshot = await get(hikesRef);  // Haetaan retket
          if (snapshot.exists()) {
            const hikesData = [];
            snapshot.forEach((childSnapshot) => {
              hikesData.push({
                id: childSnapshot.key,  // Reitin uniikki tunniste
                ...childSnapshot.val(),  // Reitin tiedot
              });
            });
            setHikes(hikesData);  // Asetetaan retket tilaan
          } else {
            console.log('Ei retkiä löytynyt');
          }
        } else {
          console.log('Ei kirjautunutta käyttäjää');
        }
      } catch (error) {
        console.error('Virhe noudettaessa retkiä:', error);
      }
    };

    fetchHikes();
  }, []);

  // Siirry lisätietoihin
  const handleHikePress = (hike) => {
    navigation.navigate('HikeDetails', { hike });  // Siirry HikeDetails-sivulle ja siirrä retken tiedot
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tehdyt retket</Text>
      <FlatList
        data={hikes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>

            {/* Lisätiedot-painike */}
            <TouchableOpacity onPress={() => handleHikePress(item)}>
              <Text style={styles.detailsLink}>Lisätiedot</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  item: {
    marginBottom: 15,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  name: {
    fontWeight: 'bold',
  },
  detailsLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});