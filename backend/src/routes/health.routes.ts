import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const serpapiConfigured = !!process.env.SERPAPI_API_KEY;
  const youcomConfigured = !!process.env.YDC_API_KEY;

  res.json({
    status: 'ok',
    service: 'Bug Buddy Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    // Both formats for compatibility
    apis: {
      gemini: geminiConfigured,
      serpapi: serpapiConfigured,
      youcom: youcomConfigured,
    },
    providers: {
      gemini: geminiConfigured ? 'configured' : 'not_configured',
      serpapi: serpapiConfigured ? 'configured' : 'not_configured',
      youcom: youcomConfigured ? 'configured' : 'not_configured',
    },
  });
});

export default router;
