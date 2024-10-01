import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Voice from '@react-native-voice/voice';

const requestMicrophonePermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  try {
    const result = await check(permission);
    if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
      const requestResult = await request(permission);
      if (requestResult !== RESULTS.GRANTED) {
        throw new Error('Microphone permission denied');
      }
    }
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    throw error;
  }
};

export const startRecording = async () => {
  try {
    await requestMicrophonePermission();
    await Voice.start('en-US');
    console.log('Recording started');
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

export const stopRecording = async () => {
  try {
    await Voice.stop();
    console.log('Recording stopped');
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
};

export const destroyRecognizer = async () => {
  try {
    await Voice.destroy();
  } catch (error) {
    console.error('Error destroying recognizer:', error);
  }
};
