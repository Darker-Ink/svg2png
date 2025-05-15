import React, { useState, useRef } from 'react';
import { Upload, FileUp, Code } from 'lucide-react';
import { SvgData } from '../types';
import SVGPasteModal from './SVGPasteModal';

interface FileUploadProps {
  onFileLoaded: (data: SvgData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSvgFile = (file: File) => {
    if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
      setError('Please upload an SVG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content || !content.includes('<svg')) {
        setError('Invalid SVG file');
        return;
      }

      extractSvgDimensions(content, file.name);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const extractSvgDimensions = (svgContent: string, filename: string) => {
    // Extract width and height from SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      let width: number | undefined;
      let height: number | undefined;
      
      // Try to get width/height from attributes
      if (svgElement.hasAttribute('width') && svgElement.hasAttribute('height')) {
        width = parseFloat(svgElement.getAttribute('width') || '0');
        height = parseFloat(svgElement.getAttribute('height') || '0');
      }
      
      // If no width/height or they're percentage/relative, try viewBox
      if ((!width || !height || isNaN(width) || isNaN(height)) && svgElement.hasAttribute('viewBox')) {
        const viewBox = svgElement.getAttribute('viewBox')?.split(' ');
        if (viewBox && viewBox.length === 4) {
          width = parseFloat(viewBox[2]);
          height = parseFloat(viewBox[3]);
        }
      }
      
      onFileLoaded({
        content: svgContent,
        filename,
        previewWidth: width && !isNaN(width) ? width : 300,
        previewHeight: height && !isNaN(height) ? height : 300,
        originalWidth: width && !isNaN(width) ? width : undefined,
        originalHeight: height && !isNaN(height) ? height : undefined
      });
    } else {
      setError('Invalid SVG structure');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSvgFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processSvgFile(file);
    }
  };

  const handlePastedSvg = (svgContent: string) => {
    extractSvgDimensions(svgContent, 'pasted-svg.svg');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* File Upload Section */}
      <div 
        className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-secondary bg-opacity-30 shadow-glow-lg' 
            : 'border-secondary hover:border-primary hover:shadow-glow'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <FileUp className="w-16 h-16 text-primary mb-3" />
          <h3 className="text-xl font-medium mb-2">Upload SVG File</h3>
          <p className="text-text-secondary mb-4">
            Drag & drop your SVG file here
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".svg" 
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="flex gap-2">
            <button 
              className="py-2 px-6 text-sm bg-secondary rounded-full hover:bg-secondary-light transition-colors duration-200 flex items-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" /> Select File
            </button>
            <button 
              className="py-2 px-6 text-sm bg-secondary rounded-full hover:bg-secondary-light transition-colors duration-200 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <Code className="w-4 h-4 mr-1" /> Paste Code
            </button>
          </div>
        </div>
      </div>

      <SVGPasteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handlePastedSvg} />

      {error && (
        <p className="text-error text-sm animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;