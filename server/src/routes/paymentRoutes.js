import express from 'express';
import { createOrder, verifyPayment, cancelSubscription } from '../controllers/paymentController.js';
import { authMiddleware as protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/cancel-subscription', protect, cancelSubscription);

export default router;
