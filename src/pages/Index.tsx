import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Conversation } from "@/components/conversation";
import { Title } from "@/components/Title";
import { VoiceButton } from "@/components/VoiceButton";
import { Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ text: string; source: string; timestamp: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('📱 Index component messages updated:', messages.length);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggleRecording = () => {
    console.log('🎙️ Toggle recording:', {
      current: isRecording
    });
    setIsRecording(!isRecording);
  };

  const handleDisconnect = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Conversation disconnected');
    console.log('Current messages:', messages);
    const aiMessages = messages.filter(msg => msg.source === 'agent').slice(-5).map(msg => msg.text).join('\n');
    console.log('Filtered AI messages:', aiMessages);
    if (aiMessages) {
      setIsProcessing(true);
      console.log('Making API call with prompt:', aiMessages);
      try {
        console.log('Starting API request...');
        const response = await fetch('https://56e5-2601-19b-780-2d10-b4fd-3895-61e-4d11.ngrok-free.app/research/presentation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: aiMessages
          })
        });
        console.log('API response status:', response.status);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        console.log('Research response data:', data);
        navigate('/presentation', {
          state: {
            presentationData: data
          }
        });
        setIsRecording(false);
        toast({
          title: "Research Complete",
          description: "Your presentation is ready."
        });
      } catch (error) {
        console.error('Error processing research:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process the conversation."
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
    console.log('📝 New message:', {
      source: message.source,
      preview: message.text.substring(0, 50)
    });
    setMessages(prev => {
      const newMessages = [...prev, {
        ...message,
        timestamp: Date.now()
      }];
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
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center space-y-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-blue-500/30 blur-xl animate-pulse" />
                <Loader className="h-12 w-12 text-blue-500 relative animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Processing your conversation...</h2>
                <p className="text-gray-600">
                  We're analyzing your conversation and preparing your presentation. This may take a moment.
                </p>
              </div>
              <div className="w-full max-w-[200px] h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-progress" />
              </div>
            </div>
          </div>
        )}

        <div className={cn("transition-all duration-500 flex justify-center", isRecording ? "mr-[400px]" : "")}>
          <div className="w-full max-w-[1000px] relative flex flex-col items-center">
            <div className={cn("w-full pt-12 pb-8 transition-all duration-500", isRecording ? "flex justify-center" : "")}>
              <Title isRecording={isRecording} />
            </div>

            <div className={cn("flex flex-col items-center justify-center min-h-[400px] transition-all duration-700 w-full", isRecording ? "-mt-12" : "mt-48")}>
              <div className="flex flex-col items-center w-full space-y-2">
                <div className="relative w-[360px] h-[360px] flex items-center justify-center">
                  <VoiceButton isRecording={isRecording} onToggle={handleToggleRecording} />
                </div>
                <p className={cn("text-base font-normal text-center -mt-8", isRecording ? "" : "")}>
                  Just speak your thoughts, and CoCo will take care of the rest!
                </p>
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

        <div className={cn("fixed right-0 top-0 h-full w-[400px] bg-white/90 backdrop-blur-md shadow-xl transition-all duration-500 transform", isRecording ? "translate-x-0" : "translate-x-full")}>
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Transcription</h3>
            
            <Button variant="ghost" size="lg" className="w-full mb-4 bg-blue-400/10 hover:bg-blue-400/20 transition-colors" onClick={() => document.getElementById("file-input")?.click()}>
              <Upload className="mr-2 h-5 w-5" />
              Upload Documents
            </Button>
            <input id="file-input" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.rtf,.odt" onChange={handleFileUpload} />
            
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {messages.map(msg => (
                  <div 
                    key={msg.timestamp} 
                    className={cn(
                      "p-3 rounded-lg text-sm", 
                      msg.source === "agent" ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-800"
                    )}
                  >
                    <span className="font-semibold">
                      {msg.source === "agent" ? "AI: " : "You: "}
                    </span>
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
