// ./app/screens/MainScreen.js

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import Toast from 'react-native-toast-message';

import {startRecording, stopRecording} from '../services/audioTranscription';
import {getEventSuggestion} from '../services/azureOpenAI';
import {addEventToLocalCalendar} from '../services/localCalendar';
import I18n from '../i18n';

const AnimatedButton = Animatable.createAnimatableComponent(TouchableOpacity);

const MainScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [eventSuggestion, setEventSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const scrollViewRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    Voice.onSpeechResults = e => {
      const text = e.value[0];
      setInputText(text);
    };
    Voice.onSpeechError = e => console.error('Error:', e.error);
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handlePressIn = async () => {
    setIsRecording(true);
    await startRecording();
  };

  const handlePressOut = async () => {
    setLoading(true);
    setIsRecording(false);
    await stopRecording();
    handleSendMessage();
    setLoading(false);
  };

  const processTranscript = async text => {
    if (!text.trim()) {
      Toast.show({
        type: 'info',
        text1: I18n.t('empty_transcription'),
        position: 'bottom',
      });
      return;
    }

    setLoading(true);
    try {
      const assistantResponse = await getEventSuggestion(text);
      console.log(assistantResponse);
      const eventDetails = JSON.parse(assistantResponse);
      setEventSuggestion(eventDetails);
      console.log(eventDetails);
      if (eventDetails.is_valid) {
        setMessages(prevMessages => [
          ...prevMessages,
          {type: 'user', content: text},
          {type: 'assistant', content: eventDetails, accepted: false},
        ]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: I18n.t('error'),
        text2: error.message,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      Toast.show({
        type: 'info',
        text1: I18n.t('empty_message'),
        position: 'bottom',
      });
      return;
    }

    await processTranscript(inputText);
    setInputText('');
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await addEventToLocalCalendar(eventSuggestion);
      Toast.show({
        type: 'success',
        text1: I18n.t('event_added'),
        position: 'bottom',
      });
      setEventSuggestion(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: I18n.t('error'),
        text2: error.message,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  const renderEventDetails = eventDetails => (
    <View style={styles.eventDetails}>
      <Text style={styles.eventTitle}>{eventDetails.title}</Text>
      <Text
        style={
          styles.eventDateTime
        }>{`${eventDetails.date} at ${eventDetails.time}`}</Text>
      {eventDetails.notes && (
        <Text style={styles.eventNotes}>{eventDetails.notes}</Text>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsKeyboardVisible(false); // This will set the keyboard visibility to false when the background is tapped
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
          <Icon name="settings" size={30} color="#007AFF" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({animated: true})
          }>
          {messages.map((message, index) => (
            <View
              key={index}
              style={
                message.type === 'user'
                  ? styles.userMessage
                  : styles.assistantMessage
              }>
              {message.type === 'user' ? (
                <Text>{message.content}</Text>
              ) : (
                <>
                  <Text style={styles.suggestionText}>
                    {I18n.t('suggestionByAi')}
                  </Text>
                  {renderEventDetails(message.content)}
                  <TouchableOpacity
                    onPress={handleAccept}
                    style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>
                      {I18n.t('accept')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </ScrollView>

        <AnimatedButton
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          animation={isRecording ? 'pulse' : undefined}
          iterationCount="infinite"
          disabled={loading}
          style={[
            styles.microphoneButton,
            isKeyboardVisible && styles.smallerButton,
            isRecording && styles.recordingButton,
          ]}>
          <Icon
            name={isRecording ? 'mic-circle-outline' : 'mic-circle'}
            size={isKeyboardVisible ? 80 : 100}
            color="#FFFFFF"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          />
          <Text style={styles.microphoneText}>
            {isRecording ? I18n.t('recording') : I18n.t('press_and_hold')}
          </Text>
        </AnimatedButton>
        <View
          style={[
            styles.inputContainer,
            isKeyboardVisible && styles.inputContainerKeyboardVisible,
          ]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={I18n.t('type_message')}
            onFocus={() => setIsKeyboardVisible(true)}
            onBlur={() => setIsKeyboardVisible(false)}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}>
            <Text style={styles.sendButtonText}>{'→'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  settingsText: {
    fontSize: 16,
    color: '#007AFF',
  },
  messagesContainer: {
    paddingTop: 20,
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  inputContainerKeyboardVisible: {
    paddingBottom: 80,
  },
  microphoneButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 100,
    margin: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Added to space out the icon and text
  },
  smallerButton: {
    padding: 5,
  },
  microphoneText: {
    color: '#FFFFFF',
    fontSize: 30,
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  acceptButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default MainScreen;
