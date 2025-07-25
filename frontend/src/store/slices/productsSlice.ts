import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface ProductsState {
  products: Product[];
  totalAmount: number;
  totalGST: number;
  grandTotal: number;
}

const calculateTotals = (products: Product[]) => {
  const totalAmount = products.reduce((sum, product) => {
    const productTotal = product.qty * product.rate;
    return sum + productTotal;
  }, 0);
  
  const totalGST = totalAmount * 0.18; // 18% GST
  const grandTotal = totalAmount + totalGST;
  
  return { totalAmount, totalGST, grandTotal };
};

const initialState: ProductsState = {
  products: [],
  totalAmount: 0,
  totalGST: 0,
  grandTotal: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const total = product.qty * product.rate;
      const gst = total * 0.18;
      
      state.products.push({
        ...product,
        total,
        gst,
      });
      
      const totals = calculateTotals(state.products);
      state.totalAmount = totals.totalAmount;
      state.totalGST = totals.totalGST;
      state.grandTotal = totals.grandTotal;
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
      
      const totals = calculateTotals(state.products);
      state.totalAmount = totals.totalAmount;
      state.totalGST = totals.totalGST;
      state.grandTotal = totals.grandTotal;
    },
    updateProduct: (state, action: PayloadAction<{ index: number; product: Product }>) => {
      const { index, product } = action.payload;
      const total = product.qty * product.rate;
      const gst = total * 0.18;
      
      state.products[index] = {
        ...product,
        total,
        gst,
      };
      
      const totals = calculateTotals(state.products);
      state.totalAmount = totals.totalAmount;
      state.totalGST = totals.totalGST;
      state.grandTotal = totals.grandTotal;
    },
    clearProducts: (state) => {
      state.products = [];
      state.totalAmount = 0;
      state.totalGST = 0;
      state.grandTotal = 0;
    },
  },
});

export const { addProduct, removeProduct, updateProduct, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;