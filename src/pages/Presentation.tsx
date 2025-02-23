
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import { Textarea } from "@/components/ui/textarea";

interface PresentationData {
  markdown: string;
  reveal_js: string;
}

interface Message {
  text: string;
  source: 'user' | 'agent';
  timestamp: number;
}

const Presentation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<PresentationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.presentationData) {
      setData(location.state.presentationData);
      // Add initial welcome message
      setMessages([{
        text: "Let me know if you'd like to make any changes to the presentation. I can help you modify the theme, content, layout, or anything else you'd like to adjust. Feel free to suggest any improvements!",
        source: 'agent',
        timestamp: Date.now()
      }]);
    } else {
      navigate('/');
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractCodeFromMarkdown = (content: string | undefined) => {
    if (!content) return '';
    const match = content.match(/```[\s\S]*?\n([\s\S]*?)```/);
    return match ? match[1] : '';
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      text: input.trim(),
      source: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate agent response (replace with actual agent integration)
    setTimeout(() => {
      const agentMessage: Message = {
        text: "I'll help you with that. What specific changes would you like to make to the presentation?",
        source: 'agent',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={60} minSize={30}>
          <iframe
            srcDoc={extractCodeFromMarkdown(data?.reveal_js)}
            className="w-full h-full border-0"
            title="Reveal.js Presentation"
          />
        </Panel>
        
        <PanelResizeHandle className="w-2 hover:w-2 bg-border hover:bg-primary-foreground transition-colors duration-150 cursor-col-resize" />
        
        <Panel minSize={30}>
          <div className="h-full flex flex-col bg-background">
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={msg.timestamp + index}
                      className={cn(
                        "p-3 rounded-lg text-sm", 
                        msg.source === "agent" 
                          ? "bg-blue-50 text-blue-800" 
                          : "bg-gray-50 text-gray-800"
                      )}
                    >
                      <span className="font-semibold">
                        {msg.source === "agent" ? "AI: " : "You: "}
                      </span>
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Please let me know what changes you'd like to make..."
                    className="pr-12 min-h-[80px] resize-none bg-white/80"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    className="absolute right-2 bottom-2 h-8 w-8"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Presentation;
