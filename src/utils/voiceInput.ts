// Web Speech Recognition wrapper with robust cross-browser typing
export function startVoiceRecognition(
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
): () => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowObj = window as any;
  const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser. Please use Chrome/Edge.');
    onEnd();
    return () => {};
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English / Hinglish

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      onError(event.error || 'Speech error');
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  } catch (err) {
    onError(String(err));
    onEnd();
    return () => {};
  }
}
