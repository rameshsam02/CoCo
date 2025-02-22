
import { Upload, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UploadButtonProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadButton = ({ onFileChange }: UploadButtonProps) => {
  return (
    <div className="w-full max-w-sm mx-auto mt-8 mb-8 animate-slide-up delay-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-12 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 border-2 border-gray-200 hover:border-blue-500 bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-300 group"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Upload Documents</span>
            <FileType className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Upload PDF, DOC, DOCX, XLS, XLSX or image files
        </TooltipContent>
      </Tooltip>
      <input
        id="file-input"
        type="file"
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        onChange={onFileChange}
      />
    </div>
  );
};
