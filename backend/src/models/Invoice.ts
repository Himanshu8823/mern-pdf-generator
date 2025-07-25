import mongoose, { Schema } from 'mongoose';
import { IInvoice, IProduct } from '../types';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  qty: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  rate: {
    type: Number,
    required: [true, 'Product rate is required'],
    min: [0, 'Rate must be a positive number']
  },
  total: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  }
}, { _id: false });

const invoiceSchema = new Schema<IInvoice>({
  user: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  products: [productSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  totalGST: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);