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
    onConnect: () => {
      console.log('🎤 Conversation connected');
    },
    onDisconnect: () => {
      console.log('🎤 Conversation disconnected');
      // Ensure we're fully disconnected before calling the handler
      setTimeout(() => {
        if (onDisconnect) {
          console.log('🎤 Calling disconnect handler with conversation status:', conversation.status);
          onDisconnect();
        }
      }, 300);
    },
    onMessage: (message) => {
      console.log('🎤 Received message:', message);
      if (message.source === 'user') {
        onMessage?.({
          text: message.message || "",
          source: 'user'
        });
      } else if (message.source === 'ai' || message.source === 'assistant') {
        onMessage?.({
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
    console.log('🎤 Recording state effect:', { isRecording, status: conversation.status });
    
    const handleConversation = async () => {
      if (!isRecording && conversation.status === 'connected') {
        console.log('🎤 Ending session');
        try {
          await conversation.endSession();
          console.log('🎤 Session ended successfully');
        } catch (error) {
          console.error('Error ending session:', error);
        }
        return;
      }

      if (isRecording && !['connected', 'connecting'].includes(conversation.status)) {
        console.log('🎤 Starting session');
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          await conversation.startSession({
            agentId: '33IwwA9g8LvxCOptQu73',
          });
          console.log('🎤 Session started successfully');
        } catch (error) {
          console.error('Error starting session:', error);
          onStopRecording();
        }
      }
    };

    handleConversation();

    return () => {
      if (conversation.status === 'connected') {
        console.log('🎤 Cleanup: ending session');
        conversation.endSession().catch(error => {
          console.error('Error during cleanup:', error);
        });
      }
    };
  }, [isRecording, conversation.status]);

  return null;
}
