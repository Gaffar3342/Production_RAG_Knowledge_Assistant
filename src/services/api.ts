import type { ApiErrorResponse, ChatResponse, UploadResponse } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Kept visible in development so deployment misconfiguration is easy to spot.
  console.warn("VITE_API_URL is not configured. Frontend API calls will fail.");
}

const baseUrl = (API_URL ?? "").replace(/\/$/, "");

async function parseApiError(response: Response) {
  let message = `Request failed with status ${response.status}`;

  try {
    const payload = (await response.json()) as ApiErrorResponse;
    message = payload.detail ?? payload.message ?? message;
  } catch {
    const text = await response.text().catch(() => "");
    if (text) message = text;
  }

  return new Error(message);
}

export async function checkBackendStatus(signal?: AbortSignal) {
  if (!baseUrl) return false;

  try {
    const response = await fetch(`${baseUrl}/openapi.json`, { signal });
    return response.ok;
  } catch {
    return false;
  }
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  if (!baseUrl) throw new Error("VITE_API_URL is not configured.");

  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    body,
  });

  if (!response.ok) throw await parseApiError(response);
  return response.json() as Promise<UploadResponse>;
}

export async function sendChatMessage(question: string): Promise<ChatResponse> {
  if (!baseUrl) throw new Error("VITE_API_URL is not configured.");

  const response = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) throw await parseApiError(response);
  return response.json() as Promise<ChatResponse>;
}
