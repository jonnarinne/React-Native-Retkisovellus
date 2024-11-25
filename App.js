import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebaseConfig'; // Firebase-konfiguraatio
import Home from './screens/Home';
import AddHike from './screens/AddHike';
import SaveHike from './screens/SaveHike';
import HikeList from './screens/HikeList';
import Login from './screens/Login';
import Register from './screens/Register';
import HikeDetails from './screens/HikeDetails'; // Lisää HikeDetails
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Web SDK

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Käyttäjän tilan seuranta
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe; // Palautetaan unsubscribe, jotta kuuntelija voidaan poistaa komponentin poistuessa
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ title: 'Retkisovellus' }} />
            <Stack.Screen name="AddHike" component={AddHike} options={{ title: 'Lisää uusi retki' }} />
            <Stack.Screen name="SaveHike" component={SaveHike} options={{ title: 'Lisätiedot' }} />
            <Stack.Screen name="HikeList" component={HikeList} options={{ title: 'Tehdyt retket' }} />
            <Stack.Screen name="HikeDetails" component={HikeDetails} options={{ title: 'Retken tiedot' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Kirjaudu' }} />
            <Stack.Screen name="Register" component={Register} options={{ title: 'Rekisteröidy' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
