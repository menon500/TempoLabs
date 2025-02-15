const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.details || error.error || "Network response was not ok",
    );
  }
  return response.json();
};

export const api = {
  events: {
    list: () =>
      fetch(`${API_URL}/events`)
        .then(handleResponse)
        .then((data) => (Array.isArray(data) ? data : [])),
    create: (data: any) =>
      fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    delete: (id: string) =>
      fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
      }).then(handleResponse),
  },
  registrations: {
    list: () =>
      fetch(`${API_URL}/registrations`)
        .then(handleResponse)
        .then((data) => (Array.isArray(data) ? data : [])),
    create: (data: any) =>
      fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(handleResponse),
    updateStatus: (id: string, status: string) =>
      fetch(`${API_URL}/registrations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(handleResponse),
    updatePayment: (id: string, paymentStatus: string) =>
      fetch(`${API_URL}/registrations/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      }).then(handleResponse),
  },
};
