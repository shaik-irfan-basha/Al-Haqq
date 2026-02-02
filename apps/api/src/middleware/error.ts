/**
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from 'express';
import type { APIResponse } from '@al-haqq/shared';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export function errorHandler(
    err: AppError,
    _req: Request,
    res: Response<APIResponse<never>>,
    _next: NextFunction
): void {
    console.error('API Error:', err);

    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
        },
    });
}

/**
 * Create a custom error with status code
 */
export function createError(
    message: string,
    statusCode = 500,
    code = 'ERROR'
): AppError {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
}

/**
 * Async route handler wrapper
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
