
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/components/conversation";
import { Title } from "@/components/Title";
import { VoiceButton } from "@/components/VoiceButton";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ text: string; source: string; timestamp: number }[]>([]);

  const handleToggleRecording = () => {
    console.log('Recording toggled:', !isRecording);
    setIsRecording((prev) => !prev);
  };

  const handleDisconnect = () => {
    console.log('Conversation disconnected, clearing messages');
    setMessages([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      // Process files
      console.log('Files selected:', files);
    }
  };

  const handleNewMessage = (message: { text: string; source: string }) => {
    if (!message.text?.trim()) {
      console.log('Message text is empty or only whitespace, skipping');
      return;
    }

    setMessages(prev => [...prev, { ...message, timestamp: Date.now() }]);
  };

  return (
    <>
      <div className="main-background">
        <div className="gradient-overlay" />
      </div>
      <div className="relative min-h-screen w-full">
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
              <div className="flex flex-col items-center">
                <div className="relative w-[360px] h-[360px] flex items-center justify-center">
                  <VoiceButton 
                    isRecording={isRecording}
                    onToggle={handleToggleRecording}
                  />
                </div>
                
                {/* Upload Button */}
                <div className={cn(
                  "transition-all duration-500 mt-[72px] ml-[160px]",
                  isRecording ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="upload-button hover:bg-blue-400/20 transition-colors"
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
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Live Transcription</h3>
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
    </>
  );
};

export default Index;
