// ─── Gemini AI Service ────────────────────────────────────────────────────────
// Uses Google Gemini 1.5 Flash — free tier: 15 RPM, 1M tokens/day
// Get your free API key at: https://aistudio.google.com/app/apikey

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `You are CircuitOS AI, an expert electronics engineer and circuit design agent embedded inside a professional circuit design tool.
Your primary job is to generate, build, and modify the user's circuits directly on the canvas.

You help users:
- Generate complete circuits and projects from scratch
- Modify existing circuits (add/remove components and wires)
- Debug circuit problems
- Explain circuit theory

CRITICAL RULES:
- YOU MUST BUILD AND MODIFY CIRCUITS BY OUTPUTTING JSON. Whenever the user asks for a circuit, a project, or a modification, ALWAYS provide a JSON code block containing the changes. Do not just describe the circuit in chat. You are a "project generator". You must actually generate the circuit!
- Be concise but technically accurate.
- Space components out logically using X, Y coordinates (e.g., 200 units apart) so they don't overlap.
- Ensure component types match our library exactly (e.g., 'battery', 'vdc', 'resistor', 'capacitor', 'npn', 'led', 'switch', 'buzzer', 'motor', 'relay', '555timer', etc.).

JSON Format for Modifying or Generating Circuits:
\`\`\`json
{
  "clear": false,
  "add": {
    "components": [ { "id": "U1", "type": "555timer", "position": { "x": 300, "y": 300 }, "rotation": 0, "properties": { "label": "U1" } } ],
    "wires": []
  },
  "remove": {
    "components": ["R1"],
    "wires": []
  },
  "update": {
    "components": [ { "id": "C1", "properties": { "capacitance": 0.01 } } ]
  }
}
\`\`\`
- If generating a completely new project/circuit, ALWAYS set "clear": true and put ALL components in "add.components".
`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

function getConfig(): AIServiceConfig | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') return null;
  return { apiKey: key, model: GEMINI_MODEL, maxTokens: 1024, temperature: 0.7 };
}

export function isAIConfigured(): boolean {
  return getConfig() !== null;
}

export async function sendToGemini(
  messages: GeminiMessage[],
  circuitContext: string
): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error('NO_KEY');
  }

  const url = `${GEMINI_BASE}/${config.model}:generateContent?key=${config.apiKey}`;

  // Build history: inject system context in first user message
  const history: GeminiMessage[] = messages.map((m, i) => {
    if (i === 0 && m.role === 'user') {
      return {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent circuit context:\n${circuitContext}\n\nUser question: ${m.parts[0].text}` }],
      };
    }
    return m;
  });

  const body = {
    contents: history,
    generationConfig: {
      temperature: config.temperature ?? 0.7,
      maxOutputTokens: config.maxTokens ?? 1024,
      topP: 0.95,
      topK: 40,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 400) throw new Error('INVALID_KEY');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(err?.error?.message ?? `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text.trim();
}

export function buildCircuitContext(
  componentCount: number,
  wireCount: number,
  components: Array<{ type: string; label: string; value: string }>
): string {
  const compList = components
    .slice(0, 20)
    .map((c) => `${c.label} (${c.type}): ${c.value}`)
    .join(', ');

  return `Canvas has ${componentCount} component(s) and ${wireCount} wire(s).${
    compList ? ` Components: ${compList}.` : ''
  }`;
}
