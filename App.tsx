import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/modules/Home/Home';
import Profile from './src/modules/Profile/Profile';

const App = () => {
  return (
    <NativeBaseProvider>
      <Profile />
    </NativeBaseProvider>
  )


};

export default App;

const styles = StyleSheet.create({});
