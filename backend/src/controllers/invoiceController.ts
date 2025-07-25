import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice';
import User from '../models/User';
import { IProduct } from '../types';

interface AuthRequest extends Request {
  user?: any;
}

export const generateInvoicePDF = async (req: AuthRequest, res: Response) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    // Calculate totals
    const processedProducts: IProduct[] = products.map((product: any) => {
      const total = product.qty * product.rate;
      const gst = total * 0.18; // 18% GST
      return {
        ...product,
        total,
        gst
      };
    });

    const totalAmount = processedProducts.reduce((sum, product) => sum + product.total, 0);
    const totalGST = processedProducts.reduce((sum, product) => sum + product.gst, 0);
    const grandTotal = totalAmount + totalGST;

    // Create invoice in database
    const invoice = await Invoice.create({
      user: userId,
      products: processedProducts,
      totalAmount,
      totalGST,
      grandTotal
    });

    // Get user details
    const user = await User.findById(userId);

    // Generate PDF HTML
    const htmlContent = generateInvoiceHTML(invoice, user, processedProducts);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length.toString()
    });

    res.status(200).json({
      success: true,
      message: 'Invoice generated successfully',
      data: {
        invoice: {
          id: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          totalAmount,
          totalGST,
          grandTotal,
          date: invoice.date
        },
        pdfBase64: pdfBuffer.toString('base64')
      }
    });

  } catch (error: any) {
    console.error('Invoice generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice',
      error: error.message
    });
  }
};

const generateInvoiceHTML = (invoice: any, user: any, products: IProduct[]): string => {
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString('en-IN');

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background: #fff;
            }
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
                background: white;
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                border-bottom: 3px solid #4f46e5;
                padding-bottom: 20px;
            }
            .logo-section h1 {
                font-size: 32px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 5px;
            }
            .logo-section p {
                color: #6b7280;
                font-size: 14px;
            }
            .invoice-info {
                text-align: right;
            }
            .invoice-info h2 {
                font-size: 28px;
                color: #111827;
                margin-bottom: 10px;
            }
            .invoice-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            .bill-to h3, .invoice-meta h3 {
                font-size: 16px;
                color: #4f46e5;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .bill-to p, .invoice-meta p {
                margin-bottom: 8px;
                color: #374151;
            }
            .products-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .products-table th {
                background: #4f46e5;
                color: white;
                padding: 15px 12px;
                text-align: left;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.5px;
            }
            .products-table td {
                padding: 15px 12px;
                border-bottom: 1px solid #e5e7eb;
                color: #374151;
            }
            .products-table tr:nth-child(even) {
                background: #f9fafb;
            }
            .products-table tr:hover {
                background: #f3f4f6;
            }
            .text-right {
                text-align: right;
            }
            .totals-section {
                margin-left: auto;
                width: 300px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            .total-row:last-child {
                border-bottom: none;
                background: #4f46e5;
                color: white;
                font-weight: bold;
                font-size: 16px;
            }
            .total-row.subtotal {
                background: #f9fafb;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .highlight {
                color: #4f46e5;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="invoice-header">
                <div class="logo-section">
                    <h1>Levitation</h1>
                    <p>Professional Invoice Solutions</p>
                </div>
                <div class="invoice-info">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
                </div>
            </div>

            <div class="invoice-details">
                <div class="bill-to">
                    <h3>Bill To:</h3>
                    <p><strong>${user.name}</strong></p>
                    <p>${user.email}</p>
                </div>
                <div class="invoice-meta">
                    <h3>Invoice Details:</h3>
                    <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date Issued:</strong> ${formatDate(invoice.date)}</p>
                    <p><strong>Total Items:</strong> ${products.length}</p>
                </div>
            </div>

            <table class="products-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Rate</th>
                        <th class="text-right">Total</th>
                        <th class="text-right">GST (18%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td><strong>${product.name}</strong></td>
                            <td class="text-right">${product.qty}</td>
                            <td class="text-right">${formatCurrency(product.rate)}</td>
                            <td class="text-right">${formatCurrency(product.total)}</td>
                            <td class="text-right">${formatCurrency(product.gst)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="totals-section">
                <div class="total-row subtotal">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div class="total-row">
                    <span>GST (18%):</span>
                    <span>${formatCurrency(invoice.totalGST)}</span>
                </div>
                <div class="total-row">
                    <span>Grand Total:</span>
                    <span>${formatCurrency(invoice.grandTotal)}</span>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p class="highlight">This is a computer-generated invoice.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};