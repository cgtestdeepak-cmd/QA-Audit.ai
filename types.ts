
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type AuditMode = 'fast' | 'standard' | 'deep';

export interface Issue {
  description: string;
  location_hint?: string; // selector_or_hint
  severity: SeverityLevel;
}

export interface TestScenario {
  title: string;
  type: 'functional' | 'ui' | 'negative' | 'boundary' | 'validation' | 'responsive';
  steps: string[];
  expected_result: string;
}

export interface AuditResult {
  ui_issues: Issue[];
  accessibility_issues: Issue[];
  functional_risks: Issue[];
  test_scenarios: TestScenario[];
  edge_case_suggestions: string[];
  severity_summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  assumptions: string[];
  meta: {
    page_url?: string;
    page_title?: string;
    source_html_length: number;
  };
}

export interface AuditState {
  status: 'idle' | 'loading' | 'success' | 'error';
  htmlContent: string;
  report: AuditResult | null;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
