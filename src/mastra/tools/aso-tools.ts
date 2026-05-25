import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const asoAppAuditTool = createTool({
  id: 'get-aso-app-audit',
  description: 'Fetch ASO audit data from Appeeky for a mobile app',

  inputSchema: z.object({
    appId: z.string(),
    country: z.string().default('US'),
  }),

  outputSchema: z.any(),

  execute: async ({ appId, country }) => {
    try {
      const res = await fetch(
        `https://api.appeeky.com/aso/audit?app_id=${appId}&country=${country}`
      );

      if (!res.ok) {
        throw new Error(`Appeeky API error: ${res.status}`);
      }

      const data = await res.json();

      return {
        ok: true,
        appId,
        country,
        score: data.score ?? null,
        issues: data.issues ?? [],
        keywords: data.keywords ?? [],
        competitors: data.competitors ?? [],
        metadata: data.metadata ?? {},
        raw: data,
      };
    } catch (error: any) {
      return {
        ok: false,
        error: error.message,
        appId,
        country,
      };
    }
  },
});