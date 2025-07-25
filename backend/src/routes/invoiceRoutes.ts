import { Router } from 'express';
import { generateInvoicePDF } from '../controllers/invoiceController';
import { protect } from '../middleware/auth';
import { validateProducts, handleValidationErrors } from '../middleware/validation';

const router = Router();

// @route   POST /api/invoice/generate
// @desc    Generate invoice PDF
// @access  Private
router.post('/generate', protect, validateProducts, handleValidationErrors, generateInvoicePDF);

export default router;