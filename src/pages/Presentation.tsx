import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from "react-resizable-panels";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PresentationData {
  markdown: string;
  reveal_js: string;
}

interface Message {
  text: string;
  source: 'user' | 'agent' | 'loading';
  timestamp: number;
}

interface ApiResponse {
  explanation: string;
  modified_html: string;
}

const Presentation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<PresentationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingMessageInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (location.state?.presentationData) {
      setData(location.state.presentationData);
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

  useEffect(() => {
    return () => {
      if (loadingMessageInterval.current) {
        clearInterval(loadingMessageInterval.current);
      }
    };
  }, []);

  const extractCodeFromMarkdown = (content: string | undefined) => {
    if (!content) return '';
    const match = content.match(/```[\s\S]*?\n([\s\S]*?)```/);
    return match ? match[1] : '';
  };

  const updateLoadingMessage = () => {
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.source !== 'loading');
      return [...filtered, {
        text: 'Working' + '.'.repeat((Math.floor(Date.now() / 500) % 4)),
        source: 'loading',
        timestamp: Date.now()
      }];
    });
  };

  const startLoadingMessage = () => {
    setIsProcessing(true);
    updateLoadingMessage();
    loadingMessageInterval.current = setInterval(updateLoadingMessage, 500);
  };

  const stopLoadingMessage = () => {
    setIsProcessing(false);
    if (loadingMessageInterval.current) {
      clearInterval(loadingMessageInterval.current);
      loadingMessageInterval.current = undefined;
    }
    setMessages(prev => prev.filter(msg => msg.source !== 'loading'));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setMessages(prev => [...prev, {
      text: "Preparing your presentation for download...",
      source: 'loading',
      timestamp: Date.now()
    }]);

    try {
      const iframe = document.querySelector('iframe');
      if (!iframe) throw new Error('Presentation iframe not found');

      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDocument) throw new Error('Cannot access iframe content');

      const slides = iframeDocument.querySelectorAll('.slides section');
      if (!slides.length) throw new Error('No slides found in presentation');

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < slides.length; i++) {
        const canvas = await html2canvas(slides[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: true
        });

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save('presentation.pdf');

      setMessages(prev => [
        ...prev.filter(msg => msg.source !== 'loading'),
        {
          text: "Your presentation has been downloaded successfully!",
          source: 'agent',
          timestamp: Date.now()
        }
      ]);
    } catch (error) {
      console.error('Download error:', error);
      setMessages(prev => [
        ...prev.filter(msg => msg.source !== 'loading'),
        {
          text: "Sorry, there was an error downloading your presentation. Please try again.",
          source: 'agent',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input.trim(),
      source: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    startLoadingMessage();

    try {
      const currentHtml = extractCodeFromMarkdown(data?.reveal_js);

      const conversationHistory = messages
        .filter(msg => msg.source !== 'loading')
        .map(msg => ({
          role: msg.source,
          content: msg.text
        }));

      conversationHistory.push({
        role: 'user',
        content: userMessage.text
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html_input: currentHtml,
          prompt: input.trim(),
          conversation_history: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get response from server: ${response.status}`);
      }

      const rawResult = await response.json();

      if (rawResult.status !== 'success' || !rawResult.result) {
        throw new Error('Invalid API response: missing success status or result');
      }

      const result: ApiResponse = {
        explanation: rawResult.result.explanation,
        modified_html: rawResult.result.html
      };

      if (!result.explanation || !result.modified_html) {
        throw new Error('Invalid API response format');
      }

      stopLoadingMessage();

      setData(prev => {
        if (!prev) return prev;
        const cleanHtml = result.modified_html.replace(/^html\n/, '');
        return {
          ...prev,
          reveal_js: `\`\`\`html\n${cleanHtml}\n\`\`\``
        };
      });

      const agentMessage: Message = {
        text: result.explanation,
        source: 'agent',
        timestamp: Date.now()
      };
      setMessages(prev => prev.filter(msg => msg.source !== 'loading').concat(agentMessage));
    } catch (error) {
      stopLoadingMessage();
      console.error('Error:', error);

      const errorMessage: Message = {
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        source: 'agent',
        timestamp: Date.now()
      };
      setMessages(prev => prev.filter(msg => msg.source !== 'loading').concat(errorMessage));
    }
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
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="fullscreen"
          />
        </Panel>

        <PanelResizeHandle className="w-2 hover:w-2 bg-border hover:bg-primary-foreground transition-colors duration-150 cursor-col-resize" />

        <Panel minSize={30}>
          <div className="flex flex-col h-full bg-white/90 backdrop-blur shadow-xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-medium">Chat</h2>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download presentation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 text-sm leading-relaxed rounded-lg whitespace-pre-line",
                      message.source === 'user'
                        ? "bg-gray-50 text-gray-800 ml-4"
                        : message.source === 'loading' 
                          ? "bg-blue-50 text-blue-800 mr-4 animate-pulse" 
                          : "bg-blue-50 text-blue-800 mr-4"
                    )}
                  >
                    <span className="font-semibold inline-block mr-1">
                      {message.source === 'user' ? 'You:' : message.source === 'agent' ? 'AI:' : ''}
                    </span>
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isProcessing ? "Please wait while I process your request..." : "Please let me know what changes you'd like to make..."}
                  className={cn(
                    "pr-12 min-h-[80px] resize-none rounded-xl border-gray-200",
                    "transition-all duration-200",
                    isProcessing 
                      ? "bg-gray-50 text-gray-500" 
                      : "bg-white hover:bg-gray-50"
                  )}
                  disabled={isProcessing}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className={cn(
                    "absolute right-2 bottom-2 h-8 w-8",
                    "bg-[#7E69AB] hover:bg-[#9b87f5] text-white",
                    "transition-all duration-200"
                  )}
                  disabled={!input.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Presentation;
