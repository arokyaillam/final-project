import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // 24 hours

/**
 * Sign a JWT token with the given payload
 * @param {Object} payload - Data to include in the token
 * @param {string} expiresIn - Token expiration time (default: 24h)
 * @returns {string} Signed JWT token
 */
export const signToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    console.log('JWT Verify - Attempting to verify token');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('JWT Verify - Token verified successfully');
    return decoded;
  } catch (error) {
    console.error('JWT Verify - Token verification failed:', error.message);
    return null;
  }
};

export const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};
