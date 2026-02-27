import express from 'express';
import cors from 'cors';
import { checkIgn } from 'check-ign';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Endpoint untuk cek ID Higgs Domino
app.get('/check-higgs', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Custom Higgs Domino Checker using Codashop API directly
    // Karena library check-ign belum mendukung Higgs Domino secara bawaan
    const codashopUrl = "https://order-sg.codashop.com/initPayment.action";
    // Higgs Domino endpoint parameters:
    // voucherPricePoint.id=47306 (Example for Higgs Domino - needs verification)
    // voucherTypeName=HIGGS_DOMINO
    const bodyParams = new URLSearchParams();
    bodyParams.append('voucherPricePoint.id', '47306'); // Updated ID for Higgs Domino (Commonly used ID)
    bodyParams.append('voucherPricePoint.price', '5000.0'); // Adjusted price
    bodyParams.append('voucherPricePoint.variablePrice', '0');
    bodyParams.append('user.userId', userId);
    bodyParams.append('voucherTypeName', 'HIGGS_DOMINO'); // Confirmed type name
    bodyParams.append('shopLang', 'id_ID');
    bodyParams.append('voucherTypeId', '1');
    bodyParams.append('gvtId', '1');

    try {
      const axios = await import('axios');
      // Add more detailed logging
      console.log(`Checking Higgs Domino ID: ${userId} via Codashop...`);
      
      const response = await axios.default.post(codashopUrl, bodyParams, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Origin": "https://www.codashop.com",
          "Referer": "https://www.codashop.com/"
        }
      });
      
      const resData = response.data;
      console.log('Codashop Response:', JSON.stringify(resData, null, 2));
      
      if (resData.success && resData.confirmationFields) {
          const rawUsername = resData.confirmationFields.username || "Unknown";
          // Codashop often returns URL encoded names with + for spaces
          const username = decodeURIComponent(rawUsername.replace(/\+/g, ' '));
          
          return res.json({
            code: 200,
            data: {
              username: username,
              level: 'Unknown',
              coins: 'Unknown'
            }
          });
      } else {
         return res.status(404).json({ error: 'User not found or invalid ID' });
      }
    } catch (axiosError) {
      console.error('Direct Codashop request failed:', axiosError.message);
      return res.status(500).json({ error: 'Failed to connect to game server' });
    }

    /*
    const result = await checkIgn({
      game: 'Higgs Domino', 
      id: userId
    });

    if (result && result.status === 200 && result.data) {
    // ...
    */

  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
