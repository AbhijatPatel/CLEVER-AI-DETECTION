import app from './app';
import { config } from './config/env';
import { connectDB, disconnectDB } from './config/db';

async function bootstrap() {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`[Clever AI API] Server running on port ${config.port} in ${config.nodeEnv} mode`);
    console.log(`[Clever AI API] Swagger documentation accessible at http://localhost:${config.port}/docs`);
    console.log(`[Clever AI API] Health check at http://localhost:${config.port}/api/v1/health`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[Clever AI API] Received ${signal}. Initiating graceful shutdown...`);
    server.close(async () => {
      console.log('[Clever AI API] HTTP server closed.');
      await disconnectDB();
      console.log('[Clever AI API] Database disconnected. Process terminating safely.');
      process.exit(0);
    });

    // Force terminate after 10s if hung
    setTimeout(() => {
      console.error('[Clever AI API] Shutdown timed out. Forcing termination.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[Clever AI API] Fatal bootstrap error:', err);
  process.exit(1);
});
