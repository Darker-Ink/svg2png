/**
 * Converts an SVG string to a PNG data URL
 */
export const convertSvgToPng = (
  svgContent: string,
  width: number,
  height: number,
  scale: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      const svgDoc = new DOMParser().parseFromString(svgContent, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      svgElement.setAttribute('width', width.toString());
      svgElement.setAttribute('height', height.toString());
      
      const cleanSvgString = serializer.serializeToString(svgElement);
      const encodedSvg = encodeURIComponent(cleanSvgString);
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
      
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Unable to get canvas context');
          }
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.scale(scale, scale);
          
          ctx.drawImage(img, 0, 0, width, height);
          
          const pngDataUrl = canvas.toDataURL('image/png', 1.0);
          resolve(pngDataUrl);
        } catch (error: unknown) {
          reject(new Error(`Canvas operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG image'));
      };
      
      img.src = dataUrl;
    } catch (error: unknown) {
      reject(new Error(`SVG processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
};