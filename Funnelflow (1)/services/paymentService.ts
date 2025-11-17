
/**
 * In a real-world application, this file contains frontend functions that make
 * secure HTTP requests to YOUR OWN backend server.
 *
 * YOUR BACKEND SERVER'S RESPONSIBILITIES:
 * 1.  **Securely Store API Keys:** Your backend must store Stripe/PayPal secret API keys
 *     and other sensitive credentials (like webhooks secrets) in a secure, encrypted manner.
 *     NEVER send these secret keys to the frontend.
 * 2.  **Act as an API Proxy:** The frontend sends requests to your backend. Your backend then
 *     uses its securely stored API keys to communicate with Stripe, PayPal, or other
 *     payment gateway APIs.
 * 3.  **Validate and Sanitize Data:** Before interacting with payment gateways, your backend
 *     should validate all incoming data from the frontend to prevent malicious input.
 * 4.  **Handle Payment Logic:** This includes creating customers, setting up subscriptions,
 *     processing charges, handling refunds, and managing payment methods.
 * 5.  **Process Webhooks:** Payment gateways send webhooks to your backend for events like
 *     successful payments, failed payments, or subscription changes. Your backend must
 *     securely receive and process these webhooks.
 * 6.  **Error Handling & Logging:** Implement robust error handling and logging on the backend
 *     to diagnose issues and ensure smooth operation.
 * 7.  **Authentication & Authorization:** Ensure that only authenticated and authorized users
 *     can perform payment-related actions via your backend.
 *
 *
 * HYPOTHETICAL BACKEND ENDPOINTS YOU WOULD IMPLEMENT:
 *
 * 1.  POST /api/payments/connect
 *     - Receives `gatewayId`, `clientId`, `clientSecret` from frontend.
 *     - On backend: Validates credentials (e.g., attempts to make a test API call to Stripe/PayPal
 *       using the provided `clientId`/`clientSecret` to ensure they are valid and can establish a connection).
 *     - Saves the `clientId` (and potentially encrypts `clientSecret` if needed for future backend use)
 *       associated with the user/account in your database.
 *     - Returns `{ success: true, message: "Connected successfully." }` or
 *       `{ success: false, error: "Invalid credentials." }`
 *
 * 2.  POST /api/payments/disconnect
 *     - Receives `gatewayId` from frontend.
 *     - On backend: Removes/invalidates the stored credentials for that gateway from your database
 *       associated with the user/account.
 *     - Returns `{ success: true, message: "Disconnected successfully." }` or
 *       `{ success: false, error: "Failed to disconnect." }`
 *
 * The functions below are designed to call these *hypothetical* backend endpoints.
 * You MUST implement these endpoints on your own server for a working solution.
 */

import { PaymentGateway } from '../types';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * Connects a payment gateway by making an API call to a hypothetical backend endpoint.
 *
 * @param gatewayId The ID of the payment gateway (e.g., 'stripe', 'paypal').
 * @param credentials Object containing clientId and clientSecret.
 * @returns A Promise that resolves with an ApiResponse on success or rejects on fetch/JSON parsing error.
 */
export const connectPaymentGateway = async (
  gatewayId: PaymentGateway['id'],
  credentials: { clientId: string; clientSecret: string },
): Promise<ApiResponse> => {
  console.log(`Frontend sending request to backend to connect ${gatewayId}...`);

  try {
    const response = await fetch('/api/payments/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here (e.g., Bearer token)
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({ gatewayId, clientId: credentials.clientId, clientSecret: credentials.clientSecret }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      // If the HTTP status is not 2xx, treat it as a backend error
      const errorMessage = data.error || `Backend error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data; // Expected: { success: true, message: "..." } or { success: false, error: "..." }
  } catch (error: any) {
    console.error(`Error during connectPaymentGateway for ${gatewayId}:`, error);
    // Re-throw to be caught by the calling component
    throw new Error(error.message || `Network or unexpected error connecting to ${gatewayId}.`);
  }
};

/**
 * Disconnects a payment gateway by making an API call to a hypothetical backend endpoint.
 *
 * @param gatewayId The ID of the payment gateway.
 * @returns A Promise that resolves with an ApiResponse on success or rejects on fetch/JSON parsing error.
 */
export const disconnectPaymentGateway = async (gatewayId: PaymentGateway['id']): Promise<ApiResponse> => {
  console.log(`Frontend sending request to backend to disconnect ${gatewayId}...`);

  try {
    const response = await fetch('/api/payments/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here (e.g., Bearer token)
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({ gatewayId }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      // If the HTTP status is not 2xx, treat it as a backend error
      const errorMessage = data.error || `Backend error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data; // Expected: { success: true, message: "..." } or { success: false, error: "..." }
  } catch (error: any) {
    console.error(`Error during disconnectPaymentGateway for ${gatewayId}:`, error);
    // Re-throw to be caught by the calling component
    throw new Error(error.message || `Network or unexpected error disconnecting from ${gatewayId}.`);
  }
};