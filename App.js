import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { Button } from 'react-native';
import Home from './screens/Home';
import AddHike from './screens/AddHike';
import SaveHike from './screens/SaveHike';
import HikeList from './screens/HikeList';
import EditHike from './screens/EditHike';
import Login from './screens/Login';
import Register from './screens/Register';
import HikeDetails from './screens/HikeDetails';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabs({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Uloskirjautumisessa tapahtui virhe:", error.message);
    }
  };

  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerRight: () => (
        <Button
          title="Kirjaudu ulos"
          color="#e91e63"
          onPress={handleLogout}
        />
      ),
    }}
  >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Etusivu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: 'Etusivu',
        }}
      />
      <Tab.Screen
        name="AddHike"
        component={AddHike}
        options={{
          tabBarLabel: 'Aloita retki',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trail-sign" size={size} color={color} />
          ),
          headerTitle: 'Aloita retki',
        }}
      />
      <Tab.Screen
        name="HikeList"
        component={HikeList}
        options={{
          tabBarLabel: 'Retkeni',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          headerTitle: 'Retkeni',
        }}
      />
    </Tab.Navigator>
  );
}



export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
            <Stack.Screen name="SaveHike" component={SaveHike} options={{ title: 'Lisätiedot' }} />
            <Stack.Screen name="HikeDetails" component={HikeDetails} options={{ title: 'Retken tiedot' }} />
            <Stack.Screen name="EditHike" component={EditHike} options={{ title: 'Muokkaa retken tietoja' }} />
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
