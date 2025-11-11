"use client";

import { useRef } from "react";
import { useVoice, VoiceProvider } from "./voice-provider";
import { Button } from "~/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

/**
 * Test component for uploading local audio files
 * This is useful during development to test audio transcription without recording
 *
 * Usage: Add this component anywhere in your app during development
 * <VoiceFileUploadTest />
 */
export function VoiceFileUploadTest() {
  const { uploadAudioFile } = useVoice();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check if it's an audio file
      if (!file.type.startsWith("audio/")) {
        alert("Please select an audio file");
        return;
      }

      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });

      console.log(uploadAudioFile);
      await uploadAudioFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🎵 Voice Test Upload</CardTitle>
        <CardDescription>
          Upload a local audio file for testing (DEV ONLY)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button onClick={handleButtonClick} className="w-full">
          Choose Audio File
        </Button>
        <p className="text-muted-foreground mt-4 text-sm">
          Supported formats: MP3, WAV, M4A, WebM, OGG, etc.
        </p>
      </CardContent>
    </Card>
  );
}
