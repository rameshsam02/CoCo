
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

interface VoiceButtonProps {
  isRecording: boolean;
  onToggle: () => void;
}

export const VoiceButton = ({ isRecording, onToggle }: VoiceButtonProps) => {
  return (
    <div className={cn(
      "voice-circle",
      isRecording && "recording"
    )} onClick={onToggle}>
      {/* Primary Button Ring */}
      <div className="absolute inset-0 rounded-full animate-pulse-subtle opacity-50" />
      
      {/* Animated Ripple Rings */}
      <div className="animated-ring" />
      <div className="animated-ring" />
      <div className="animated-ring" />
      
      {/* Rotating Rings */}
      <div className="rotating-ring" />
      <div className="rotating-ring" />
      
      {/* Center Button */}
      <div className="voice-dot">
        <Mic className={cn(
          "w-8 h-8 text-white transition-opacity duration-300",
          isRecording ? "opacity-0" : "opacity-100"
        )} />
        
        {/* Audio Wave Animation */}
        <div className={cn(
          "wave-container",
          isRecording ? "opacity-100" : "opacity-0"
        )}>
          <div className="wave-bar" style={{ animationDelay: "0s" }} />
          <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
          <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
          <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
          <div className="wave-bar" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
      
      {/* Ping Animation */}
      <div className="absolute inset-0 rounded-full animate-ping-slow border border-white/10" />
      <div className="absolute inset-0 rounded-full animate-ping-slower border border-white/5" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping-slowest border border-white/5 w-full h-full" />
    </div>
  );
};
