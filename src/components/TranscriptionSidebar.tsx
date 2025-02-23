
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  source: string;
  timestamp: number;
}

interface TranscriptionSidebarProps {
  isRecording: boolean;
  messages: Message[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TranscriptionSidebar = ({ isRecording, messages, onFileUpload }: TranscriptionSidebarProps) => {
  return (
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
          onChange={onFileUpload}
        />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
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
  );
};
