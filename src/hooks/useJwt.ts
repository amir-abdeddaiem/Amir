import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

export const useJwt = (jwtToken?: string) => {
  const getToken = () => {


    return  jwtToken? jwtToken : Cookies.get("jwt") || null;
  };

  const decodeToken = (): JwtPayload | null => {
    try {
      const token = getToken();
      if (!token) return null;

      const decoded = jwtDecode<JwtPayload>(token);

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
    const decoded =await decodeToken();
    console.log("Decoded JWT:", decoded); 
    return decoded?.userId || null;
  };

  const getEmail = () => {
    const decoded = decodeToken();
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
