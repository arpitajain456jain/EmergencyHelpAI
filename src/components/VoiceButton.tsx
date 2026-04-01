import { Mic, MicOff } from "lucide-react";
import { useState, useCallback, useRef } from "react";

interface VoiceButtonProps {
  onResult: (text: string) => void;
}

const VoiceButton = ({ onResult }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, onResult]);

  return (
    <button
      onClick={toggleListening}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
        isListening
          ? "bg-emergency text-emergency-foreground voice-ripple"
          : "bg-secondary text-secondary-foreground hover:bg-emergency/10 hover:text-emergency"
      }`}
      title={isListening ? "Stop listening" : "Voice input"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
};

export default VoiceButton;
