
import { useState } from "react";
import { Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
    // Voice recording logic will be implemented here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop recording logic will be implemented here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="max-w-4xl mx-auto pt-20 pb-16">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            NerdAI
          </h1>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Your intelligent data companion, transforming business insights through advanced AI analysis. Seamlessly process voice, text, and documents for comprehensive data consultation.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center space-y-8">
          <div
            className={cn("voice-circle", isRecording && "recording")}
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            onMouseLeave={handleStopRecording}
          >
            <div className={cn("voice-dot", isRecording && "recording")}>
              <Mic className={cn(
                "w-12 h-12 transition-colors duration-300",
                isRecording ? "text-red-500" : "text-primary"
              )} />
            </div>
          </div>

          <div className="w-full max-w-2xl space-y-4">
            <Textarea
              placeholder="Type your query here..."
              className="min-h-[100px] resize-none bg-white/80 backdrop-blur-sm"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />

            <div
              className={cn("file-drop-zone", isDragging && "drag-active")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">
                  Drag and drop files here, or{" "}
                  <Button
                    variant="link"
                    className="px-0 text-primary hover:text-primary/80"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    browse
                  </Button>
                </p>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
