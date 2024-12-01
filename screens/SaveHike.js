import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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
    <View style={styles.container}>
      <TextInput
        placeholder="Retken nimi"
        value={hikeName}
        onChangeText={setHikeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Päivämäärä (DD.MM.YYYY)"
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
  input: {
    height: 40,
    borderColor: '#2e8b57',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});
