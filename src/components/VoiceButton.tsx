
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceButtonProps {
  isRecording: boolean;
  onToggle: () => void;
}

export const VoiceButton = ({ isRecording, onToggle }: VoiceButtonProps) => {
  return (
    <div className="relative z-10">
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "relative w-32 h-32 cursor-pointer transition-all duration-700",
              "hover:scale-105 hover:rotate-3",
              isRecording && "scale-110"
            )}
            onClick={onToggle}
          >
            {/* Base glow effect */}
            <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-gradient-slow" />
            
            {/* Animated background layers */}
            <div className="absolute inset-0 rounded-full animate-spin-slow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/20 via-blue-400/20 to-cyan-400/20 blur-md" />
            </div>
            <div className="absolute inset-0 rounded-full animate-reverse-spin">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-400/20 via-rose-400/20 to-amber-400/20 blur-md" />
            </div>
            
            {/* Main orb */}
            <div className="absolute inset-0 rounded-full backdrop-blur-sm bg-gradient-to-br from-blue-400/80 via-violet-400/80 to-purple-400/80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse-subtle" />
            </div>
            
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/90 via-blue-300/60 to-violet-300/60 blur-sm animate-pulse-slow" />
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isRecording ? (
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-white rounded-full animate-wave"
                      style={{
                        height: `${20 + Math.random() * 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Mic className="w-8 h-8 text-white/90 transform transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>

            {/* Reflection effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-50 animate-pulse-subtle" />

            {/* Ambient animation rings */}
            {isRecording && (
              <>
                <div className="absolute -inset-2 rounded-full animate-ping-slow border-2 border-white/20" />
                <div className="absolute -inset-4 rounded-full animate-ping-slower border border-white/10" />
                <div className="absolute -inset-6 rounded-full animate-ping-slowest border border-white/5" />
              </>
            )}

            {/* Floating particles effect when recording */}
            {isRecording && (
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/40 animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isRecording ? "Click to stop recording" : "Click to start recording"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
