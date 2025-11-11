import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { FloatingDockNavigation } from "./dock";
import { VoiceRecorder } from "./voice-recorder";
import { api } from "~/trpc/react";
import type { z } from "zod/v4";
import type { contractorActionsSchema } from "~/lib/voice-actions";
import { useVoiceStore } from "~/store/voice-store";

type IntentResult = z.infer<typeof contractorActionsSchema>;
type IntentSubscriber = (
  intent: IntentResult,
  transcription: string,
) => void | Promise<void>;

interface VoiceContextType {
  startRecording: () => void;
  stopRecording: () => Promise<void>;
  recording: boolean;
  audioURL: string;
  uploadAudioFile: (file: File) => Promise<void>;
  processRecording: () => Promise<void>;
  subscribeToIntent: (callback: IntentSubscriber) => () => void;
}

const VoiceContext = createContext<VoiceContextType>({
  startRecording: () => {},
  stopRecording: async () => {},
  recording: false,
  audioURL: "",
  uploadAudioFile: async () => {},
  processRecording: async () => {},
  subscribeToIntent: () => () => {},
});

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within VoiceProvider");
  }
  return context;
};

/**
 * Hook to subscribe to intent determination results.
 * Automatically unsubscribes when the component unmounts.
 *
 * @param callback - Function to be called when intent is determined
 * @param deps - Optional dependency array (like useCallback/useEffect)
 *
 * @example
 * ```tsx
 * useVoiceIntentSubscription(async (intent, transcription) => {
 *   if (intent === "create-proposal") {
 *     console.log("Creating proposal with:", transcription);
 *     // Do your work here
 *   }
 * }, []);
 * ```
 */
export const useVoiceIntentSubscription = (
  callback: IntentSubscriber,
  deps: React.DependencyList = [],
) => {
  const { subscribeToIntent } = useVoice();

  useEffect(() => {
    const unsubscribe = subscribeToIntent(callback);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeToIntent, ...deps]);
};

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voiceActions] = useState(["contractor"]);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const subscribersRef = useRef<Set<IntentSubscriber>>(new Set());

  const { setIntent, setTranscription } = useVoiceStore();

  const determineIntentMutation = api.voice.determineIntent.useMutation({
    onSuccess: async (data) => {
      console.log("Transcription result:", data);

      if (!data.intent) {
        return;
      }

      setIntent(data.intent);
      setTranscription(data.text);
    },
    onError: (error) => {
      console.error("Error transcribing audio:", error);
    },
  });

  const startRecording = async () => {
    console.log("Start Recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        const mediaRecorder = mediaRecorderRef.current;

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

  // Subscribe to intent determination
  const subscribeToIntent = useCallback((callback: IntentSubscriber) => {
    subscribersRef.current.add(callback);

    // Return unsubscribe function
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        startRecording,
        stopRecording,
        recording,
        audioURL,
        uploadAudioFile,
        processRecording,
        subscribeToIntent,
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
