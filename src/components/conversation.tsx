
'use client';

import { useConversation } from '@11labs/react';
import { useEffect, useState } from 'react';

interface ConversationProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function Conversation({ isRecording }: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => {
      console.log('Message:', message);
      // Add the received message to our messages array
      setMessages(prev => [...prev, {
        text: message.text || "No message content",
        isUser: false,
        timestamp: new Date()
      }]);
    },
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
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      <div className="w-full bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">No messages yet. Start speaking to interact.</p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
