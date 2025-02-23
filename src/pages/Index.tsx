import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Conversation } from "@/components/conversation";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TranscriptionSidebar } from "@/components/TranscriptionSidebar";
import { MainContent } from "@/components/MainContent";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ text: string; source: string; timestamp: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('📱 Index component messages updated:', messages.length);
  }, [messages]);

  const handleToggleRecording = () => {
    console.log('🎙️ Toggle recording:', { current: isRecording });
    setIsRecording(!isRecording);
  };

  const handleDisconnect = async () => {
    // Add a delay to ensure all message state updates are processed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Conversation disconnected');
    console.log('Current messages:', messages);
    
    // Get the last 5 AI messages
    const aiMessages = messages
      .filter(msg => msg.source === 'agent')
      .slice(-5)
      .map(msg => msg.text)
      .join('\n');

    console.log('Filtered AI messages:', aiMessages);

    if (aiMessages) {
      setIsProcessing(true);
      console.log('Making API call with prompt:', aiMessages);
      
      try {
        console.log('Starting API request...');
        const response = await fetch('https://56e5-2601-19b-780-2d10-b4fd-3895-61e-4d11.ngrok-free.app/research/presentation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: aiMessages }),
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log('Research response data:', data);
        
        // Navigate to presentation page with the data
        navigate('/presentation', { 
          state: { presentationData: data }
        });

        // Only stop recording, but keep the message history
        setIsRecording(false);
        
        toast({
          title: "Research Complete",
          description: "Your presentation is ready.",
        });
      } catch (error) {
        console.error('Error processing research:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process the conversation.",
        });
      } finally {
        console.log('API call completed, isProcessing set to false');
        setIsProcessing(false);
      }
    } else {
      console.log('No AI messages found');
      setIsRecording(false);
    }
  };

  const handleNewMessage = (message: { text: string; source: string }) => {
    if (!message.text?.trim()) return;

    console.log('📝 New message:', { source: message.source, preview: message.text.substring(0, 50) });
    
    setMessages(prev => {
      const newMessages = [...prev, { ...message, timestamp: Date.now() }];
      console.log('📝 Messages updated, new count:', newMessages.length, 'messages:', newMessages);
      return newMessages;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      console.log('Files selected:', files);
    }
  };

  return (
    <>
      <div className="main-background">
        <div className="gradient-overlay" />
      </div>
      <div className="relative min-h-screen w-full">
        <LoadingOverlay isProcessing={isProcessing} />

        {/* Main Content */}
        <div className={cn(
          "transition-all duration-500 flex justify-center",
          isRecording ? "mr-[400px]" : ""
        )}>
          <MainContent 
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
          />
          <div className="flex-grow-0 w-full">
            <Conversation 
              isRecording={isRecording}
              onStartRecording={handleToggleRecording}
              onStopRecording={handleToggleRecording}
              onMessage={handleNewMessage}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>

        <TranscriptionSidebar 
          isRecording={isRecording}
          messages={messages}
          onFileUpload={handleFileUpload}
        />
      </div>
    </>
  );
};

export default Index;
