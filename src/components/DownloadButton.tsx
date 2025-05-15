import React from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface DownloadButtonProps {
  pngUrl: string;
  filename: string;
  width: number;
  height: number;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  pngUrl, 
  filename,
  width,
  height 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(pngUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
      <div className="text-text-secondary text-sm">
        <span className="text-primary font-medium">{filename}</span>
        <span className="text-xs ml-2">({width}×{height}px)</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleCopy}
          className="flex items-center py-2 px-4 rounded-md bg-secondary hover:bg-secondary-light transition-colors duration-200 text-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-success" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              <span>Copy</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center py-2 px-4 rounded-md bg-primary text-background hover:bg-primary-muted transition-colors duration-200 text-sm font-medium"
        >
          <Download className="w-4 h-4 mr-1" />
          <span>Download PNG</span>
        </button>
      </div>
    </div>
  );
};

export default DownloadButton;