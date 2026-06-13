import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express's Request type to carry the authenticated userId
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware that verifies the JWT from the Authorization header.
 * Attaches req.userId on success; returns 401 on missing or invalid token.
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Expect header format: "Bearer <token>"
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or malformed' });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
