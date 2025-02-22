'use client';

import { useConversation } from '@11labs/react';
import { useEffect } from 'react';

interface ConversationProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onMessage: (message: { text: string; source: string }) => void;
}

export function Conversation({ isRecording, onStartRecording, onStopRecording, onMessage }: ConversationProps) {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => {
      console.log('Disconnected');
      onStopRecording();
    },
    onMessage: (message) => {
      // Detailed message structure logging
      console.log('Raw Message Structure:', {
        type: message.type,
        source: message.source,
        message: message.message,
        full_object: message
      });

      // Handle messages based on source property
      if (message.source === 'user') {
        console.log('Processing user message:', message.message);
        onMessage({
          text: message.message || "",
          source: 'user'
        });
      } else if (message.source === 'ai' || message.source === 'assistant') {
        console.log('Processing agent message:', message.message);
        onMessage({
          text: message.message || "",
          source: 'agent'
        });
      } else {
        console.log('Unknown message source:', message);
      }
    },
    onError: (error) => console.error('Error:', error),
  });

  useEffect(() => {
    const handleConversation = async () => {
      if (isRecording && conversation.status !== 'connected') {
        try {
          console.log('Starting new conversation session...');
          await navigator.mediaDevices.getUserMedia({ audio: true });
          await conversation.startSession({
            agentId: '33IwwA9g8LvxCOptQu73',
          });
          console.log('Conversation session started successfully');
        } catch (error) {
          console.error('Failed to start conversation:', error);
          onStopRecording(); // Stop recording if we fail to start
        }
      } else if (!isRecording && conversation.status === 'connected') {
        console.log('Ending conversation session...');
        await conversation.endSession();
      }
    };

    handleConversation();
  }, [isRecording]); // Only depend on isRecording, not conversation

  return null;
}
