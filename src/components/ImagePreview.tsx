import React, { useState, useEffect } from 'react';
import { ArrowLeftCircle, Code, Maximize2 } from 'lucide-react';
import { SvgData } from '../types';
import SVGPasteModal from './SVGPasteModal';

interface ImagePreviewProps {
  svgData: SvgData;
  pngUrl: string | null;
  onReset: () => void;
  onSvgUpdate: (content: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  svgData,
  pngUrl,
  onReset,
  onSvgUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(
    svgData.previewWidth || 300,
  );
  const [previewHeight, setPreviewHeight] = useState(
    svgData.previewHeight || 300,
  );

  useEffect(() => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData.content, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    if (svgElement) {
      const w = parseInt(svgElement.getAttribute('width') || '', 10);
      const h = parseInt(svgElement.getAttribute('height') || '', 10);
      if (w && !isNaN(w) && w > 0) setPreviewWidth(w);
      if (h && !isNaN(h) && h > 0) setPreviewHeight(h);
    }
  }, [svgData.content]);


  const updateSvgDimensions = (width: number, height: number) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData.content, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');

    if (svgElement) {
      svgElement.setAttribute('width', width.toString());
      svgElement.setAttribute('height', height.toString());
      const serializer = new XMLSerializer();
      const newContent = serializer.serializeToString(svgElement);
      onSvgUpdate(newContent);
    }
  };

  const getScaleFactor = () => {
    if (previewWidth <= 0 || previewHeight <= 0) return 1;

    const padding = 16; // p-2 means 8px on each side, so 16px total for width/height
    
    const maxContentHeight = 256 - padding;
    const maxContentWidthFromConstraint = 350 - padding;

    const originalEstimatedContentWidth = window.innerWidth - 100; 

    const targetContentWidth = Math.min(
      originalEstimatedContentWidth,
      maxContentWidthFromConstraint,
    );
    
    const scaleX = targetContentWidth / previewWidth;
    const scaleY = maxContentHeight / previewHeight;
    
    return Math.min(1, scaleX, scaleY);
  };

  const scaleFactor = getScaleFactor();

  return (
    <div className="bg-background border border-secondary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-secondary">
        <div className="flex items-center">
          <button
            onClick={onReset}
            className="mr-3 text-text-secondary hover:text-primary transition-colors"
            aria-label="Back to upload"
          >
            <ArrowLeftCircle className="w-5 h-5" />
          </button>
          <span className="truncate max-w-[150px] text-sm">
            {svgData.filename}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded text-text-secondary hover:text-text-primary"
            aria-label="Edit SVG code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex items-center justify-center">
        <div
          className="relative bg-[#333] p-2 rounded w-full h-64 flex items-center justify-center overflow-hidden"
          style={{ maxWidth: '315px' }}
        >
          {pngUrl ? (
            <img
              src={pngUrl}
              alt="Converted PNG"
              className="max-w-full max-h-[240px] object-contain animate-scale-in"
            />
          ) : (
            <div
              style={{
                width: previewWidth,
                height: previewHeight,
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'center center',
              }}
              dangerouslySetInnerHTML={{ __html: svgData.content }}
            />
          )}
        </div>
      </div>

      {!pngUrl && (
        <div className="p-3 border-t border-secondary bg-background-secondary">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-text-secondary" />
              <span className="text-xs text-text-secondary">
                Preview Size:
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={previewWidth}
                onChange={(e) => {
                  const width = Math.max(
                    1,
                    Math.min(10000, parseInt(e.target.value) || 300),
                  );
                  setPreviewWidth(width);
                  updateSvgDimensions(width, previewHeight);
                }}
                className="w-20 bg-background border border-secondary rounded px-2 py-1 text-xs"
                min="1"
                max="10000"
                placeholder="Width"
              />
              <span className="text-text-secondary">×</span>
              <input
                type="number"
                value={previewHeight}
                onChange={(e) => {
                  const height = Math.max(
                    1,
                    Math.min(10000, parseInt(e.target.value) || 300),
                  );
                  setPreviewHeight(height);
                  updateSvgDimensions(previewWidth, height);
                }}
                className="w-20 bg-background border border-secondary rounded px-2 py-1 text-xs"
                min="1"
                max="10000"
                placeholder="Height"
              />
            </div>
          </div>
        </div>
      )}

      {pngUrl && (
        <div className="p-3 border-t border-secondary bg-background-secondary text-xs text-text-secondary">
          {pngUrl
            ? 'PNG preview (after conversion)'
            : 'SVG preview (before conversion)'}
        </div>
      )}

      <SVGPasteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(content) => {
          onSvgUpdate(content);
          setIsModalOpen(false);
        }}
        initialContent={svgData.content}
      />
    </div>
  );
};

export default ImagePreview;
