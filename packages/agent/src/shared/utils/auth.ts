import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  username?: string;
  email?: string;
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.verify(token, secret) as JwtPayload;
}

export function extractBearerToken(authHeader?: string): string {
  if (!authHeader) return '';
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return '';
}
