
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  isAgent?: boolean;
  isOld?: boolean;
}

export const ChatBubble = ({ text, isAgent = false, isOld = false }: ChatBubbleProps) => {
  const baseClasses = cn(
    "p-4 rounded-lg max-w-[280px] shadow-lg transition-all duration-500",
    isAgent ? "bg-white/80" : "bg-blue-500/90",
    isAgent ? "text-gray-800" : "text-white",
    "backdrop-blur-sm",
    isOld && "opacity-30 scale-95"
  );

  return (
    <div className={baseClasses}>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
};
