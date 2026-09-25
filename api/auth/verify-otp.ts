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

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone number and code are required' });
  }

  if (!client || !verifyServiceSid) {
    console.error('Twilio credentials missing');
    return res.status(500).json({ error: 'Service configuration error.' });
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      return res.status(200).json({ success: true, status: 'approved' });
    } else {
      // If status is 'pending', it means the code was wrong but valid length
      return res.status(400).json({ error: 'The code you entered is incorrect. Please try again.' });
    }
  } catch (error: any) {
    console.error('Twilio Error (Verify):', error);
    
    // e.g. 20404 - Not found (expired or doesn't exist)
    if (error.code === 20404) {
      return res.status(400).json({ error: 'This code has expired. Please request a new one.' });
    }
    
    return res.status(500).json({ error: 'We couldn\'t verify the code right now. Please try again.' });
  }
}
