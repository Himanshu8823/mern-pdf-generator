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
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

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
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 20px;
            }
            
            .company-info h1 {
                font-size: 28px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 5px;
            }
            
            .company-info p {
                color: #6b7280;
                font-size: 14px;
            }
            
            .invoice-title {
                text-align: right;
            }
            
            .invoice-title h2 {
                font-size: 32px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .invoice-details {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
                gap: 60px;
            }
            
            .bill-to h3 {
                font-size: 16px;
                color: #374151;
                margin-bottom: 15px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .bill-to .customer-name {
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 5px;
            }
            
            .bill-to .customer-email {
                color: #6b7280;
                font-size: 14px;
            }
            
            .invoice-meta h3 {
                font-size: 16px;
                color: #374151;
                margin-bottom: 15px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .invoice-meta p {
                margin-bottom: 8px;
                color: #374151;
                font-size: 14px;
            }
            
            .invoice-meta strong {
                color: #1f2937;
            }
            
            .products-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .products-table thead {
                background: #f9fafb;
            }
            
            .products-table th {
                padding: 15px;
                text-align: left;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .products-table th:last-child,
            .products-table td:last-child {
                text-align: right;
            }
            
            .products-table td {
                padding: 15px;
                border-bottom: 1px solid #f3f4f6;
                color: #374151;
                font-size: 14px;
            }
            
            .products-table tbody tr:hover {
                background: #f9fafb;
            }
            
            .product-name {
                font-weight: 600;
                color: #1f2937;
            }
            
            .totals-section {
                margin-left: auto;
                width: 350px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
                background: #fff;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 15px 20px;
                border-bottom: 1px solid #f3f4f6;
                font-size: 14px;
            }
            
            .total-row:last-child {
                border-bottom: none;
                background: #f9fafb;
                font-weight: bold;
                font-size: 18px;
                color: #1f2937;
            }
            
            .total-row.subtotal {
                color: #374151;
            }
            
            .total-row.gst {
                color: #374151;
            }
            
            .total-label {
                font-weight: 500;
            }
            
            .total-amount {
                font-weight: 600;
            }
            
            .footer {
                margin-top: 60px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .footer p {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .footer .highlight {
                color: #374151;
                font-weight: 500;
            }
            
            .text-right {
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div class="company-info">
                    <h1>Levitation Infotech</h1>
                    <p>Professional Invoice Solutions</p>
                </div>
                <div class="invoice-title">
                    <h2>INVOICE</h2>
                </div>
            </div>

            <div class="invoice-details">
                <div class="bill-to">
                    <h3>Bill To</h3>
                    <div class="customer-name">${user.name}</div>
                    <div class="customer-email">${user.email}</div>
                </div>
                <div class="invoice-meta">
                    <h3>Invoice Details</h3>
                    <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formatDate(new Date(invoice.date))}</p>
                    <p><strong>Status:</strong> Paid</p>
                </div>
            </div>

            <table class="products-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Rate</th>
                        <th style="text-align: right;">Total</th>
                        <th style="text-align: right;">GST (18%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td class="product-name">${product.name}</td>
                            <td style="text-align: center;">${product.qty}</td>
                            <td class="text-right">${formatCurrency(product.rate)}</td>
                            <td class="text-right">${formatCurrency(product.total)}</td>
                            <td class="text-right">${formatCurrency(product.gst)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="totals-section">
                <div class="total-row subtotal">
                    <span class="total-label">Total</span>
                    <span class="total-amount">${formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div class="total-row gst">
                    <span class="total-label">GST (18%)</span>
                    <span class="total-amount">${formatCurrency(invoice.totalGST)}</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Grand Total</span>
                    <span class="total-amount">${formatCurrency(invoice.grandTotal)}</span>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p class="highlight">This invoice was generated on ${formatDate(new Date())}</p>
            </div>
        </div>
    </body>
    </html>
  `;
};