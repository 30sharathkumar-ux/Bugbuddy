import { Router, Request, Response, NextFunction } from 'express';
import { serpApiService } from '../services/serpapi.service';
import { youComService } from '../services/youcom.service';
import { deduplicateResults } from '../utils/deduplicate';
import { createError } from '../middleware/error-handler';

const router = Router();

/**
 * GET /api/search?q=<query>&engine=all|serpapi|youcom&num=10
 * Raw search endpoint (useful for testing individual search engines).
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string | undefined;
    if (!q || q.trim().length === 0) {
      return next(createError('Query parameter "q" is required', 400));
    }

    const engine = (req.query.engine as string) ?? 'all';
    const num = Math.min(parseInt((req.query.num as string) ?? '10', 10), 20);

    const searches: Promise<Awaited<ReturnType<typeof serpApiService.search>>>[] = [];

    if (engine === 'all' || engine === 'serpapi') {
      searches.push(serpApiService.search(q, num));
    }
    if (engine === 'all' || engine === 'youcom') {
      searches.push(youComService.search(q, num));
    }

    const settled = await Promise.allSettled(searches);
    const combined = settled
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => (r as PromiseFulfilledResult<typeof searches[0] extends Promise<infer T> ? T : never>).value);

    const results = deduplicateResults(combined);
    return res.json({ success: true, count: results.length, results });
  } catch (err) {
    return next(err);
  }
});

export default router;
