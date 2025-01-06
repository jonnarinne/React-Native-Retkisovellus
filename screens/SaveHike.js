import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const backgroundImage = require('../assets/forest.jpg');

export default function SaveHike({ route, navigation }) {
  const { route: routeCoordinates } = route.params;
  const [hikeName, setHikeName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const saveHike = async () => {
    if (!hikeName || !date) {
      Alert.alert('Täytä kaikki kentät', 'Retken nimi ja päivämäärä ovat pakollisia.');
      return;
    }

    try {
      const db = getDatabase();
      const user = getAuth().currentUser;

      if (user) {
        const userId = user.uid;
        const hikesRef = ref(db, 'hikes/' + userId);
        const newHikeRef = push(hikesRef);

        await set(newHikeRef, {
          name: hikeName,
          date,
          additionalInfo,
          route: routeCoordinates,
          createdAt: new Date().toISOString(),
        });

        Alert.alert('Tallennus onnistui', 'Retki on tallennettu onnistuneesti.');
        navigation.navigate('Home');
      } else {
        Alert.alert('Ei kirjautunut', 'Et ole kirjautunut sisään.');
      }
    } catch (error) {
      Alert.alert('Virhe', 'Retken tallentaminen epäonnistui.');
      console.error('Error adding hike: ', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90} // Säätää korkeuden iOS:lle
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.overlayContainer}>
            <View style={styles.box}>
              <TextInput
                placeholder="Retken nimi"
                value={hikeName}
                onChangeText={setHikeName}
                style={styles.input}
              />
              <TextInput
                placeholder="Päivämäärä"
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
              <Button title="Tallenna retki" onPress={saveHike} color="#2e8b57" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
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
  input: {
    height: 40,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
