
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
  source: string;
}

export function Conversation({ isRecording }: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => {
      console.log('Message:', message);
      setMessages(prev => [...prev, {
        text: message.message || "No message content",
        source: message.source || "unknown"
      }]);
    },
    onError: (error) => console.error('Error:', error),
  });

  useEffect(() => {
    const handleConversation = async () => {
      if (isRecording && conversation.status !== 'connected') {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          await conversation.startSession({
            agentId: '33IwwA9g8LvxCOptQu73',
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
            className={`flex ${message.source === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.source === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
