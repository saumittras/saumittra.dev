// export const API_BASE_URL =
//   process.env.BASE_URL || "http://localhost:5000/api/v1";
export const API_BASE_URL = "https://api.saumittra.dev/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Try to get token if we are on the client side
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken") || "";
  } else {
    // We could import cookies from next/headers here if needed for server components
    // but the token is usually passed down or managed via NextAuth/Middleware
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers["Authorization"] = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
}
