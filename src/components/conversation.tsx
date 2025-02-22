
'use client';

import { useConversation } from '@11labs/react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

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
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-blue-50 to-blue-100 shadow-lg transform transition-all duration-300 ease-in-out",
        isRecording ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="sticky top-0 bg-blue-500/10 backdrop-blur-sm p-4 border-b border-blue-200 z-10">
        <h2 className="text-blue-900 font-semibold">Conversation</h2>
      </div>

      {/* Messages Container */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <p className="text-blue-800/60 text-center">No messages yet. Start speaking to interact.</p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.source === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.source === 'user'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/80 text-blue-900 shadow-sm border border-blue-100'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
