import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env } from "~/env";

export async function voiceToText(audioBase64: string, mimeType: string) {
  const elevenlabs = new ElevenLabsClient({
    apiKey: env.ELEVENLABS_API_KEY,
  });

  const audioBuffer = Buffer.from(audioBase64, "base64");

  const audioFile = new File([audioBuffer], "recording.webm", {
    type: mimeType,
  });

  const transcription = await elevenlabs.speechToText.convert({
    file: audioFile,
    modelId: "scribe_v1",
    languageCode: "en",
  });

  // Handle different response types
  let text = "";
  if ("text" in transcription) {
    console.log("single channel response");
    // Single channel response
    text = transcription.text;
  } else if ("transcripts" in transcription) {
    console.log("multichannel response");
    // Multichannel response - combine all transcripts
    text = transcription.transcripts
      .map((transcript) => transcript.text)
      .join(" ");
  }

  return text;
}
