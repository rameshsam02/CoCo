
import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      // Process files
    }
  };

  return (
    <>
      <div className="main-background" />
      <div className="content-wrapper min-h-screen px-6 py-12 flex items-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16 animate-slide-up">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                NerdAI
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg leading-7 text-gray-700 max-w-2xl mx-auto">
              Your intelligent data companion, transforming business insights through advanced AI analysis.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-12">
            <div
              className={cn(
                "voice-circle animate-slide-up delay-1",
                isRecording && "recording"
              )}
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onMouseLeave={handleStopRecording}
            >
              <div className="wave-ring" />
              <div className="wave-ring" />
              <div className="wave-ring" />
              <div className="wave-ring" />
              <div className={cn("voice-dot", isRecording && "recording")}>
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
                <div className="wave-bar" />
              </div>
            </div>

            <div className="w-full max-w-xl animate-slide-up delay-2">
              <div className="query-box">
                <Textarea
                  placeholder="Add any additional context or upload documents for enhanced analysis. Feel free to include extra details that might help with your query..."
                  className="min-h-[80px] resize-none bg-transparent border-0 focus:ring-0 px-3 py-2 placeholder:text-gray-500"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="upload-button"
                  onClick={() => document.getElementById("file-input")?.click()}
                  title="Upload additional documents for analysis"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                </Button>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
