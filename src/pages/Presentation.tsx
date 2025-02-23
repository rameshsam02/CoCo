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
    } else {
      navigate('/');
    }
  }, [location.state]);

  const extractCodeFromMarkdown = (content: string | undefined) => {
    if (!content) return '';
    const match = content.match(/```[\s\S]*?\n([\s\S]*?)```/);
    return match ? match[1] : '';
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/5 h-full">
        <iframe
          srcDoc={extractCodeFromMarkdown(data?.reveal_js)}
          className="w-full h-full border-0"
          title="Reveal.js Presentation"
        />
      </div>
      <div className="w-2/5 h-full p-4 overflow-auto">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data?.markdown || '' }} />
      </div>
    </div>
  );
};

export default Presentation;
