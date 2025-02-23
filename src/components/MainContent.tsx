
import { cn } from "@/lib/utils";
import { Title } from "@/components/Title";
import { VoiceButton } from "@/components/VoiceButton";

interface MainContentProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const MainContent = ({ isRecording, onToggleRecording }: MainContentProps) => {
  return (
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
        <div className="flex flex-col items-center w-full space-y-8">
          <div className="relative w-[360px] h-[360px] flex items-center justify-center">
            <VoiceButton 
              isRecording={isRecording}
              onToggle={onToggleRecording}
            />
          </div>
          <p className={cn(
            "text-lg text-gray-700 transition-all duration-500",
            isRecording ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            Just speak your topic, and CoCo will take care of the rest!
          </p>
        </div>
      </div>
    </div>
  );
};
