import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Package, Plus, Trash2, Calculator, ArrowRight, LogOut } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { RootState } from '../../store';
import { addProduct, removeProduct, clearProducts } from '../../store/slices/productsSlice';
import { logout } from '../../store/slices/authSlice';
import { Product } from '../../types';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be a positive number'),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { products, totalAmount, totalGST, grandTotal } = useSelector((state: RootState) => state.products);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    dispatch(addProduct(data));
    reset();
    toast.success('Product added successfully!');
  };

  const handleRemoveProduct = (index: number) => {
    dispatch(removeProduct(index));
    toast.success('Product removed successfully!');
  };

  const handleNext = () => {
    if (products.length === 0) {
      toast.error('Please add at least one product before proceeding.');
      return;
    }
    navigate('/generate-invoice');
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProducts());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Levitation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Products</h2>
          <p className="text-gray-600">Add products to your invoice. You can add multiple products with their quantities and rates.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                  <Package className="h-5 w-5 mr-2 text-indigo-600" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        className="mt-1 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="qty" className="text-sm font-medium text-gray-700">
                        Quantity
                      </Label>
                      <Input
                        id="qty"
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        className="mt-1 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        {...register('qty', { valueAsNumber: true })}
                      />
                      {errors.qty && (
                        <p className="mt-1 text-sm text-red-600">{errors.qty.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="rate" className="text-sm font-medium text-gray-700">
                        Rate (₹)
                      </Label>
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter rate"
                        className="mt-1 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        {...register('rate', { valueAsNumber: true })}
                      />
                      {errors.rate && (
                        <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            {products.length > 0 && (
              <Card className="mt-6 shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Added Products ({products.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>Qty: {product.qty}</span>
                            <span className="mx-2">•</span>
                            <span>Rate: {formatCurrency(product.rate)}</span>
                            <span className="mx-2">•</span>
                            <span>Total: {formatCurrency(product.total || 0)}</span>
                            <span className="mx-2">•</span>
                            <span>GST (18%): {formatCurrency(product.gst || 0)}</span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                  <Calculator className="h-5 w-5 mr-2 text-indigo-600" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-semibold text-gray-900">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalGST)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-indigo-100 bg-indigo-50 rounded-lg px-3">
                    <span className="text-lg font-semibold text-indigo-900">Grand Total:</span>
                    <span className="text-lg font-bold text-indigo-900">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleNext}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                  disabled={products.length === 0}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;