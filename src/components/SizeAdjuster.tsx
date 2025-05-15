import React from 'react';
import { ConversionSettings, PresetSize } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface SizeAdjusterProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: Partial<ConversionSettings>) => void;
  preset: PresetSize;
  onPresetChange: (preset: PresetSize) => void;
}

const SizeAdjuster: React.FC<SizeAdjusterProps> = ({ 
  settings, 
  onSettingsChange,
  preset,
  onPresetChange
}) => {
  const presets = [
    { id: 'small', label: 'S', description: '256×256' },
    { id: 'medium', label: 'M', description: '512×512' },
    { id: 'large', label: 'L', description: '1024×1024' },
    { id: 'xlarge', label: 'XL', description: '2048×2048' }
  ];

  const handleWidthChange = (width: number) => {
    if (settings.maintainAspectRatio && settings.originalAspectRatio) {
      const height = Math.round(width / settings.originalAspectRatio);
      onSettingsChange({ width, height });
    } else {
      onSettingsChange({ width });
    }
  };

  const handleHeightChange = (height: number) => {
    if (settings.maintainAspectRatio && settings.originalAspectRatio) {
      const width = Math.round(height * settings.originalAspectRatio);
      onSettingsChange({ width, height });
    } else {
      onSettingsChange({ height });
    }
  };

  const toggleAspectRatio = () => {
    if (!settings.maintainAspectRatio) {
      // When enabling aspect ratio, calculate and store the current aspect ratio
      const aspectRatio = settings.width / settings.height;
      onSettingsChange({ 
        maintainAspectRatio: true, 
        originalAspectRatio: aspectRatio 
      });
    } else {
      onSettingsChange({ maintainAspectRatio: false });
    }
  };

  return (
    <div className="space-y-4">
      {/* Size presets */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Size Preset</label>
        <div className="flex space-x-2">
          {presets.map((item) => (
            <button
              key={item.id}
              className={`py-1 px-3 text-sm rounded transition-colors duration-200 flex-1
                ${preset === item.id 
                  ? 'bg-primary text-background font-medium' 
                  : 'bg-secondary hover:bg-secondary-light text-text-primary'}`}
              onClick={() => onPresetChange(item.id as PresetSize)}
              title={item.description}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Width input */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Width (px)</label>
        <input
          type="number"
          value={settings.width}
          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
          min="1"
          max="10000"
          className="w-full bg-background border border-secondary rounded py-2 px-3 text-text-primary focus:border-primary focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Height input */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Height (px)</label>
        <input
          type="number"
          value={settings.height}
          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
          min="1"
          max="10000"
          className="w-full bg-background border border-secondary rounded py-2 px-3 text-text-primary focus:border-primary focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Scale factor */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Scale Factor (Quality)</label>
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.5"
          value={settings.scale}
          onChange={(e) => onSettingsChange({ scale: parseFloat(e.target.value) })}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0.5×</span>
          <span>{settings.scale}×</span>
          <span>4×</span>
        </div>
      </div>

      {/* Lock aspect ratio */}
      <div className="flex items-center mt-2">
        <button
          onClick={toggleAspectRatio}
          className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors duration-200"
        >
          {settings.maintainAspectRatio ? (
            <>
              <Lock className="w-4 h-4 mr-1" />
              <span>Maintain aspect ratio</span>
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4 mr-1" />
              <span>Unlock aspect ratio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SizeAdjuster;