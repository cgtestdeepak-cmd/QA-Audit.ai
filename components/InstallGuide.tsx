import React from 'react';
import { X, Terminal, Layers, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InstallGuideProps {
  onClose: () => void;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">Extension Setup Guide</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8 text-slate-300 overflow-y-auto custom-scrollbar">
            {/* Prerequisites */}
             <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">0. Prerequisites</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-slate-300">Node.js Installed</p>
                        <p className="text-xs text-slate-500">You need Node.js and npm (Node Package Manager) installed on your computer to build the project.</p>
                    </div>
                </div>
            </section>

            {/* Step 1 */}
            <section>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-100">1. Build the Project</h3>
                </div>
                <p className="text-sm mb-3 text-slate-400">
                    Run these commands in your project root terminal to generate the extension files.
                </p>
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-sm text-slate-300 relative group">
                    <div className="space-y-4">
                        <div>
                            <p className="text-slate-500 text-xs mb-1"># 1. Install dependencies</p>
                            <p className="text-green-400">npm install</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs mb-1"># 2. Build for production</p>
                            <p className="text-green-400">npm run build</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Step 2 */}
            <section>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-100">2. Load into Chrome</h3>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800">
                    <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300 marker:text-slate-500">
                        <li>Open Google Chrome and navigate to <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">chrome://extensions</code></li>
                        <li>Toggle <b>Developer mode</b> switch in the top-right corner.</li>
                        <li>Click the <b>Load unpacked</b> button (top-left).</li>
                        <li>Select the <code className="bg-slate-950 px-1.5 py-0.5 rounded text-yellow-300">dist</code> or <code className="bg-slate-950 px-1.5 py-0.5 rounded text-yellow-300">build</code> folder that was created in Step 1.</li>
                    </ol>
                </div>
                
                <div className="mt-4 flex items-start space-x-3 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div className="text-xs text-yellow-200/80">
                        <strong className="block text-yellow-500 mb-1">Important:</strong>
                        Ensure <code className="text-white">manifest.json</code> exists inside your build folder. If your build tool didn't copy it automatically, manually copy <code className="text-white">manifest.json</code> from the project root into the build folder.
                    </div>
                </div>
            </section>

            {/* Step 3 */}
            <section>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                        <Play className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-100">3. Run Audit</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-400 ml-2">
                    <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        <span>Pin the <b>QA-Audit.ai</b> extension to your toolbar.</span>
                    </li>
                    <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        <span>Navigate to any webpage you want to test.</span>
                    </li>
                    <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        <span>Open the extension and click <b>"Scan Tab"</b> to auto-import HTML.</span>
                    </li>
                </ul>
            </section>
        </div>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-xl">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20"
            >
                Close Guide
            </button>
        </div>
      </div>
    </div>
  );
};

export default InstallGuide;