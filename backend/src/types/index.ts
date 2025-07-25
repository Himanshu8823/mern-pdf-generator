import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProduct {
  name: string;
  qty: number;
  rate: number;
  total: number;
  gst: number;
}

export interface IInvoice extends Document {
  user: string;
  products: IProduct[];
  totalAmount: number;
  totalGST: number;
  grandTotal: number;
  invoiceNumber: string;
  date: Date;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}