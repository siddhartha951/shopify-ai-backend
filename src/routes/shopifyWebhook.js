/**
 * Shopify Webhook Route
 * POST /webhooks/products
 * Handles: products/create, products/update, products/delete
 * 
 * IMPORTANT: Must complete DB operation BEFORE sending response
 * because Vercel terminates function after response is sent.
 */

const express = require('express');
const router = express.Router();
const { upsertProduct, deleteProduct } = require('../services/productService');

router.post('/products', async (req, res) => {
    const topic = req.headers['x-shopify-topic'];
    const shop = req.headers['x-shopify-shop-domain'] || '';
    const payload = req.body;

    console.log('═══════════════════════════════════════');
    console.log('📦 Shopify Webhook Received');
    console.log('═══════════════════════════════════════');
    console.log('Topic:', topic);
    console.log('Shop:', shop);
    console.log('Product ID:', payload.id);
    console.log('Product Title:', payload.title);
    console.log('Timestamp:', new Date().toISOString());

    // Process webhook FIRST, then send response
    try {
        let result = null;

        if (topic === 'products/delete') {
            console.log('🔄 Processing DELETE...');
            result = await deleteProduct(payload);
        } else if (topic === 'products/create' || topic === 'products/update') {
            console.log('🔄 Processing UPSERT...');
            result = await upsertProduct(payload, shop);
        } else {
            console.log('ℹ️ Unhandled webhook topic:', topic);
        }

        console.log('═══════════════════════════════════════');
        console.log('✅ Webhook processing complete');
        console.log('Result:', JSON.stringify(result));
        console.log('═══════════════════════════════════════');

        // Send success response AFTER operation completes
        res.status(200).json({ received: true, success: true });

    } catch (error) {
        console.log('═══════════════════════════════════════');
        console.error('❌ Webhook processing FAILED');
        console.error('Error:', error.message);
        console.error('Product ID:', payload.id);
        console.log('═══════════════════════════════════════');

        // Still return 200 to Shopify (so it doesn't retry)
        // but log the failure
        res.status(200).json({ received: true, success: false, error: error.message });
    }
});

module.exports = router;
