import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const weatherTool = createTool({
  id: "get-weather",
  description: "Simple weather test tool",
  inputSchema: z.object({
    location: z.string()
  }),
  outputSchema: z.any(),
  execute: async ({ location }) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=3.1390&longitude=101.6869&current=temperature_2m`
    );
    const data = await res.json();
    return {
      ok: true,
      location,
      temperature: data.current.temperature_2m,
      raw: data
    };
  }
});

export { weatherTool };
