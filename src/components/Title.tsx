
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TitleProps {
  isRecording: boolean;
}

export const Title = ({ isRecording }: TitleProps) => {
  return (
    <div className={cn(
      "transition-all duration-500",
      isRecording ? "relative" : "absolute w-full top-[calc(50%-180px)]"
    )}>
      <div className="flex items-center justify-center gap-2">
        <h1 className={cn(
          "font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500",
          isRecording ? "text-4xl" : "text-6xl"
        )}>
          CoCo
        </h1>
        <Sparkles className={cn(
          "text-blue-500 animate-pulse transition-all duration-500",
          isRecording ? "w-6 h-6" : "w-10 h-10"
        )} />
      </div>
      <div className={cn(
        "flex items-center justify-center gap-2 transition-all duration-500 mt-4",
        isRecording ? "opacity-0 scale-95 h-0" : "opacity-100 scale-100"
      )}>
        <p className="text-lg text-gray-700 max-w-2xl">
          Your intelligent data companion, transforming business insights through advanced AI analysis.
        </p>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors" />
          </TooltipTrigger>
          <TooltipContent>
            Speak or upload files to get AI-powered insights
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
