import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!client || !verifyServiceSid) {
    // Graceful fallback for development if env variables are missing,
    // though the prompt says "Do not build any workaround that bypasses Twilio verification."
    // We will enforce Twilio existence.
    console.error('Twilio credentials missing');
    return res.status(500).json({ error: 'Service configuration error.' });
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phone, channel: 'sms' });

    return res.status(200).json({ status: verification.status });
  } catch (error: any) {
    console.error('Twilio Error (Send):', error);
    
    // Check for trial account restrictions or other specific errors
    if (error.code === 21608) {
      return res.status(400).json({ error: 'This phone number is unverified. Trial accounts cannot send messages to unverified numbers.' });
    }
    
    return res.status(500).json({ error: 'We couldn\'t send the verification code right now. Please try again.' });
  }
}
