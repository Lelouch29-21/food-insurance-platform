import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = '15m';

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function getCookieOptions() {
  const secure = String(process.env.COOKIE_SECURE || 'false') === 'true';
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  };
}
