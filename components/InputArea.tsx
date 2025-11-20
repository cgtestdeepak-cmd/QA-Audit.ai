
import React from 'react';
import { Code2, Eraser, Play, Copy, ScanEye, Zap, BrainCircuit, Layers } from 'lucide-react';
import { AuditMode } from '../types';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isExtension?: boolean;
  onScan?: () => void;
  auditMode: AuditMode;
  onModeChange: (mode: AuditMode) => void;
}

const EXAMPLE_HTML = `
<div class="login-card">
  <h2 style="color: #ccc;">Login</h2>
  <input type="text" placeholder="Username" />
  <input type="password" />
  <button onclick="submit()">Go</button>
  <span class="link">Forgot password?</span>
</div>
`;

const InputArea: React.FC<InputAreaProps> = ({ 
  value, onChange, onAnalyze, isAnalyzing, isExtension, onScan,
  auditMode, onModeChange
}) => {
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  const handleClear = () => {
    onChange('');
  };

  const loadExample = () => {
    onChange(EXAMPLE_HTML.trim());
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center space-x-2 text-slate-400">
          <Code2 className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">HTML Input</span>
        </div>
        <div className="flex items-center space-x-2">
            {isExtension && onScan && (
               <button 
                onClick={onScan}
                className="flex items-center space-x-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors mr-2"
              >
                <ScanEye className="w-3 h-3" />
                <span className="hidden sm:inline">Scan Tab</span>
              </button>
            )}
            <button 
            onClick={loadExample}
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors px-2 py-1 rounded hover:bg-slate-800 whitespace-nowrap"
          >
            Load Example
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
           <button 
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-all"
            title="Clear"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative flex-grow group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isExtension ? "Click 'Scan Tab' to grab page code..." : "<!-- Paste your HTML here to audit... -->"}
          className="w-full h-full bg-slate-950 p-4 text-sm font-mono text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          spellCheck={false}
        />
        
        {/* Bottom Actions Bar */}
        <div className="absolute bottom-4 right-4 left-4 flex flex-col sm:flex-row justify-end items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pointer-events-none">
          
          {/* Mode Selector */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 shadow-lg pointer-events-auto">
            <button
              onClick={() => onModeChange('fast')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                auditMode === 'fast' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Gemini 2.5 Flash Lite - Fastest"
            >
              <Zap className="w-3 h-3" />
              <span>Fast</span>
            </button>
            <button
              onClick={() => onModeChange('standard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                auditMode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Gemini 2.5 Flash - Balanced"
            >
              <Layers className="w-3 h-3" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => onModeChange('deep')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                auditMode === 'deep' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Gemini 3 Pro Preview - Deep Thinking"
            >
              <BrainCircuit className="w-3 h-3" />
              <span>Deep</span>
            </button>
          </div>

          {/* Run Button */}
          <button
            onClick={onAnalyze}
            disabled={!value.trim() || isAnalyzing}
            className={`
              pointer-events-auto
              flex items-center space-x-2 px-6 py-3 rounded-full font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95
              ${!value.trim() || isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : auditMode === 'deep' 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{auditMode === 'deep' ? 'Thinking...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
