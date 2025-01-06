import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, View, ImageBackground } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const backgroundImage = require('../assets/forest.jpg');

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Rekisteröinti onnistui!');
      
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Sähköposti on jo käytössä. Kirjaudu sisään tai käytä toista sähköpostia.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.header}>Rekisteröidy</Text>
          <TextInput
            placeholder="Sähköposti"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Salasana"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <Button title="Rekisteröidy" onPress={handleRegister} />
          <Text style={styles.switchText}>
            Onko sinulla jo tunnus?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
              Kirjaudu tästä
            </Text>
          </Text>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayContainer: {
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
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  switchText: {
    marginTop: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default Register;
