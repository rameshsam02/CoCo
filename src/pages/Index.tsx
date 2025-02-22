
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/components/conversation";
import { Title } from "@/components/Title";
import { ChatBubble } from "@/components/ChatBubble";
import { VoiceButton } from "@/components/VoiceButton";
import { UploadButton } from "@/components/UploadButton";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ text: string; source: string; timestamp: number }[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  const handleToggleRecording = () => {
    console.log('Recording toggled:', !isRecording);
    setIsRecording((prev) => !prev);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      // Process files
    }
  };

  const handleNewMessage = (message: { text: string; source: string }) => {
    if (!message.text?.trim()) {
      console.log('Message text is empty or only whitespace, skipping');
      return;
    }

    setMessages(prev => [...prev, { ...message, timestamp: Date.now() }]);
    setMessageCount(prev => prev + 1);
  };

  // Get the last message from each source and one older message
  const latestAgentMessage = messages
    .filter(m => m.source === 'agent')
    .slice(-1)[0];

  const latestUserMessage = messages
    .filter(m => m.source === 'user')
    .slice(-1)[0];

  const previousMessage = messages
    .slice(-3, -2)[0];

  // Determine positions based on message count
  const isAgentTopLeft = messageCount % 4 < 2;
  const isUserBottomRight = messageCount % 4 < 2;

  return (
    <>
      <div className="main-background">
        <div className="gradient-overlay" />
      </div>
      <div className="content-wrapper min-h-screen flex flex-col">
        {/* Title Section */}
        <div className="flex-grow-0 pt-16 pb-20">
          <Title isRecording={isRecording} />
        </div>

        {/* Main Content Area */}
        <div className={cn(
          "flex-grow flex flex-col items-center justify-start gap-8 transition-all duration-700",
          isRecording ? "mt-0" : "mt-56"
        )}>
          {/* Messages and Voice Button Container */}
          <div className="relative w-[600px] h-[280px] flex items-center justify-center">
            {/* Agent messages */}
            <div 
              className={cn(
                "absolute w-[300px] transition-all duration-500",
                isAgentTopLeft ? "top-0 left-0" : "bottom-0 left-0"
              )}
            >
              <div className="space-y-4 relative">
                {previousMessage?.source === 'agent' && (
                  <ChatBubble
                    text={previousMessage.text}
                    isAgent
                    isOld
                  />
                )}
                {latestAgentMessage && (
                  <ChatBubble
                    text={latestAgentMessage.text}
                    isAgent
                  />
                )}
              </div>
            </div>

            <VoiceButton 
              isRecording={isRecording}
              onToggle={handleToggleRecording}
            />

            {/* User messages */}
            <div 
              className={cn(
                "absolute w-[300px] transition-all duration-500",
                isUserBottomRight ? "bottom-0 right-0" : "top-0 right-0"
              )}
            >
              <div className="space-y-4 relative">
                {previousMessage?.source === 'user' && (
                  <ChatBubble
                    text={previousMessage.text}
                    isOld
                  />
                )}
                {latestUserMessage && (
                  <ChatBubble
                    text={latestUserMessage.text}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mb-8">
            <UploadButton onFileChange={handleFileUpload} />
          </div>
        </div>

        <div className="flex-grow-0">
          <Conversation 
            isRecording={isRecording}
            onStartRecording={handleToggleRecording}
            onStopRecording={handleToggleRecording}
            onMessage={handleNewMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
