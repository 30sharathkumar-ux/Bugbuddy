import { Router, Request, Response, NextFunction } from 'express';
import { debuggingService } from '../services/debugging.service';
import { validateDebugRequest, sanitizeDebugRequest } from '../utils/validation';
import { createError } from '../middleware/error-handler';
import logger from '../utils/logger';

// Normalize request body — accept both { error, technology[] } (spec) and { errorMessage, language } (internal)
function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...body };
  // Map `error` → `errorMessage`
  if (!normalized.errorMessage && normalized.error) {
    normalized.errorMessage = normalized.error;
    delete normalized.error;
  }
  // Map `technology[]` → `language` + `framework`
  if (!normalized.language && Array.isArray(normalized.technology) && (normalized.technology as string[]).length > 0) {
    const techs = normalized.technology as string[];
    const autoDetect = techs[0] === 'Auto Detect';
    if (!autoDetect) {
      normalized.language = techs[0] || undefined;
      normalized.framework = techs.slice(1).join(', ') || undefined;
    }
  }
  // Map `context` → `additionalContext`
  if (!normalized.additionalContext && normalized.context) {
    normalized.additionalContext = normalized.context;
  }
  return normalized;
}

const router = Router();

/**
 * POST /api/debug
 * Main debugging endpoint — takes an error and returns AI-powered analysis + sources.
 */
// Accept both POST /api/debug and POST /api/debug/analyze
async function handleDebug(req: Request, res: Response, next: NextFunction) {
  try {
    const normalized = normalizeBody(req.body as Record<string, unknown>);
    const validation = validateDebugRequest(normalized);
    if (!validation.valid) {
      return next(createError(validation.errors.join('; '), 400));
    }

    const debugRequest = sanitizeDebugRequest(normalized);
    logger.info('Debug request received', { error: debugRequest.errorMessage.substring(0, 80) });

    const result = await debuggingService.debug(debugRequest);
    // Wrap in success envelope so both response schemas work
    return res.json({ ...result, success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

router.post('/', handleDebug);
router.post('/analyze', handleDebug);

export default router;
