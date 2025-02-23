
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PresentationData {
  markdown: string;
  reveal_js: string;
}

const Presentation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<PresentationData | null>(null);

  useEffect(() => {
    if (location.state?.presentationData) {
      setData(location.state.presentationData);
      
      // Initialize RevealJS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.js';
      script.onload = () => {
        // @ts-ignore (Reveal is added by the script)
        window.Reveal.initialize({
          hash: true,
          width: window.innerWidth * 0.6,
          height: window.innerHeight,
        });
      };
      document.head.appendChild(script);

      // Add RevealJS styles
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.css';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(script);
        document.head.removeChild(link);
      };
    } else {
      navigate('/');
    }
  }, [location.state]);

  return (
    <div className="flex h-screen">
      {/* Left Side - Presentation */}
      <div className="w-[60%] h-full bg-gray-900 relative">
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-white z-50"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="reveal h-full" dangerouslySetInnerHTML={{ __html: data?.reveal_js || '' }} />
      </div>

      {/* Right Side - Chat */}
      <div className="w-[40%] h-full bg-white overflow-y-auto p-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data?.markdown || '' }} />
      </div>
    </div>
  );
};

export default Presentation;
