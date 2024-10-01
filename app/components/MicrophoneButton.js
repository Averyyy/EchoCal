import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const AnimatedButton = Animatable.createAnimatableComponent(TouchableOpacity);

const MicrophoneButton = ({isRecording, onPressIn, onPressOut, text}) => {
  return (
    <AnimatedButton
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      animation={isRecording ? 'pulse' : undefined}
      iterationCount="infinite"
      style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </AnimatedButton>
  );
};

export default MicrophoneButton;

const styles = StyleSheet.create({
  button: {
    // Styles for the button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  text: {
    fontSize: 18,
  },
});
