import express from 'express';
import cors from 'cors';  // Import CORS
import { StreamChat } from 'stream-chat';

const app = express();
const port = 3000;

// Enable CORS for only the frontend URL (localhost:5173 in this case)
app.use(cors({
  origin: 'http://localhost:5173'  // Allow requests from this frontend URL
}));

// Replace with your Stream API Key and Secret
const serverClient = StreamChat.getInstance('32bwzpkny23u', 'zby4d4sfg4735tdzvtz46k3czsdnhpjw7d5tvxm7u679yqcdwbpxy5bjzp657hs9');

app.use(express.json());

// Endpoint to generate a token
app.post('/get-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const token = serverClient.createToken(userId);
    return res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
