import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Plus, Trash2, LogOut, Calculator } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { RootState } from '../../store';
import { addProduct, removeProduct, clearProducts } from '../../store/slices/productsSlice';
import { logout } from '../../store/slices/authSlice';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Levitation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
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
          <p className="text-gray-600">Add products to your invoice with quantities and rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qty" className="text-sm font-medium text-gray-700 mb-2 block">
                          Product Qty
                        </Label>
                        <Input
                          id="qty"
                          type="number"
                          min="1"
                          placeholder="0"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          {...register('qty', { valueAsNumber: true })}
                        />
                        {errors.qty && (
                          <p className="mt-1 text-sm text-red-600">{errors.qty.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="rate" className="text-sm font-medium text-gray-700 mb-2 block">
                          Product Rate
                        </Label>
                        <Input
                          id="rate"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          {...register('rate', { valueAsNumber: true })}
                        />
                        {errors.rate && (
                          <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            {products.length > 0 && (
              <Card className="mt-6 shadow-sm border border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Added Products ({products.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <div className="text-sm text-gray-600">
                            <span>Qty: {product.qty}</span>
                            <span className="mx-2">×</span>
                            <span>Rate: {formatCurrency(product.rate)}</span>
                            <span className="mx-2">=</span>
                            <span className="font-medium">Total: {formatCurrency(product.total || 0)}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            GST (18%): {formatCurrency(product.gst || 0)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                          className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <Card className="shadow-sm border border-gray-200 bg-white sticky top-8">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                  <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium text-gray-900">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium text-gray-900">{formatCurrency(totalGST)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Grand Total:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-6"
                    disabled={products.length === 0}
                  >
                    Generate Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;