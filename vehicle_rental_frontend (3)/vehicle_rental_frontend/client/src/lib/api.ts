// API Configuration and Service Layer
// This file handles all communication with the Spring Boot backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Helper function to make API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ==================== VEHICLE ENDPOINTS ====================
export const vehicleAPI = {
  getAll: () => apiCall<any[]>("/vehicles"),
  getById: (id: number) => apiCall<any>(`/vehicles/${id}`),
  create: (data: any) => apiCall<any>("/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/vehicles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/vehicles/${id}`, {
    method: "DELETE",
  }),
  getAvailable: () => apiCall<any[]>("/vehicles/available"),
  getAvailableFromView: () => apiCall<any[]>("/vehicles/available-view"),
  
};

// ==================== BRANCH ENDPOINTS ====================
export const branchAPI = {
  getAll: () => apiCall<any[]>("/branches"),
  getById: (id: number) => apiCall<any>(`/branches/${id}`),
  create: (data: any) => apiCall<any>("/branches", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/branches/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/branches/${id}`, {
    method: "DELETE",
  }),
};

// ==================== CUSTOMER ENDPOINTS ====================
export const customerAPI = {
  getAll: () => apiCall<any[]>("/customers"),
  getById: (id: number) => apiCall<any>(`/customers/${id}`),
  create: (data: any) => apiCall<any>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/customers/${id}`, {
    method: "DELETE",
  }),
};

// ==================== STAFF ENDPOINTS ====================
export const staffAPI = {
  getAll: () => apiCall<any[]>("/staff"),
  getById: (id: number) => apiCall<any>(`/staff/${id}`),
  create: (data: any) => apiCall<any>("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/staff/${id}`, {
    method: "DELETE",
  }),
};


// ==================== PAYMENT ENDPOINTS ====================
export const paymentAPI = {
  getAll: () => apiCall<any[]>("/payments"),
  getById: (id: number) => apiCall<any>(`/payments/${id}`),
  create: (data: any) => apiCall<any>("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/payments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/payments/${id}`, {
    method: "DELETE",
  }),
};


export const rentalAPI = {
  getAll: () => apiCall<any[]>("/rentals"),
  getById: (id: number) => apiCall<any>(`/rentals/${id}`),

  // ✅ Create new rental request (customer)
  create: (data: any) => apiCall<any>("/rentals", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // ✅ Get rentals by customer (used in CustomerRentals page)
  getByUser: (userId: number) => apiCall<any[]>(`/rentals/user/${userId}`),

  // ✅ Admin approval or rejection of a rental request
  approve: (id: number) => apiCall<any>(`/rentals/${id}/approve`, {
    method: "PUT",
  }),
  reject: (id: number) => apiCall<any>(`/rentals/${id}/reject`, {
    method: "PUT",
  }),

  // ✅ Customer uploads payment proof
  uploadPaymentProof: (rentalId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE_URL}/rentals/${rentalId}/upload-proof`, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      return res.json();
    });
  },

  // ✅ Complete rental (optional, marks as finished)
  complete: (id: number) => apiCall<any>(`/rentals/${id}/complete`, {
    method: "POST",
  }),

  delete: (id: number) => apiCall<void>(`/rentals/${id}`, {
    method: "DELETE",
  }),
  // ✅ Fetch completed rentals from SQL View
getActiveFromView: () => apiCall<any[]>("/rentals/active-view"),
  calculateAmount: (vehicleId: number, rentDate: string, returnDate: string) =>
  apiCall<number>(`/rentals/calculate-amount?vehicleId=${vehicleId}&rentDate=${rentDate}&returnDate=${returnDate}`),

};


// ==================== MAINTENANCE ENDPOINTS ====================
export const maintenanceAPI = {
  getAll: () => apiCall<any[]>("/maintenances"),
  getById: (id: number) => apiCall<any>(`/maintenances/${id}`),
  create: (data: any) => apiCall<any>("/maintenances", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall<any>(`/maintenances/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/maintenances/${id}`, {
    method: "DELETE",
  }),
};

