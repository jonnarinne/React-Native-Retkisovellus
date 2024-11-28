import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';  // Firebase Realtime Database

export default function EditHike({ route, navigation }) {
  const { hike } = route.params;  // Haetaan alkuperäinen retki

  const [hikeName, setHikeName] = useState(hike.name);
  const [date, setDate] = useState(hike.date);
  const [additionalInfo, setAdditionalInfo] = useState(hike.additionalInfo);

  const updateHikeDetails = async () => {
    if (!hikeName || !date) {
      Alert.alert('Täytä kaikki kentät', 'Retken nimi ja päivämäärä ovat pakollisia.');
      return;
    }

    const updatedData = {
      name: hikeName,
      date,
      additionalInfo,
    };

    try {
      const db = getDatabase();
      const hikeRef = ref(db, 'hikes/' + hike.userId + '/' + hike.id);  // Viittaa oikeaan retkeen
      await update(hikeRef, updatedData);  // Päivitetään tiedot Firebaseen

      Alert.alert('Päivitys onnistui', 'Retken tiedot on päivitetty.');
      navigation.goBack();  // Palaa takaisin listaan
    } catch (error) {
      console.error('Virhe päivityksessä: ', error);
      Alert.alert('Virhe', 'Retken tietojen päivittäminen epäonnistui.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Retken nimi"
        value={hikeName}
        onChangeText={setHikeName}
      />
      <TextInput
        placeholder="Päivämäärä"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Lisätiedot"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
      />
      <Button title="Päivitä retki" onPress={updateHikeDetails} />
    </View>
  );
}
