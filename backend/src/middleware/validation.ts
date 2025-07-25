import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateProducts = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('products.*.qty')
    .isInt({ min: 1 })
    .withMessage('Product quantity must be a positive integer'),
  body('products.*.rate')
    .isFloat({ min: 0 })
    .withMessage('Product rate must be a positive number'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};