const API_URL = "http://localhost:3001/api";

export const api = {
  events: {
    list: () => fetch(`${API_URL}/events`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    delete: (id: string) =>
      fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
      }),
  },
  registrations: {
    list: () => fetch(`${API_URL}/registrations`).then((res) => res.json()),
    create: (data: any) =>
      fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    updateStatus: (id: string, status: string) =>
      fetch(`${API_URL}/registrations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).then((res) => res.json()),
    updatePayment: (id: string, paymentStatus: string) =>
      fetch(`${API_URL}/registrations/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      }).then((res) => res.json()),
  },
};
