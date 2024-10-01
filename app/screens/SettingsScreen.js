import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from '../i18n';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const [selectedModel, setSelectedModel] = useState('local');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigation = useNavigation();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedModel = await AsyncStorage.getItem('selectedModel');
      const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (storedModel) setSelectedModel(storedModel);
      if (storedLanguage) setSelectedLanguage(storedLanguage);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('selectedModel', selectedModel);
      await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleModelChange = itemValue => {
    setSelectedModel(itemValue);
  };

  const handleLanguageChange = itemValue => {
    setSelectedLanguage(itemValue);
    I18n.locale = itemValue;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.goBackButtonText}>{I18n.t('go_back')}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{I18n.t('select_model')}</Text>
      <Picker
        selectedValue={selectedModel}
        onValueChange={handleModelChange}
        style={styles.picker}>
        <Picker.Item label={I18n.t('local_model')} value="local" />
        <Picker.Item label="GPT" value="gpt" />
        <Picker.Item label="Claude" value="claude" />
      </Picker>

      <Text style={styles.label}>{I18n.t('select_language')}</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={handleLanguageChange}
        style={styles.picker}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Español" value="es" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="Deutsch" value="de" />
        <Picker.Item label="中文" value="zh" />
      </Picker>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>{I18n.t('save_settings')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  goBackButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  goBackButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
