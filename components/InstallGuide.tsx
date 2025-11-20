import React from 'react';
import { X, Terminal, Layers, Play, AlertTriangle, CheckCircle2, Download, Cog } from 'lucide-react';

interface InstallGuideProps {
  onClose: () => void;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ onClose }) => {
  
  const downloadScript = (os: 'win' | 'unix') => {
    let content = '';
    let filename = '';

    if (os === 'win') {
        filename = 'install_qa_audit.bat';
        content = `@echo off
echo ==========================================
echo   QA-Audit.ai - Automated Installer
echo ==========================================
echo.
echo [1/2] Installing dependencies (this may take a moment)...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed. Do you have Node.js installed?
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Building Extension...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo        SETUP COMPLETE! SUCCESS!
echo ==========================================
echo.
echo HOW TO INSTALL IN CHROME:
echo 1. Open Chrome and go to: chrome://extensions
echo 2. Toggle "Developer mode" (top right corner)
echo 3. Click "Load unpacked" (top left)
echo 4. Select the "dist" folder inside this project directory
echo.
echo You can now close this window.
pause`;
    } else {
        filename = 'install_qa_audit.sh';
        content = `#!/bin/bash
echo "=========================================="
echo "  QA-Audit.ai - Automated Installer"
echo "=========================================="
echo ""
echo "[1/2] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed. Ensure Node.js is installed."
    exit 1
fi

echo ""
echo "[2/2] Building Extension..."
npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed."
    exit 1
fi

echo ""
echo "=========================================="
echo "       SETUP COMPLETE! SUCCESS!"
echo "=========================================="
echo ""
echo "HOW TO INSTALL IN CHROME:"
echo "1. Open Chrome and go to: chrome://extensions"
echo "2. Toggle 'Developer mode' (top right corner)"
echo "3. Click 'Load unpacked' (top left)"
echo "4. Select the 'dist' folder inside this project directory"
echo ""`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                        <p className="text-xs text-slate-500">You only need Node.js installed on your computer. The tool will handle the rest.</p>
                    </div>
                </div>
            </section>

            {/* Automated Installer */}
             <section className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cog className="w-24 h-24 text-indigo-400" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">One-Click Automated Setup</h3>
                            <p className="text-sm text-indigo-200">Skip the manual commands. Download and run the installer script.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => downloadScript('win')}
                            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-white py-3 px-4 rounded-lg transition-all group"
                        >
                            <Download className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
                            <div className="text-left">
                                <span className="block text-xs text-slate-400">For Windows</span>
                                <span className="font-semibold">Download .bat</span>
                            </div>
                        </button>
                        <button 
                             onClick={() => downloadScript('unix')}
                             className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-white py-3 px-4 rounded-lg transition-all group"
                        >
                            <Download className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors" />
                             <div className="text-left">
                                <span className="block text-xs text-slate-400">For Mac / Linux</span>
                                <span className="font-semibold">Download .sh</span>
                            </div>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">
                        * Place the downloaded file in your project folder and double-click (or run in terminal) to start.
                    </p>
                </div>
            </section>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-slate-900 px-2 text-xs text-slate-500 uppercase tracking-wider">Or Manual Setup</span>
                </div>
            </div>

            {/* Step 2 */}
            <section>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-100">Load into Chrome</h3>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800">
                    <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300 marker:text-slate-500">
                        <li>Open Google Chrome and navigate to <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">chrome://extensions</code></li>
                        <li>Toggle <b>Developer mode</b> switch in the top-right corner.</li>
                        <li>Click the <b>Load unpacked</b> button (top-left).</li>
                        <li>Select the <code className="bg-slate-950 px-1.5 py-0.5 rounded text-yellow-300">dist</code> folder created by the installer.</li>
                    </ol>
                </div>
                
                <div className="mt-4 flex items-start space-x-3 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div className="text-xs text-yellow-200/80">
                        <strong className="block text-yellow-500 mb-1">Important:</strong>
                        Ensure <code className="text-white">manifest.json</code> exists inside your build folder. The installer handles this automatically.
                    </div>
                </div>
            </section>

            {/* Step 3 */}
            <section>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                        <Play className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-100">Run Audit</h3>
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