interface Window {
  SpeechRecognition: typeof SpeechRecognition | undefined;
  webkitSpeechRecognition: typeof SpeechRecognition | undefined;
}

// If you get an error about 'typeof SpeechRecognition' not being found, you can use:
// interface Window {
//   SpeechRecognition: any;
//   webkitSpeechRecognition: any;
// } 