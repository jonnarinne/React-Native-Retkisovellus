import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddHikeScreen() {
  const [hikeName, setHikeName] = useState('');
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [route, setRoute] = useState([]);
  const [initialLocation, setInitialLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      // Kysy lupa joka kerta, kun komponentti latautuu
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sijainnin käyttö estetty', 'Lupa tarvitaan reitin tallentamiseen.');
        return;
      }

      // Haetaan käyttäjän nykyinen sijainti kartan keskittämistä varten
      const currentLocation = await Location.getCurrentPositionAsync({});
      setInitialLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Alustetaan sijainnin seuranta reitin tallennusta varten
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setRoute((currentRoute) => [...currentRoute, { latitude, longitude }]);
        }
      );
    };

    requestLocationPermission();
  }, []);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const saveHike = () => {
    if (!hikeName || !date) {
      Alert.alert('Täytä kaikki kentät', 'Retken nimi ja ajankohta ovat pakollisia');
      return;
    }

    const hikeData = {
      name: hikeName,
      date: formatDate(date),
      info: additionalInfo,
      route: route,
    };

    console.log('Tallennettu retki:', hikeData);
    Alert.alert('Retki tallennettu!', 'Retki ja reitti on tallennettu onnistuneesti.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Lisää uusi retki</Text>

          <TextInput
            placeholder="Retken nimi"
            value={hikeName}
            onChangeText={setHikeName}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <View pointerEvents="none">
              <TextInput
                placeholder="Ajankohta"
                value={date ? formatDate(date) : ''}
                editable={false}
                style={styles.input}
              />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(selectedDate) => {
              setDatePickerVisibility(false);
              setDate(selectedDate);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <TextInput
            placeholder="Lisätiedot"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            style={styles.input}
            multiline
          />

          {/* Karttanäkymä */}
          {initialLocation && (
            <MapView style={styles.map} region={initialLocation}>
              {route.length > 0 && (
                <>
                  <Polyline coordinates={route} strokeColor="#2e8b57" strokeWidth={3} />
                  <Marker coordinate={route[0]} title="Aloituspaikka" pinColor="green" />
                  <Marker coordinate={route[route.length - 1]} title="Nykyinen sijainti" />
                </>
              )}
            </MapView>
          )}

          <Button title="Tallenna retki" onPress={saveHike} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  map: {
    height: 300,
    borderRadius: 5,
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
