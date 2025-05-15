import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ImagePreview from './ImagePreview';
import SizeAdjuster from './SizeAdjuster';
import DownloadButton from './DownloadButton';
import { ConversionSettings, SvgData, PresetSize } from '../types';
import { convertSvgToPng } from '../utils/svgToPng';

const SVGConverter: React.FC = () => {
  const [svgData, setSvgData] = useState<SvgData | null>(null);
  const [conversionSettings, setConversionSettings] = useState<ConversionSettings>({
    width: 512,
    height: 512,
    scale: 1,
    maintainAspectRatio: true,
  });
  const [preset, setPreset] = useState<PresetSize>('medium');
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleFileLoaded = (data: SvgData) => {
    setSvgData(data);
    setPngUrl(null);
    setConversionError(null);
    
    // Update width and height if SVG has dimensions
    if (data.originalWidth && data.originalHeight) {
      setConversionSettings(prev => ({
        ...prev,
        width: data.originalWidth || prev.width,
        height: data.originalHeight || prev.height,
      }));
    }
  };

  const handleSettingsChange = (newSettings: Partial<ConversionSettings>) => {
    setConversionSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
    // If settings were changed, set to custom preset
    setPreset('custom');
  };

  const handlePresetChange = (newPreset: PresetSize) => {
    setPreset(newPreset);
    
    // Update dimensions based on preset
    switch (newPreset) {
      case 'small':
        setConversionSettings(prev => ({
          ...prev,
          width: 256,
          height: 256,
        }));
        break;
      case 'medium':
        setConversionSettings(prev => ({
          ...prev,
          width: 512,
          height: 512,
        }));
        break;
      case 'large':
        setConversionSettings(prev => ({
          ...prev,
          width: 1024,
          height: 1024,
        }));
        break;
      case 'xlarge':
        setConversionSettings(prev => ({
          ...prev,
          width: 2048,
          height: 2048,
        }));
        break;
    }
  };

  const handleConvert = async () => {
    if (!svgData) return;
    
    setIsConverting(true);
    setConversionError(null);
    
    try {
      const url = await convertSvgToPng(
        svgData.content,
        conversionSettings.width,
        conversionSettings.height,
        conversionSettings.scale
      );
      setPngUrl(url);
    } catch (error: unknown) {
      console.error('Conversion error:', error);
      setConversionError(error instanceof Error ? error.message : 'Failed to convert SVG to PNG. Please check your SVG file.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-background-secondary rounded-lg border border-secondary p-5 shadow-glow animate-fade-in">
      {!svgData ? (
        <FileUpload onFileLoaded={handleFileLoaded} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Preview Section */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-3 text-primary">Preview</h2>
              <ImagePreview 
                svgData={svgData} 
                pngUrl={pngUrl}
                onReset={() => {
                  setSvgData(null);
                  setPngUrl(null);
                }}
                onSvgUpdate={(content) => {
                  setSvgData({
                    ...svgData,
                    content
                  });
                  setPngUrl(null);
                }}
              />
            </div>
            
            {/* Settings Section */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-3 text-primary">Settings</h2>
              <SizeAdjuster 
                settings={conversionSettings} 
                onSettingsChange={handleSettingsChange}
                preset={preset}
                onPresetChange={handlePresetChange}
              />
              
              <div className="mt-6">
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className={`w-full py-2 px-4 rounded transition-all duration-300 font-medium text-background 
                    ${isConverting 
                      ? 'bg-primary-dark cursor-wait' 
                      : 'bg-primary hover:bg-primary-muted hover:shadow-glow'}`}
                >
                  {isConverting ? 'Converting...' : pngUrl ? 'Reconvert' : 'Convert to PNG'}
                </button>
                
                {conversionError && (
                  <p className="mt-2 text-error text-sm">{conversionError}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Download Section */}
          {pngUrl && (
            <div className="pt-4 border-t border-secondary-light">
              <DownloadButton 
                pngUrl={pngUrl} 
                filename={svgData.filename.replace(/\.svg$/, '.png')} 
                width={conversionSettings.width}
                height={conversionSettings.height}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SVGConverter;