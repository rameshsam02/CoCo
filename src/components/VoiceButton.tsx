
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isRecording: boolean;
  onToggle: () => void;
}

export const VoiceButton = ({ isRecording, onToggle }: VoiceButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
        "bg-blue-500 hover:bg-blue-600 active:scale-95",
        "shadow-lg hover:shadow-xl",
        isRecording && "bg-red-500 hover:bg-red-600"
      )}
    >
      <Mic className="h-8 w-8 text-white" />
    </button>
  );
};
