import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
    [key: string]: string | number | boolean | undefined;
  }
  /*
  interface JwtPayload {
  exp: number;
  sub?: string;
  iat?: number;
  role?: string;
  // Thêm các field bạn chắc chắn server có trả
}
 */

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true; // Token không hợp lệ => coi như hết hạn
  }
};
