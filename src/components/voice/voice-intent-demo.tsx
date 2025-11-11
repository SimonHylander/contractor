"use client";

import { useState } from "react";
import { useVoiceIntentSubscription } from "./voice-provider";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

/**
 * Demo component showing how to subscribe to voice intent determinations.
 * This can be used as a reference for implementing voice command handlers in other components.
 */
export function VoiceIntentDemo() {
  const [lastIntent, setLastIntent] = useState<string | null>(null);
  const [lastTranscription, setLastTranscription] = useState<string>("");
  const [intentCount, setIntentCount] = useState(0);
  const [history, setHistory] = useState<
    Array<{ intent: string | null; text: string; timestamp: Date }>
  >([]);

  // Subscribe to voice intent determinations
  useVoiceIntentSubscription(
    async (intent, transcription) => {
      console.log("[VoiceIntentDemo] Intent received:", intent, transcription);

      setLastIntent(intent);
      setLastTranscription(transcription);
      setIntentCount((prev) => prev + 1);

      // Add to history
      setHistory((prev) => [
        { intent, text: transcription, timestamp: new Date() },
        ...prev.slice(0, 4), // Keep only last 5 items
      ]);

      // You can perform actual work here based on the intent
      if (intent === "create-proposal") {
        console.log("Would open proposal creation form with:", transcription);
      } else if (intent === "generate-proposal-outline") {
        console.log("Would generate proposal outline from:", transcription);
      } else if (intent === null) {
        console.log("No matching intent for transcription:", transcription);
      }
    },
    [], // Empty deps - callback never changes
  );

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Voice Intent Monitor
          <Badge variant="secondary">{intentCount} received</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Intent */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Latest Intent:</h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                Intent:
              </span>
              {lastIntent ? (
                <Badge variant="default">{lastIntent}</Badge>
              ) : (
                <Badge variant="outline">No intent detected</Badge>
              )}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground text-xs font-medium">
                Transcription:
              </span>
              <p className="mt-1">
                {lastTranscription || "Waiting for voice input..."}
              </p>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Recent History:</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="rounded-lg border p-3 text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge
                      variant={item.intent ? "default" : "outline"}
                      className="text-xs"
                    >
                      {item.intent || "no match"}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-muted-foreground space-y-1 border-t pt-2 text-xs">
          <p>💡 This component is subscribed to voice intent determinations.</p>
          <p>Try recording or uploading audio to see it in action!</p>
          <p className="font-medium">Available intents:</p>
          <ul className="list-inside list-disc pl-2">
            <li>create-proposal</li>
            <li>generate-proposal-outline</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
