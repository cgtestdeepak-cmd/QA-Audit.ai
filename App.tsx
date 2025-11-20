
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ReportDisplay from './components/ReportDisplay';
import InstallGuide from './components/InstallGuide';
import ChatBot from './components/ChatBot';
import { analyzeHtml } from './services/geminiService';
import { AlertCircle } from 'lucide-react';
import { AuditResult, AuditMode } from './types';

// Declare chrome to resolve "Cannot find name 'chrome'" errors
declare const chrome: any;

// Helper to check if running in a Chrome Extension context
const isExtension = typeof chrome !== 'undefined' && !!chrome.tabs && !!chrome.scripting;

function App() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [report, setReport] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);
  const [auditMode, setAuditMode] = useState<AuditMode>('standard');

  // Auto-fetch HTML if running as an extension
  useEffect(() => {
    if (isExtension) {
      fetchTabHtml();
    }
  }, []);

  const fetchTabHtml = useCallback(() => {
    if (!isExtension) return;

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
              // Script running in the context of the webpage
              const doctype = document.doctype 
                ? new XMLSerializer().serializeToString(document.doctype) 
                : '';
              return doctype + document.documentElement.outerHTML;
            }
          }, (results: any[]) => {
            if (chrome.runtime.lastError) {
              console.warn("Extension injection warning:", chrome.runtime.lastError);
              // Don't set error here to avoid blocking UI if permissions are just restricted on this specific page
              return;
            }
            if (results && results[0] && results[0].result) {
              setHtmlContent(results[0].result);
            }
          });
        }
      });
    } catch (err) {
      console.error("Extension API error:", err);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!htmlContent.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeHtml(htmlContent, auditMode);
      setReport(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [htmlContent, auditMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header onHelpClick={() => setShowInstallGuide(true)} isExtension={isExtension} />

      <main className="flex-grow p-4 lg:p-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-4rem)] relative">
        
        {/* Error Toast */}
        {error && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                <div className="bg-red-900/90 text-red-100 px-6 py-3 rounded-lg shadow-xl border border-red-700 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-4 font-bold hover:text-white">✕</button>
                </div>
            </div>
        )}

        {/* Installation Guide Modal */}
        {showInstallGuide && (
          <InstallGuide onClose={() => setShowInstallGuide(false)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel: Input */}
          <div className="h-full min-h-[500px]">
            <InputArea 
              value={htmlContent} 
              onChange={setHtmlContent} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              isExtension={isExtension}
              onScan={fetchTabHtml}
              auditMode={auditMode}
              onModeChange={setAuditMode}
            />
          </div>

          {/* Right Panel: Output */}
          <div className="h-full min-h-[500px]">
            <ReportDisplay 
              report={report} 
              isAnalyzing={isAnalyzing} 
            />
          </div>
        </div>

        {/* AI Chat Bot */}
        <ChatBot contextHtml={htmlContent} />
      </main>
    </div>
  );
}

export default App;
