
import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, AlertTriangle, AlertOctagon, 
  Info, Bug, PlayCircle, Layout, Eye, Zap
} from 'lucide-react';
import { AuditResult, Issue, TestScenario } from '../types';

interface ReportDisplayProps {
  report: AuditResult | null;
  isAnalyzing: boolean;
}

const SeverityBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/50',
    High: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    Low: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  };
  const colorClass = colors[level as keyof typeof colors] || colors.Low;
  
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${colorClass}`}>
      {level}
    </span>
  );
};

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-3 hover:border-slate-700 transition-all">
    <div className="flex justify-between items-start mb-2">
      <SeverityBadge level={issue.severity} />
      {issue.location_hint && (
        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded truncate max-w-[200px]">
          {issue.location_hint}
        </span>
      )}
    </div>
    <p className="text-slate-300 text-sm leading-relaxed">{issue.description}</p>
  </div>
);

const ScenarioCard: React.FC<{ scenario: TestScenario }> = ({ scenario }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-3">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-medium text-indigo-300 text-sm">{scenario.title}</h4>
      <span className="text-xs bg-indigo-900/30 text-indigo-200 px-2 py-0.5 rounded border border-indigo-800">
        {scenario.type}
      </span>
    </div>
    <div className="space-y-2 pl-4 border-l-2 border-slate-800 mb-3">
      {scenario.steps.map((step, idx) => (
        <p key={idx} className="text-xs text-slate-400">{idx + 1}. {step}</p>
      ))}
    </div>
    <div className="text-xs bg-slate-950 p-2 rounded text-green-400/80 border border-slate-900/50">
      <span className="font-semibold mr-1">Expect:</span> {scenario.expected_result}
    </div>
  </div>
);

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 flex flex-col items-center justify-center">
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
    <span className="text-xs text-slate-500 uppercase tracking-wide mt-1">{label}</span>
  </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ui' | 'a11y' | 'risks' | 'tests'>('overview');

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QA_Audit_Report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
            <h3 className="text-lg font-medium text-slate-300">Analyzing Code</h3>
            <p className="text-sm mt-1 text-slate-500">Writing simple report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
        <FileText className="w-16 h-16 opacity-20 mb-4" />
        <p className="text-lg">Ready to audit</p>
        <p className="text-sm opacity-60">Paste HTML code to generate a simple report.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'ui', label: 'UI Issues', icon: Layout, count: report.ui_issues.length },
    { id: 'a11y', label: 'Accessibility', icon: Eye, count: report.accessibility_issues.length },
    { id: 'risks', label: 'Func. Risks', icon: AlertTriangle, count: report.functional_risks.length },
    { id: 'tests', label: 'Scenarios', icon: PlayCircle, count: report.test_scenarios.length },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-medium">Audit Complete</span>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition-all"
        >
          <Download className="w-3 h-3" />
          <span>JSON</span>
        </button>
      </div>

      {/* Summary Stats (Visible always) */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-slate-950 border-b border-slate-800 shrink-0">
        <StatCard label="Critical" value={report.severity_summary.critical} color="text-red-500" />
        <StatCard label="High" value={report.severity_summary.high} color="text-orange-500" />
        <StatCard label="Medium" value={report.severity_summary.medium} color="text-yellow-500" />
        <StatCard label="Low" value={report.severity_summary.low} color="text-blue-500" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900 overflow-x-auto shrink-0">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                        isActive 
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 bg-slate-950">
        
        {activeTab === 'overview' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-slate-200 font-medium mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Edge Case Suggestions
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {report.edge_case_suggestions.map((edge, idx) => (
                            <li key={idx} className="text-xs text-slate-400 bg-slate-900/50 border border-slate-800 p-2 rounded flex items-start">
                                <span className="text-indigo-500 mr-2">•</span>
                                {edge}
                            </li>
                        ))}
                    </ul>
                </div>
                
                {report.assumptions.length > 0 && (
                    <div>
                         <h3 className="text-slate-200 font-medium mb-3 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-blue-500" /> AI Assumptions
                        </h3>
                        <ul className="space-y-1">
                             {report.assumptions.map((assumption, idx) => (
                                <li key={idx} className="text-xs text-slate-500 italic pl-4 border-l-2 border-slate-800">
                                    "{assumption}"
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'ui' && (
            <div className="space-y-2">
                {report.ui_issues.length === 0 ? <p className="text-slate-500 italic text-sm">No UI issues detected.</p> : 
                 report.ui_issues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
            </div>
        )}

        {activeTab === 'a11y' && (
            <div className="space-y-2">
                {report.accessibility_issues.length === 0 ? <p className="text-slate-500 italic text-sm">No accessibility issues detected.</p> :
                 report.accessibility_issues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
            </div>
        )}

        {activeTab === 'risks' && (
            <div className="space-y-2">
                {report.functional_risks.length === 0 ? <p className="text-slate-500 italic text-sm">No functional risks detected.</p> :
                 report.functional_risks.map((issue, i) => <IssueCard key={i} issue={issue} />)}
            </div>
        )}

        {activeTab === 'tests' && (
            <div className="space-y-2">
                {report.test_scenarios.length === 0 ? <p className="text-slate-500 italic text-sm">No test scenarios generated.</p> :
                 report.test_scenarios.map((scenario, i) => <ScenarioCard key={i} scenario={scenario} />)}
            </div>
        )}

      </div>
      
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900 text-xs text-slate-600 flex justify-between">
         <span>Source Length: {report.meta.source_html_length} chars</span>
         <span>Generated by Gemini 2.5</span>
      </div>
    </div>
  );
};

export default ReportDisplay;
