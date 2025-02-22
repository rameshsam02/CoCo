
import { cn } from "@/lib/utils";

interface TitleProps {
  isRecording: boolean;
}

export const Title = ({ isRecording }: TitleProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className={cn(
        "text-5xl font-bold tracking-tight",
        isRecording ? "text-blue-600" : "text-gray-900"
      )}>
        NerdAI
      </h1>
      <p className="text-lg leading-7 text-gray-700 max-w-2xl mx-auto">
        Your intelligent data companion, transforming business insights through advanced AI analysis.
      </p>
    </div>
  );
};
