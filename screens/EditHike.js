import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export default function EditHike({ route, navigation }) {
  const { hike } = route.params; // Haetaan muokattavan retken tiedot navigointiparametreista
  const auth = getAuth(); // Haetaan Firebase Authentication -instanssi
  const user = auth.currentUser; // Haetaan kirjautunut käyttäjä

  if (!user) {
    Alert.alert('Virhe', 'Käyttäjää ei löydy. Kirjaudu uudelleen sisään.');
    navigation.navigate('Home'); // Palataan etusivulle, jos käyttäjä ei ole kirjautunut
    return null; // Komponentti ei lataa mitään, jos käyttäjää ei löydy
  }

  const userId = user.uid; // Käyttäjän ID
  const [hikeName, setHikeName] = useState(hike.name || '');
  const [additionalInfo, setAdditionalInfo] = useState(hike.additionalInfo || '');

  const handleUpdate = async () => {
    if (!hikeName.trim()) {
      Alert.alert('Virhe', 'Retken nimi ei voi olla tyhjä.');
      return;
    }

    try {
      const db = getDatabase();
      const hikeRef = ref(db, `hikes/${userId}/${hike.id}`); // Käytetään kirjautuneen käyttäjän ID:tä viitteessä

      await update(hikeRef, {
        name: hikeName,
        additionalInfo,
      });

      Alert.alert('Päivitys onnistui', 'Retken tiedot on päivitetty.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HikeList'), // Navigoidaan takaisin retkilistaan
        },
      ]);
    } catch (error) {
      console.error('Virhe päivitettäessä retkeä:', error);
      Alert.alert('Virhe', 'Tietojen päivitys epäonnistui.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Retken nimi</Text>
        <TextInput
          style={styles.input}
          placeholder="Anna retken nimi"
          value={hikeName}
          onChangeText={setHikeName}
        />

        <Text style={styles.label}>Lisätiedot</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Lisää kuvaus tai muistiinpanoja"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
        />

        {/* Näytetään retken reitti */}
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
          <Button title="Päivitä retki" onPress={handleUpdate} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7e6',
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  map: {
    height: 200,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
