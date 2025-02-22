// conversation.tsx
'use client';

import { useConversation } from '@11labs/react';
import { useEffect } from 'react';

interface ConversationProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function Conversation({ isRecording }: ConversationProps) {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  useEffect(() => {
    const handleConversation = async () => {
      if (isRecording && conversation.status !== 'connected') {
        try {
          // Request microphone permission
          await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Start the conversation with your agent
          await conversation.startSession({
            agentId: '33IwwA9g8LvxCOptQu73', // Replace with your agent ID
          });
        } catch (error) {
          console.error('Failed to start conversation:', error);
        }
      } else if (!isRecording && conversation.status === 'connected') {
        await conversation.endSession();
      }
    };

    handleConversation();
  }, [isRecording, conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div> */}
    </div>
  );
}