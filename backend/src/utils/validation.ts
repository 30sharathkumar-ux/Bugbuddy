import { DebugRequest } from '../types/debug.types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDebugRequest(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const req = body as Record<string, unknown>;

  if (!req.errorMessage || typeof req.errorMessage !== 'string' || req.errorMessage.trim().length === 0) {
    errors.push('errorMessage is required and must be a non-empty string');
  } else if (req.errorMessage.length > 5000) {
    errors.push('errorMessage must not exceed 5000 characters');
  }

  if (req.codeSnippet !== undefined && typeof req.codeSnippet !== 'string') {
    errors.push('codeSnippet must be a string');
  }

  if (req.language !== undefined && typeof req.language !== 'string') {
    errors.push('language must be a string');
  }

  if (req.framework !== undefined && typeof req.framework !== 'string') {
    errors.push('framework must be a string');
  }

  if (req.additionalContext !== undefined && typeof req.additionalContext !== 'string') {
    errors.push('additionalContext must be a string');
  }

  return { valid: errors.length === 0, errors };
}

export function sanitizeDebugRequest(body: Record<string, unknown>): DebugRequest {
  return {
    errorMessage: (body.errorMessage as string).trim(),
    codeSnippet: body.codeSnippet ? (body.codeSnippet as string).trim() : undefined,
    language: body.language ? (body.language as string).trim() : undefined,
    framework: body.framework ? (body.framework as string).trim() : undefined,
    additionalContext: body.additionalContext ? (body.additionalContext as string).trim() : undefined,
  };
}
