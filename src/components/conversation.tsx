'use client';

import { useConversation } from '@11labs/react';
import { useEffect } from 'react';

export interface ConversationProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onMessage?: (message: { text: string; source: string }) => void;
  onDisconnect?: () => void;
}

export function Conversation({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onMessage,
  onDisconnect 
}: ConversationProps) {
  const conversation = useConversation({
    onConnect: () => {},
    onDisconnect: () => {
      if (onDisconnect) onDisconnect();
    },
    onMessage: (message) => {
      if (message.source === 'user') {
        onMessage({
          text: message.message || "",
          source: 'user'
        });
      } else if (message.source === 'ai' || message.source === 'assistant') {
        onMessage({
          text: message.message || "",
          source: 'agent'
        });
      }
    },
    onError: (error) => console.error('Error:', error),
    clientTools: {
      displayMessage: (parameters: { text: string }) => {
        alert(parameters.text);
        return "Message displayed";
      },
    },
  });

  useEffect(() => {
    const handleConversation = async () => {
      if (!isRecording && conversation.status === 'connected') {
        try {
          await conversation.endSession();
        } catch (error) {
          console.error('Error ending session:', error);
        }
        return;
      }

      if (isRecording && !['connected', 'connecting'].includes(conversation.status)) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          await conversation.startSession({
            agentId: '33IwwA9g8LvxCOptQu73',
          });
        } catch (error) {
          console.error('Error starting session:', error);
          onStopRecording();
        }
      }
    };

    handleConversation();

    return () => {
      if (conversation.status === 'connected') {
        conversation.endSession().catch(error => {
          console.error('Error during cleanup:', error);
        });
      }
    };
  }, [isRecording]);

  return null;
}
