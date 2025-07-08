export const generateQRCode = (dealId: string, userId: string): string => {
  // In a real app, this would generate a proper QR code
  // For this demo, we'll just return a placeholder string
  const timestamp = new Date().getTime();
  const randomCode = Math.random().toString(36).substring(2, 10);
  return `FOODFINDER-${dealId}-${userId}-${timestamp}-${randomCode}`;
};