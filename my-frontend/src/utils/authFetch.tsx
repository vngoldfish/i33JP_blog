import { isTokenExpired } from "./token";

const API_URL = import.meta.env.VITE_API_URL;

export async function authFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = localStorage.getItem("accessToken");

  // 👉 Nếu token đã hết hạn (client-side), cố gắng refresh luôn
  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      if (!data.accessToken) throw new Error("Token refresh không có accessToken");
      accessToken = data.accessToken  as string;
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập đã hết hạn");
    }
  }

  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // Nếu token server báo hết hạn → kiểm tra server-side
  if (res.status === 401) {
    const error = await res.clone().json().catch(() => ({}));
    if (error?.needRefresh) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (!data.accessToken) throw new Error("Token refresh không có accessToken");
        accessToken = data.accessToken  as string;
        localStorage.setItem("accessToken", accessToken);

        const retryHeaders: HeadersInit = {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        res = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        });
      } else {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw new Error("Phiên đăng nhập đã hết hạn");
      }
    }
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Đã xảy ra lỗi");
  }

  return res.json();
}
