"use client";

import { VoiceFileUploadTest } from "~/components/voice/voice-file-upload-test";
import { VoiceProvider } from "~/components/voice/voice-provider";

/**
 * Test page for voice functionality
 * Navigate to /voice-test to access this page
 *
 * This page is for development/testing purposes only
 */
export default function VoiceTestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Voice Testing</h1>
        <p className="text-muted-foreground mt-2">
          Upload audio files to test ElevenLabs integration without recording
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceProvider>
          <VoiceFileUploadTest />
        </VoiceProvider>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <h2 className="mb-4 text-xl font-semibold">How to use:</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
          <li>
            Click "Choose Audio File" to select an audio file from your computer
          </li>
          <li>
            The file will be automatically uploaded and sent to ElevenLabs
          </li>
          <li>Check the browser console for transcription results</li>
          <li>Supported formats: MP3, WAV, M4A, WebM, OGG, and more</li>
        </ol>

        <div className="bg-muted mt-6 rounded-lg p-4">
          <h3 className="mb-2 font-semibold">💡 Pro Tips:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Open the browser console (F12) to see detailed logs</li>
            <li>• Test with different audio formats to verify compatibility</li>
            <li>• Keep files under 3GB for optimal performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
