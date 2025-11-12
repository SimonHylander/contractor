import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { z } from "zod/v4";
import type { contractorActionsSchema } from "~/lib/voice-actions";
import { useVoiceStore } from "~/store/voice-store";
import { api } from "~/trpc/react";
import { FloatingDockNavigation } from "./dock";

type IntentResult = z.infer<typeof contractorActionsSchema>;

interface VoiceContextType {
  startRecording: () => void;
  stopRecording: () => Promise<void>;
  recording: boolean;
  audioURL: string;
  uploadAudioFile: (file: File) => Promise<void>;
  processRecording: () => Promise<void>;
}

const VoiceContext = createContext<VoiceContextType>({
  startRecording: () => {},
  stopRecording: async () => {},
  recording: false,
  audioURL: "",
  uploadAudioFile: async () => {},
  processRecording: async () => {},
});

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within VoiceProvider");
  }
  return context;
};

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voiceActions] = useState(["contractor"]);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const { setIntent, setTranscription } = useVoiceStore();

  const determineIntentMutation = api.voice.determineIntent.useMutation({
    onSuccess: async (data) => {
      console.log("Transcription result:", data);

      if (!data.intent) {
        return;
      }

      console.log("setintent");
      setIntent(data.intent);
      setTranscription(data.text);
    },
    onError: (error) => {
      console.error("Error transcribing audio:", error);
    },
  });

  // Cleanup: stop any active streams when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    console.log("Start Recording");
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up event handlers BEFORE starting
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        // Stop all tracks to release the microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      // Start with a timeslice to ensure data is collected periodically
      mediaRecorder.start(100); // Collect data every 100ms
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        const mediaRecorder = mediaRecorderRef.current;

        // Request any remaining data before stopping
        if (mediaRecorder.state === "recording") {
          mediaRecorder.requestData();
        }

        // Add a one-time listener for the stop event
        mediaRecorder.addEventListener(
          "stop",
          () => {
            resolve();
          },
          { once: true },
        );

        mediaRecorder.stop();
        setRecording(false);
      } else {
        resolve();
      }
    });
  };

  const onVoiceControl = async () => {
    console.log("Voice Control");

    if (recording) {
      await stopRecording();
      await processRecording();
    } else {
      await startRecording();
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        console.log("Reader onloadend");
        try {
          const base64Audio = reader.result?.toString().split(",")[1];

          if (base64Audio) {
            await determineIntentMutation.mutateAsync({
              audioBase64: base64Audio,
              mimeType: blob.type,
            });
            resolve();
          } else {
            reject(new Error("Failed to convert audio to base64"));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(blob);
    });
  };

  const uploadAudioFile = async (file: File) => {
    console.log("Uploading local file:", file.name);
    try {
      // Create a URL for the file (for playback if needed)
      const url = URL.createObjectURL(file);
      setAudioURL(url);

      // Process the file immediately
      await processAudioBlob(file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const processRecording = async () => {
    console.log("Process Recording");

    if (!audioURL) {
      console.error("No audio to process");
      return;
    }

    if (voiceActions.includes("contractor")) {
      console.log("Contractor");

      try {
        // Fetch the blob from the URL
        const response = await fetch(audioURL);
        const blob = await response.blob();

        // Process the blob
        await processAudioBlob(blob);
      } catch (error) {
        console.error("Error processing recording:", error);
      }
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        startRecording,
        stopRecording,
        recording,
        audioURL,
        uploadAudioFile,
        processRecording,
      }}
    >
      {children}

      <FloatingDockNavigation
        recording={recording}
        onVoiceControl={onVoiceControl}
      />
    </VoiceContext.Provider>
  );
}
