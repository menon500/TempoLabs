import type { Event, Registration, ApiError } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = (await response.json().catch(() => ({
      error: "Network response was not ok",
    }))) as ApiError;
    throw new Error(
      error.details || error.error || "Network response was not ok",
    );
  }
  return response.json();
};

const handleRequest = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

export const api = {
  events: {
    list: () =>
      handleRequest<Event[]>(`${API_URL}/events`).then((data) =>
        Array.isArray(data) ? data : [],
      ),
    create: (data: Omit<Event, "id" | "createdAt" | "updatedAt">) =>
      handleRequest<Event>(`${API_URL}/events`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>,
    ) =>
      handleRequest<Event>(`${API_URL}/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      handleRequest<void>(`${API_URL}/events/${id}`, {
        method: "DELETE",
      }),
  },
  registrations: {
    list: () =>
      handleRequest<Registration[]>(`${API_URL}/registrations`).then((data) =>
        Array.isArray(data) ? data : [],
      ),
    create: (
      data: Omit<
        Registration,
        "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus"
      >,
    ) =>
      handleRequest<Registration>(`${API_URL}/registrations`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: Registration["status"]) =>
      handleRequest<Registration>(`${API_URL}/registrations/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    updatePayment: (id: string, paymentStatus: Registration["paymentStatus"]) =>
      handleRequest<Registration>(`${API_URL}/registrations/${id}/payment`, {
        method: "PUT",
        body: JSON.stringify({ paymentStatus }),
      }),
  },
};
