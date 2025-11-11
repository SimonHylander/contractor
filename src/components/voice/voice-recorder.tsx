"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";

export function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    console.log("Start Recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
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
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  /* return (
    <div className="">
      <h2>🎙️ Voice Recorder</h2>

      <Button variant="outline" className="cursor-pointer">
        Start Recording
      </Button>

      {!recording ? (
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={startRecording}
        >
          Start Recording
        </Button>
      ) : (
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={stopRecording}
        >
          Stop Recording
        </Button>
      )}

      {audioURL && (
        <div>
          <p>Playback:</p>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  ); */

  return null;
}
