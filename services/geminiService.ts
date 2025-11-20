
import { GoogleGenAI, Content } from "@google/genai";
import { AuditResult, AuditMode, ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

const SYSTEM_INSTRUCTION_AUDIT = `
You are an expert QA Auditor who explains findings in simple, everyday language.
Analyze the webpage HTML below and produce a complete QA audit in STRICT JSON.

RULES:
- Base findings ONLY on the provided HTML and visible text.
- Do NOT rewrite the HTML.
- If unclear, list assumptions under "assumptions".
- Use low creativity (temperature 0.0) for analytical precision.
- **CRITICAL: Write all descriptions in SIMPLE, PLAIN ENGLISH.** Avoid technical jargon where possible. If a technical term is needed, explain it briefly. Your goal is to make the report easy to understand for a beginner.

OUTPUT (valid JSON):
{
  "ui_issues": [ {"description":"Simple explanation of what looks wrong", "location_hint":"Where it is", "severity":"Critical|High|Medium|Low"} ],
  "accessibility_issues": [ {"description":"Simple explanation of why it is hard to use", "location_hint":"Where it is", "severity":"Critical|High|Medium|Low"} ],
  "functional_risks": [ {"description":"What might break", "location_hint":"Element involved", "severity":"Critical|High|Medium|Low"} ],
  "test_scenarios": [ {"title":"Easy Test Name", "type":"functional|ui|negative|boundary|validation|responsive", "steps":["Step 1", "Step 2"], "expected_result":"What should happen"} ],
  "edge_case_suggestions": ["Tricky things to test"],
  "severity_summary": { "critical":0, "high":0, "medium":0, "low":0 },
  "assumptions": ["Guesses made about the code"],
  "meta": { "page_url":"<<PAGE_URL>>", "page_title":"<<PAGE_TITLE>>", "source_html_length": 0 }
}
`;

const SYSTEM_INSTRUCTION_CHAT = `
You are a friendly and patient QA Mentor integrated into the QA-Audit.ai tool. 
You help users understand accessibility issues, write test cases, and fix HTML bugs.

**CRITICAL INSTRUCTION:**
- Explain everything in **simple, easy-to-understand words**.
- Avoid dense technical jargon. 
- If you must use a technical term (like "DOM" or "ARIA"), explain what it means simply.
- Treat the user like a beginner who wants to learn.
`;

// Client-side sanitization to reduce token usage and noise
const sanitizeHtml = (rawHtml: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Remove scripts, styles, iframes, and heavy media
    const tagsToRemove = ['script', 'style', 'iframe', 'svg', 'noscript', 'meta', 'link'];
    tagsToRemove.forEach(tag => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });

    // Remove comments
    const removeComments = (node: Node) => {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 8) { // Comment node
          node.removeChild(child);
          i--;
        } else if (child.nodeType === 1) { // Element node
          removeComments(child);
        }
      }
    };
    removeComments(doc.body);

    // Return cleaned body HTML or full doc if body is empty/missing
    return doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;
  } catch (e) {
    console.warn("Sanitization failed, using raw HTML", e);
    return rawHtml;
  }
};

export const analyzeHtml = async (htmlContent: string, mode: AuditMode = 'standard'): Promise<AuditResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Sanitize inputs
  const cleanedHtml = sanitizeHtml(htmlContent);

  let modelName = 'gemini-2.5-flash';
  let config: any = {
    systemInstruction: SYSTEM_INSTRUCTION_AUDIT,
    responseMimeType: "application/json",
    temperature: 0.0,
  };

  // Configure model based on mode
  if (mode === 'fast') {
    // Fast AI responses
    modelName = 'gemini-2.5-flash-lite';
  } else if (mode === 'deep') {
    // Think more when needed
    modelName = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 32768 }; 
    // Note: Do not set maxOutputTokens when using thinkingConfig
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `HTML Content to Audit:\n${cleanedHtml}`,
      config: config,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }

    const jsonResponse = JSON.parse(text) as AuditResult;
    
    // Fill in meta data on client side if model missed it or we want to override
    jsonResponse.meta = {
        ...jsonResponse.meta,
        source_html_length: htmlContent.length
    };

    return jsonResponse;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze HTML.");
  }
};

export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  contextHtml?: string
): Promise<string> => {
  if (!API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Prepare history for Gemini SDK
  // SDK expects: { role: 'user' | 'model', parts: [{ text: string }] }
  const chatHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // If there is HTML context, prepend it to the first message or system instruction
  // For simplicity, we'll initialize the chat with it if it's the first message, 
  // but since we are using a persistent chat object in a real app, here we will just rely on the system instruction 
  // or append context to the prompt if needed. 
  
  // Let's use a fresh chat instance for this stateless request pattern
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CHAT + (contextHtml ? `\n\nUser's HTML Code Context:\n${sanitizeHtml(contextHtml).substring(0, 5000)}...` : ''),
    },
    history: chatHistory
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "I couldn't generate a response.";
};
