// shared/errorHandler.mjs

import { HTTP_STATUS, ERROR_MESSAGES, CORS_HEADERS } from './constants.mjs';

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = HTTP_STATUS.BAD_REQUEST;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HTTP_STATUS.NOT_FOUND;
  }
}

export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Standardized error response handler for Lambda functions
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @returns {Object} - Standardized Lambda response object
 */
export function handleLambdaError(error, operation = 'Operation') {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = `${operation} failed`;

  if (error instanceof ValidationError || error instanceof NotFoundError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message.includes('required') || error.message.includes('Thiếu')) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = error.message;
  } else if (error.message.includes('not found') || error.message.includes('Không tìm thấy')) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    message = error.message;
  } else {
    message = error.message;
  }

  console.error(`${operation} error:`, error);

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ 
      message,
      error: error.message,
      operation 
    }),
  };
}

/**
 * Standardized success response handler for Lambda functions
 * @param {any} data - The response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Optional success message
 * @returns {Object} - Standardized Lambda response object
 */
export function handleLambdaSuccess(data, statusCode = HTTP_STATUS.OK, message = null) {
  const body = message ? { message, data } : data;
  
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}
