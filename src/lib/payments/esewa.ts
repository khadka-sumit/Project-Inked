import crypto from 'crypto';

export function generateEsewaSignature(totalAmount: number, transactionUuid: string, productCode: string): string {
  const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q'; // Default sandbox key
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

export function decodeEsewaResponse(encodedData: string) {
  try {
    const decodedStr = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(decodedStr);
  } catch (error) {
    console.error('Failed to decode eSewa response:', error);
    return null;
  }
}
