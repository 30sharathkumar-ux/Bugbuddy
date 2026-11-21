import 'dotenv/config';
import app from './app';
import logger from './utils/logger';

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const server = app.listen(PORT, () => {
  logger.info(`Bug Buddy Backend running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received — shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default server;
