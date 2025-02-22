
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  text: string;
  isAgent?: boolean;
  isOld?: boolean;
}

export const ChatBubble = ({ text, isAgent = false, isOld = false }: ChatBubbleProps) => {
  const baseClasses = cn(
    "p-4 rounded-lg max-w-[300px] shadow-lg transition-all duration-500",
    isAgent ? "bg-white/80" : "bg-blue-500/90",
    isAgent ? "text-gray-800" : "text-white",
    "backdrop-blur-sm",
    isOld && "absolute -top-16 opacity-30 scale-95"
  );

  const animationStyle = isOld 
    ? { animation: 'slideUpAndFade 0.5s ease-out forwards' }
    : undefined;

  return (
    <div className="relative">
      <div className={baseClasses} style={animationStyle}>
        <p className="text-sm">{text}</p>
      </div>
      <div className={cn(
        "absolute w-4 h-4 transform rotate-45",
        isAgent 
          ? "bg-white/80 right-1/2 translate-x-2" 
          : "bg-blue-500/90 left-1/2 -translate-x-2",
        "bottom-0 translate-y-2"
      )} />
    </div>
  );
};
