
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
      <div className={cn(
        "content-wrapper min-h-screen flex flex-col transition-all duration-500",
        isRecording && "-translate-x-48"
      )}>
        {/* Title Section */}
        <div className="flex-grow-0 pt-12 pb-8">
          <Title isRecording={isRecording} />
        </div>

        {/* Main Content Area */}
        <div className={cn(
          "flex-grow flex flex-col items-center justify-start gap-6 transition-all duration-700",
          isRecording ? "mt-0" : "mt-48"
        )}>
          {/* Voice Button Container */}
          <div className="relative w-[800px] h-[360px] flex items-center justify-center">
            <VoiceButton 
              isRecording={isRecording}
              onToggle={handleToggleRecording}
            />
          </div>

          {/* Upload Button */}
          <div className="mb-8">
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
