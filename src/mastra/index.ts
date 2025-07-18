
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { memeGeneratorAgent } from './agents/meme-generator';
import { memeGenerationWorkflow } from './workflows/meme-generation';

export const mastra = new Mastra({
  workflows: { memeGenerationWorkflow },
  agents: { memeGeneratorAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
