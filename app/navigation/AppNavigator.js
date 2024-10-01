/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {SafeAreaView} from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </SafeAreaView>
);

export default AppNavigator;
