require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeTransaction, verifyTransaction } = require('./paystackService.cjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/payments/initialize', async (request, response) => {
  try {
    const { email, amount, metadata } = request.body;

    if (!email || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return response.status(400).json({ message: 'A valid email and amount are required.' });
    }

    const payment = await initializeTransaction({ email, amount: Number(amount), metadata });
    return response.json(payment);
  } catch (error) {
    return response.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.get('/api/payments/verify/:reference', async (request, response) => {
  try {
    const payment = await verifyTransaction(request.params.reference);

    if (payment.status !== 'success') {
      return response.status(400).json({ message: 'Payment was not successful.', payment });
    }

    return response.json(payment);
  } catch (error) {
    return response.status(error.statusCode || 500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});