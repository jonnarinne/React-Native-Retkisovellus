import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import AddHike from './screens/AddHike';
import HikeList from './screens/HikeList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Retkisovellus' }} />
        <Stack.Screen name="AddHike" component={AddHike} options={{ title: 'Lisää uusi retki' }} />
        <Stack.Screen name="HikeList" component={HikeList} options={{ title: 'Tehdyt retket' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
