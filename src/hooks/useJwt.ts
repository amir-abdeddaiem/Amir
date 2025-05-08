import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

export const useJwt = () => {
  const getToken = () => {
    return Cookies.get('jwt');
  };

  const decodeToken = async (): Promise<JwtPayload | null> => {
    try {
      const token = getToken();
      if (!token) return null;
      
      // Get the JWT secret from environment variables
      const secret = process.env.JWT_SECRET as string;
      if (!secret) {
        console.error('JWT_SECRET is not configured');
        return null;
      }
      
      // Verify the token
      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      // Validate the token payload
      if (!decoded.userId || !decoded.email) {
        console.error('Invalid JWT payload');
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const getUserId = async () => {
    const decoded = await decodeToken();
    return decoded?.userId || null;
  };

  const getEmail = async () => {
    const decoded = await decodeToken();
    return decoded?.email || null;
  };

  const clearToken = () => {
    Cookies.remove('jwt');
    Cookies.remove('userId');
    Cookies.remove('email');
  };

  return {
    getToken,
    decodeToken,
    getUserId,
    getEmail,
    clearToken
  };
};
