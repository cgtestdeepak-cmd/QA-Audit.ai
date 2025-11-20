
import React from 'react';
import { X, Terminal, Layers, Play, CheckCircle2, Download, Cog, FolderInput, Key } from 'lucide-react';

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
setlocal enabledelayedexpansion
title QA-Audit.ai Installer

echo ==========================================
echo   QA-Audit.ai - Automated Installer
echo ==========================================
echo.

:CHECK_DIR
if exist "package.json" (
    goto :CONFIG_KEY
)

color 0E
echo [WARNING] package.json not found in the current directory.
echo.
echo It looks like you ran this script from:
echo %CD%
echo.
echo Please provide the path to your "qa-audit-ai" project folder.
echo (You can drag and drop the folder here and press Enter)
echo.
set /p target_dir="Project Path > "

REM Clean up quotes from drag-and-drop
set target_dir=!target_dir:"=!

if "!target_dir!"=="" goto :CHECK_DIR

cd /d "!target_dir!"
if errorlevel 1 (
    color 0C
    echo.
    echo [ERROR] Directory not found. Please try again.
    echo.
    goto :CHECK_DIR
)

goto :CHECK_DIR

:CONFIG_KEY
color 07
echo.
echo [OK] Found project in: %CD%
echo.

if exist ".env" (
    echo [INFO] .env file found. Using existing configuration.
    goto :INSTALL
)

echo ==========================================
echo   API KEY CONFIGURATION
echo ==========================================
echo.
echo To use QA-Audit.ai, you need a free Google Gemini API Key.
echo Get it here: https://aistudio.google.com/app/apikey
echo.
echo Please paste your API Key below and press Enter.
echo.
set /p api_key="API Key > "

if "!api_key!"=="" (
    echo [WARNING] No key entered. You will need to create a .env file manually.
) else (
    echo API_KEY=!api_key! > .env
    echo [OK] API Key saved to .env
)

:INSTALL
echo.
echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] npm install failed.
    echo Please ensure Node.js is installed: https://nodejs.org/
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Building Extension...
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Build failed.
    pause
    exit /b %errorlevel%
)

color 0A
echo.
echo ==========================================
echo        SETUP COMPLETE! SUCCESS!
echo ==========================================
echo.
echo HOW TO INSTALL IN CHROME:
echo 1. Open Chrome and go to: chrome://extensions
echo 2. Enable "Developer mode" (top right)
echo 3. Click "Load unpacked"
echo 4. Select the "dist" folder located here:
echo    %CD%\\dist
echo.
pause`;
    } else {
        filename = 'install_qa_audit.sh';
        content = `#!/bin/bash
echo "=========================================="
echo "  QA-Audit.ai - Automated Installer"
echo "=========================================="
echo ""

# Function to check dir
check_dir() {
    if [ -f "package.json" ]; then
        return 0
    fi
    return 1
}

# Loop until valid dir found
while ! check_dir; do
    echo "[WARNING] package.json not found in $(pwd)"
    echo "Please drag and drop your project folder here and press Enter:"
    read -r target_dir
    
    # Remove quotes
    target_dir="\${target_dir%\\"}"
    target_dir="\${target_dir#\\"}"
    target_dir="\${target_dir%'}"
    target_dir="\${target_dir#'}"
    
    # Handle empty input
    if [ -z "$target_dir" ]; then
        continue
    fi

    # Try to cd
    if [ -d "$target_dir" ]; then
        cd "$target_dir" || continue
    else
        echo "[ERROR] Directory does not exist."
    fi
done

echo ""
echo "[OK] Found project in: $(pwd)"

# API Key Configuration
if [ ! -f ".env" ]; then
    echo ""
    echo "=========================================="
    echo "  API KEY CONFIGURATION"
    echo "=========================================="
    echo "To use QA-Audit.ai, you need a free Google Gemini API Key."
    echo "Get it here: https://aistudio.google.com/app/apikey"
    echo ""
    echo "Please paste your API Key below and press Enter:"
    read -r api_key
    
    if [ ! -z "$api_key" ]; then
        echo "API_KEY=$api_key" > .env
        echo "[OK] API Key saved to .env"
    else
        echo "[WARNING] No key entered. You will need to create a .env file manually."
    fi
else
    echo "[INFO] .env file found. Using existing configuration."
fi

echo ""
echo "[1/2] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed. Is Node.js installed?"
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
echo "LOCATION: $(pwd)/dist"
echo ""
`;
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-300">Node.js Installed</p>
                            <p className="text-xs text-slate-500">Required to run the installer.</p>
                        </div>
                    </div>
                     <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start space-x-3">
                        <Key className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-300">Gemini API Key</p>
                            <p className="text-xs text-slate-500">Get it free from <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-400 hover:underline">Google AI Studio</a>.</p>
                        </div>
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
                            <p className="text-sm text-indigo-200">Handles dependencies, API key setup, and building.</p>
                        </div>
                    </div>

                    {/* Smart Script Note */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 space-y-2">
                        <div className="flex items-start space-x-3">
                             <FolderInput className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                             <div className="text-xs text-blue-200">
                                <strong className="block text-blue-400 mb-1">Smart Installer:</strong>
                                Can be run from anywhere. If run from Downloads, it will ask you to find the project folder.
                            </div>
                        </div>
                         <div className="flex items-start space-x-3 pt-2 border-t border-blue-500/20">
                             <Key className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                             <div className="text-xs text-blue-200">
                                <strong className="block text-blue-400 mb-1">API Key Setup:</strong>
                                The script will ask for your Gemini API Key and configure it automatically.
                            </div>
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
