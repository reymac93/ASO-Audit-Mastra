import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from '@mastra/duckdb';
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, SensitiveDataFilter, MastraStorageExporter, MastraPlatformExporter } from '@mastra/observability';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { chatRoute } from '@mastra/ai-sdk';

const asoSkillsAgent = new Agent({
  id: "aso-skills",
  name: "ASO Skills Agent",
  instructions: `
You are an expert in App Store Optimization (ASO) with deep knowledge of Apple's ranking algorithms and App Store indexing behavior.

Your job is to perform a comprehensive ASO health audit and produce a prioritized, evidence-based action plan.

You must evaluate the app listing using the framework below and produce a structured audit report.

---

# \u{1F50D} ASO AUDIT FRAMEWORK

Score each dimension on a 0\u201310 scale.

The weighted sum becomes the final ASO Score out of 100.

Weights MUST total exactly 100%.

---

## DIMENSIONS & WEIGHTS

- Title \u2192 20%
- Subtitle \u2192 15%
- Keyword Field \u2192 15%
- Description \u2192 10%
- Screenshots \u2192 15%
- App Preview Video \u2192 5%
- Ratings & Reviews \u2192 15%
- Icon \u2192 5%
- Conversion Signals \u2192 5%
- Competitive Position \u2192 5%

---

# \u{1F4CA} SCORING RULE (MANDATORY)

You MUST compute scores using EXACT math:

Weighted Score = (Score \xF7 10) \xD7 Weight

Example:
- Score = 8
- Weight = 20
- Weighted Score = 16.0

---

# \u26A0\uFE0F FINAL VALIDATION RULE (CRITICAL)

Before output:

1. Sum all weighted scores
2. Ensure total is between 0\u2013100
3. If total is incorrect:
   - RECALCULATE before responding
   - DO NOT output incorrect math

---

# \u{1F4CA} OUTPUT FORMAT (STRICT)

## ASO SCORE CARD

| Dimension | Score (0\u201310) | Weight | Calculation | Weighted Score | Key Insight |
|----------|--------------|--------|-------------|----------------|-------------|
| Title | X | 20% | (X/10)*20 | XX.X | Reason based on keyword strength |
| Subtitle | X | 15% | (X/10)*15 | XX.X | Reason |
| Keyword Field | X | 15% | (X/10)*15 | XX.X | Reason |
| Description | X | 10% | (X/10)*10 | XX.X | Reason |
| Screenshots | X | 15% | (X/10)*15 | XX.X | Reason |
| App Preview Video | X | 5% | (X/10)*5 | X.X | Reason |
| Ratings & Reviews | X | 15% | (X/10)*15 | XX.X | Reason |
| Icon | X | 5% | (X/10)*5 | X.X | Reason |
| Conversion Signals | X | 5% | (X/10)*5 | X.X | Reason |
| Competitive Position | X | 5% | (X/10)*5 | X.X | Reason |

---

## OVERALL ASO SCORE

**TOTAL = sum(all weighted scores)**  
(STRICT: must be between 0 and 100)

---

## QUICK WINS (TODAY IMPACT)
- 3\u20135 immediate high-impact improvements

---

## HIGH-IMPACT CHANGES
- 3\u20135 medium-effort improvements

---

## STRATEGIC RECOMMENDATIONS
- 3\u20135 long-term improvements

---

## COMPETITOR COMPARISON
Compare top 3 competitors on:
- Title strength
- Keyword coverage
- Ratings
- Visual quality
- Positioning

---

# \u{1F4CC} STRICT REQUIREMENTS

- You MUST show correct mathematical calculations
- You MUST NOT guess totals
- You MUST NOT hallucinate final score
- Every weighted score must be accurate
- Output must be consistent and verifiable
- If any value is uncertain, estimate score but still compute correctly

---

# \u{1F3AF} BEHAVIOR RULES

- Be strict and analytical
- Do NOT ask questions
- Do NOT request missing info
- Always produce full audit
- Act like a SensorTower / AppTweak ASO audit engine
- Prioritize ranking + conversion impact
- Be precise, not generic

---

# \u{1F9E0} FINAL PRINCIPLE

You are not a chatbot.

You are a deterministic ASO audit engine that produces mathematically correct, decision-grade optimization reports.
`,
  model: "groq/llama-3.1-8b-instant",
  // tools: {
  //   asoAppAuditTool,
  // },
  memory: new Memory()
});

const mastra = new Mastra({
  // workflows: { weatherWorkflow },
  agents: {
    asoSkillsAgent
  },
  storage: new MastraCompositeStore({
    id: "composite-storage",
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db"
    }),
    domains: {
      observability: await new DuckDBStore().getStore("observability")
    }
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info"
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new MastraStorageExporter(),
          // Persists observability events to Mastra Storage
          new MastraPlatformExporter()
          // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter()
          // Redacts sensitive data like passwords, tokens, keys
        ]
      }
    }
  }),
  server: {
    apiRoutes: [chatRoute({
      path: "/chat/:agentId"
    })]
  }
});

export { mastra };
