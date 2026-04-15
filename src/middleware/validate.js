import { body, validationResult } from "express-validator";
import AppError from "./AppError.js";

// This function checks the validation result after the rules run
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    // if there are no errors, move to the controller
    if (errors.isEmpty()) {
        return next();
    }

    // collect all error messages in one array
    const errorMessage = errors.array().map((err) => err.msg);

    // send all the errors at once
    return next(new AppError(errorMessage.join(', '), 400));
};

// signup validation rules
export const signupValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .notEmpty().withMessage('Password id required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    
    body('company_name')
        .optional()
        .isString().withMessage('Company name must be text'),

    body('country')
        .optional()
        .isString().withMessage('Country must be text'),

    handleValidationErrors,
];

//login validation rules
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// decision validation rules
export const decisionValidation = [
  body('fx_pair')
    .notEmpty().withMessage('FX pair is required'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),

  body('time_horizon_days')
    .notEmpty().withMessage('Time horizon in days is required')
    .isInt({ gt: 0 }).withMessage('Time horizon must be greater than zero'),

  handleValidationErrors,
];