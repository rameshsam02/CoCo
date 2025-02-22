import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/components/conversation";
import { Title } from "@/components/Title";
import { VoiceButton } from "@/components/VoiceButton";
import { Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
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
    console.log('🔌 Disconnect handler:', { 
      messageCount: messages.length,
      messages: messages.map(m => ({ source: m.source, preview: m.text.substring(0, 50) }))
    });

    // Get the last 5 AI messages
    const aiMessages = messages
      .filter(msg => msg.source === 'agent')
      .slice(-5)
      .map(msg => msg.text);

    console.log('🤖 AI messages to process:', aiMessages.length);

    if (aiMessages.length === 0) {
      console.log('⚠️ No AI messages to process');
      return;
    }

    const combinedMessages = aiMessages.join('\n');
    console.log('🚀 Processing messages');
    setIsProcessing(true);
    
    try {
      const response = await fetch('https://48f5-155-33-133-54.ngrok-free.app/research/presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: combinedMessages }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API call successful');
      console.log(data)
      
      toast({
        title: "Research Complete",
        description: "Your conversation has been processed successfully.",
      });

      // Clear messages after successful processing
      setMessages([]);
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the conversation.",
      });
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const handleNewMessage = (message: { text: string; source: string }) => {
    if (!message.text?.trim()) return;

    console.log('📝 New message:', { source: message.source, preview: message.text.substring(0, 50) });
    
    setMessages(prev => {
      const newMessages = [...prev, { ...message, timestamp: Date.now() }];
      console.log('📝 Messages updated:', newMessages.length);
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
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
              <Loader className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-lg font-medium">Processing your conversation...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          "transition-all duration-500 flex justify-center",
          isRecording ? "mr-[400px]" : ""
        )}>
          <div className="w-full max-w-[1000px] relative flex flex-col items-center">
            {/* Title Section */}
            <div className={cn(
              "w-full pt-12 pb-8 transition-all duration-500",
              isRecording ? "flex justify-center" : ""
            )}>
              <Title isRecording={isRecording} />
            </div>

            {/* Main Content Area */}
            <div className={cn(
              "flex flex-col items-center justify-center min-h-[400px] transition-all duration-700 w-full",
              isRecording ? "-mt-12" : "mt-48"
            )}>
              <div className="flex flex-col items-center w-full">
                <div className="relative w-[360px] h-[360px] flex items-center justify-center">
                  <VoiceButton 
                    isRecording={isRecording}
                    onToggle={handleToggleRecording}
                  />
                </div>
              </div>
            </div>

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
        </div>

        {/* Transcription Sidebar */}
        <div className={cn(
          "fixed right-0 top-0 h-full w-[400px] bg-white/90 backdrop-blur-md shadow-xl transition-all duration-500 transform",
          isRecording ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Transcription</h3>
            
            {/* Upload Button */}
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full mb-4 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Documents
            </Button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
              onChange={handleFileUpload}
            />
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={msg.timestamp}
                    className={cn(
                      "p-3 rounded-lg text-sm",
                      msg.source === "agent" 
                        ? "bg-blue-50 text-blue-800" 
                        : "bg-gray-50 text-gray-800"
                    )}
                  >
                    <span className="font-semibold">
                      {msg.source === "agent" ? "AI: " : "You: "}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
