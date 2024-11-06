import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function AddHike() {
  const [hikeName, setHikeName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]); // Reitin tallennus

  // Pyydetään lupaa sijainnin käyttöön
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sijainnin käyttö estetty', 'Lupa tarvitaan reitin tallentamiseen.');
        return;
      }

      // Aloitetaan sijainnin seuranta
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setRoute((currentRoute) => [...currentRoute, { latitude, longitude }]);
          setLocation({ latitude, longitude });
        }
      );
    })();
  }, []);

  // Tallennetaan retki
  const saveHike = () => {
    if (!hikeName || !date) {
      Alert.alert('Täytä kaikki kentät', 'Retken nimi ja ajankohta ovat pakollisia');
      return;
    }

    const hikeData = {
      name: hikeName,
      date: date,
      info: additionalInfo,
      route: route,
    };

    // Tallennus Firebaseen
    console.log('Tallennettu retki:', hikeData);
    Alert.alert('Retki tallennettu!', 'Retki ja reitti on tallennettu onnistuneesti.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lisää uusi retki</Text>

      <TextInput
        placeholder="Retken nimi"
        value={hikeName}
        onChangeText={setHikeName}
        style={styles.input}
      />

      <TextInput
        placeholder="Ajankohta (esim. 2024-11-06)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Lisätiedot"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        style={styles.input}
        multiline
      />

      <Button title="Tallenna retki" onPress={saveHike} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
