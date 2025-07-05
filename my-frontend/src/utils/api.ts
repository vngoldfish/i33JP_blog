const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // nếu bạn dùng cookie (không bắt buộc)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Đã xảy ra lỗi");
  }

  return res.json();
}
