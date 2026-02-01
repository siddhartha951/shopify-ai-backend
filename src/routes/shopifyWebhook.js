/**
 * Shopify Webhook Route
 * POST /webhooks/products
 */

const express = require('express');
const router = express.Router();

router.post('/products', (req, res) => {
    // Log incoming webhook payload
    console.log('📦 Shopify Product Webhook Received:', {
        timestamp: new Date().toISOString(),
        topic: req.headers['x-shopify-topic'],
        shop: req.headers['x-shopify-shop-domain'],
        payload: req.body
    });

    // Return 200 immediately (Shopify expects quick response)
    res.status(200).json({ received: true });
});

module.exports = router;
