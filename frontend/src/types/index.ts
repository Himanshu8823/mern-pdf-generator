export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  name: string;
  qty: number;
  rate: number;
  total?: number;
  gst?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  totalGST: number;
  grandTotal: number;
  date: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface InvoiceRequest {
  products: Product[];
}

export interface InvoiceResponse {
  invoice: Invoice;
  pdfBase64: string;
}