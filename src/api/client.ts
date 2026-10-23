// src/api/client.ts
import type {
  ApiTricycle,
  ApiComplaint,
  NewComplaint,
  AuthReply,
  ApiUser,
  AiReview,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite only exposes variables whose name starts with VITE_, and it
// replaces this at BUILD time -- the value that was in .env when
// `npm run build` ran is baked into the bundle. That is why adding it
// in Vercel is not enough on its own: the next deploy is what picks it
// up.
export const API_URL = import.meta.env.VITE_API_URL;

// The same guard the backend has for MONGODB_URI, for the same reason:
// a sentence now beats every call going to "undefined/api/tricycles".
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev.",
  );
}

// Every call goes through here: the host, the JSON header, the token
// when there is one, and the API's own message when it refuses.
async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  // getState(), not the useAuthStore hook -- this is not a component,
  // and it does not need to re-render when the token changes. It only
  // needs whatever the token is at the moment of the call.
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // The exact header requireAuth reads: the word Bearer, one space,
      // then the token. No token in the store means no header at all,
      // which is what the public tricycle routes want.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    // Every refusal this API sends has a message field. Reading it is
    // the difference between "Could not save the complaint" and
    // "issueDescription is required".
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ---- tricycles: public. request() sends no token, and none is needed.

export function fetchTricycles(): Promise<ApiTricycle[]> {
  return request<ApiTricycle[]>("/api/tricycles");
}

export function fetchTricycleById(id: string): Promise<ApiTricycle> {
  return request<ApiTricycle>(`/api/tricycles/${id}`);
}

// ---- complaints: private. The token goes on automatically.

export function fetchComplaints(): Promise<ApiComplaint[]> {
  return request<ApiComplaint[]>("/api/complaints");
}

export function fetchComplaintById(id: string): Promise<ApiComplaint> {
  return request<ApiComplaint>(`/api/complaints/${id}`);
}

export function createComplaint(
  newComplaint: NewComplaint,
): Promise<ApiComplaint> {
  return request<ApiComplaint>("/api/complaints", {
    method: "POST",
    body: JSON.stringify(newComplaint),
  });
}

// ---- auth: the two routes that make a session exist

export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ---- ai: private, like complaints. The token goes on automatically,
// which matters more here than anywhere: without it, anyone could
// spend your Gemini quota.
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}
