# EchoCal - Voice-Powered Calendar App

**EchoCal** is a voice-driven calendar management app that lets you create events by simply speaking. This React Native app integrates Azure's Language APIs to provide real-time transcription and smart suggestions for creating calendar events.

## Features

- **Speech-to-Text:** Convert voice input to text on device.
- **Smart Event Suggestions:** Get real-time suggestions for calendar events based on the transcribed text.
- **Seamless Integration:** Automatically add events to your Google Calendar.
- **Minimalistic UI:** Clean and simple UI with smooth animations.
- **Multi-Platform Support:** Works across both iOS and Android devices.

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/echocal.git
   cd echocal
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

## Usage

- Press the microphone button on the home screen to start speaking.
- The app will transcribe your voice into text and suggest an event.
- You can accept the suggestion or modify it before adding it to your calendar.
- Adjust default settings such as calendar API and language model in the settings.

## Technologies Used

- **React Native:** For cross-platform mobile app development.
- **Azure Language Model API:** To provide smart event suggestions.
- **Google Calendar API:** To add events seamlessly to the calendar.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
