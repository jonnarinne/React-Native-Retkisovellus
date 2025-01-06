import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/forest.jpg');

export default function EditHike({ route, navigation }) {
  const { hike } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    Alert.alert('Virhe', 'Käyttäjää ei löydy. Kirjaudu uudelleen sisään.');
    navigation.navigate('Home');
    return null;
  }

  const userId = user.uid;
  const [hikeName, setHikeName] = useState(hike.name || '');
  const [additionalInfo, setAdditionalInfo] = useState(hike.additionalInfo || '');

  const handleUpdate = async () => {
    if (!hikeName.trim()) {
      Alert.alert('Virhe', 'Retken nimi ei voi olla tyhjä.');
      return;
    }

    try {
      const db = getDatabase();
      const hikeRef = ref(db, `hikes/${userId}/${hike.id}`);

      await update(hikeRef, {
        name: hikeName,
        additionalInfo,
      });

      Alert.alert('Päivitys onnistui', 'Retken tiedot on päivitetty.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HikeList'),
        },
      ]);
    } catch (error) {
      console.error('Virhe päivitettäessä retkeä:', error);
      Alert.alert('Virhe', 'Tietojen päivitys epäonnistui.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlayContainer}>
        <View style={styles.box}>
          <Text style={styles.title}>Muokkaa retken tietoja</Text>

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
            <Button title="Päivitä retki" onPress={handleUpdate} color="#2e8b57" />
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
    backgroundColor: 'rgba(245, 245, 220, 0.9)', // Beige tausta, hieman läpinäkyvä
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
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#2e8b57',
  },
  input: {
    height: 40,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  map: {
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 15,
  },
});
