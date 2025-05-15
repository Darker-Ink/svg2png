import { Monitor } from 'lucide-react';
import SVGConverter from './components/SVGConverter';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-text-primary font-mono p-4">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Monitor className="text-primary w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold text-primary">SVG<span className="text-white">2</span>PNG</h1>
        </div>
        <p className="text-text-secondary max-w-md">
          Convert your SVG files to PNG with customizable dimensions
        </p>
      </header>
      
      <main className="w-full max-w-3xl">
        <SVGConverter />
      </main>
    </div>
  );
}

export default App;