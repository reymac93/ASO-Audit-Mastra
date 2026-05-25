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
  instructions: `You are an expert App Store Optimization specialist. Help users optimize their app store listings with data-driven recommendations.

When providing guidance:
- Analyze titles, subtitles, keywords, and descriptions for optimization
- Suggest keywords based on search volume and competition
- Provide best practices for app screenshots and preview videos
- Recommend metadata improvements for better discoverability
- Give actionable, prioritized suggestions
- Keep recommendations concise and practical`,
  model: "groq/llama-3.1-8b-instant",
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
