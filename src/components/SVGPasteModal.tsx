import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

type EditorRef = editor.IStandaloneCodeEditor

interface SVGPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (svgContent: string) => void;
  initialContent?: string;
}

const SVGPasteModal: React.FC<SVGPasteModalProps> = ({ isOpen, onClose, onSubmit, initialContent = '' }) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<EditorRef>();

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError('Please paste SVG content');
      return;
    }

    if (!content.includes('<svg')) {
      setError('Invalid SVG content');
      return;
    }

    onSubmit(content);
  };

  const handleEditorDidMount = (editor: EditorRef) => {
    editorRef.current = editor;
    editor.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-background-secondary rounded-lg border border-secondary w-full max-w-3xl shadow-glow">
        <div className="flex items-center justify-between p-4 border-b border-secondary">
          <h3 className="text-lg font-medium text-primary">Paste SVG Code</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-primary transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <Editor
            height="400px"
            defaultLanguage="xml"
            theme="vs-dark"
            value={content}
            onChange={(value) => {
              setContent(value || '');
              setError(null);
            }}
            onMount={(e) => handleEditorDidMount(e)}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              fontSize: 14,
              tabSize: 2,
            }}
          />
          
          {error && (
            <p className="mt-2 text-error text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t border-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md hover:bg-secondary transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-primary text-background rounded-md hover:bg-primary-muted transition-colors duration-200"
          >
            Convert SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SVGPasteModal;