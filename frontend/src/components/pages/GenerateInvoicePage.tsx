import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Download, FileText, ArrowLeft, CheckCircle, LogOut } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { RootState } from '../../store';
import { invoiceAPI } from '../../services/api';
import { clearProducts } from '../../store/slices/productsSlice';
import { logout } from '../../store/slices/authSlice';

const GenerateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { products, totalAmount, totalGST, grandTotal } = useSelector((state: RootState) => state.products);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);

  const generateInvoiceMutation = useMutation({
    mutationFn: invoiceAPI.generatePDF,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setGeneratedInvoice(response.data);
        toast.success('Invoice generated successfully!');
      } else {
        toast.error(response.message || 'Failed to generate invoice');
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to generate invoice';
      toast.error(errorMessage);
    },
  });

  const handleGenerateInvoice = () => {
    if (products.length === 0) {
      toast.error('No products found. Please add products first.');
      navigate('/products');
      return;
    }

    generateInvoiceMutation.mutate({ products });
  };

  const handleDownloadPDF = () => {
    if (!generatedInvoice?.pdfBase64) {
      toast.error('No PDF available to download');
      return;
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(generatedInvoice.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${generatedInvoice.invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  const handleNewInvoice = () => {
    dispatch(clearProducts());
    navigate('/products');
    toast.success('Ready to create a new invoice!');
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProducts());
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN');

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackToProducts}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Invoice PDF</h2>
          <p className="text-gray-600">Review your invoice details and generate a professional PDF.</p>
        </div>

        <div className="space-y-6">
          {/* Invoice Preview */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                Invoice Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                    <div className="text-gray-600">
                      <p className="font-medium">{user?.name}</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Details:</h3>
                    <div className="text-gray-600">
                      <p>Date: {formatDate(new Date().toISOString())}</p>
                      <p>Total Items: {products.length}</p>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GST (18%)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {product.qty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(product.rate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(product.total || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(product.gst || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">GST (18%):</span>
                        <span className="font-medium">{formatCurrency(totalGST)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-lg font-semibold">Grand Total:</span>
                        <span className="text-lg font-bold text-indigo-600">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Invoice Card */}
          {!generatedInvoice && (
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="py-8">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Invoice</h3>
                  <p className="text-gray-600 mb-6">
                    Click the button below to generate your professional PDF invoice.
                  </p>
                  <Button
                    onClick={handleGenerateInvoice}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                    disabled={generateInvoiceMutation.isPending}
                  >
                    {generateInvoiceMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating PDF...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Generate PDF Invoice
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Card */}
          {generatedInvoice && (
            <Card className="shadow-lg border-0 bg-white border-l-4 border-l-green-500">
              <CardContent className="py-8">
                <div className="text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Generated Successfully!</h3>
                  <p className="text-gray-600 mb-2">
                    Invoice Number: <span className="font-medium">{generatedInvoice.invoice.invoiceNumber}</span>
                  </p>
                  <p className="text-gray-600 mb-6">
                    Generated on: {formatDate(generatedInvoice.invoice.date)}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleDownloadPDF}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={handleNewInvoice}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Create New Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoicePage;