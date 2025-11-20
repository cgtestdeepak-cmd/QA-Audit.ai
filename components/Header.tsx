
import React from 'react';
import { ShieldCheck, Activity, HelpCircle, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onHelpClick?: () => void;
  isExtension?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHelpClick, isExtension }) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              QA-Audit.ai
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">SIMPLE WEB AUDITS</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-500 bg-slate-900 py-1 px-3 rounded-full border border-slate-800">
              <Activity className="w-3 h-3 text-green-500" />
              <span>Gemini 2.5 Flash Active</span>
           </div>
           
           <button 
             onClick={() => window.location.reload()}
             className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
             title="Refresh Page"
           >
             <RefreshCw className="w-4 h-4" />
           </button>

           {onHelpClick && (
             <button 
               onClick={onHelpClick}
               className={`
                 flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all border
                 ${isExtension 
                    ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800' 
                    : 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20'
                 }
               `}
               title="Installation Guide"
             >
               <HelpCircle className="w-4 h-4" />
               {!isExtension && <span className="text-xs font-semibold">Install Extension</span>}
             </button>
           )}
        </div>
      </div>
    </header>
  );
};

export default Header;
