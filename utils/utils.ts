// utils.ts

// Generates a 6-digit random verification code.
export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Stub function to simulate sending a verification email.
// Replace this with your actual implementation using Firebase Cloud Functions or a third-party service.
export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<void> => {
  // For demonstration purposes, log the code.
  console.log(`Sending verification code ${code} to email ${email}`);
  // Simulate asynchronous email sending.
  return Promise.resolve();
};
