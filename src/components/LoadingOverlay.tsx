
import { Loader } from "lucide-react";

interface LoadingOverlayProps {
  isProcessing: boolean;
}

export const LoadingOverlay = ({ isProcessing }: LoadingOverlayProps) => {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-lg font-medium">Processing your conversation...</p>
      </div>
    </div>
  );
};
