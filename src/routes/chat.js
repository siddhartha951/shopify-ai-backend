/**
 * Chat Route
 * POST /chat - AI-powered product chat endpoint
 */

const express = require('express');
const router = express.Router();
const { searchProducts, getAllProducts, formatProductsForContext } = require('../services/productSearch');
const { generateChatResponse } = require('../services/aiService');

router.post('/', async (req, res) => {
    const { message } = req.body;

    console.log('💬 Chat request received:', message);

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Message is required'
        });
    }

    try {
        // Extract keywords from message for product search
        const keywords = message.toLowerCase();

        // Search for relevant products
        let products = await searchProducts(keywords, 15);

        // If no specific results, get all products for context
        if (products.length === 0) {
            products = await getAllProducts(15);
        }

        // Format products for AI context
        const productContext = formatProductsForContext(products);

        console.log(`📦 Using ${products.length} products as context`);

        // Generate AI response
        const aiResponse = await generateChatResponse(message, productContext);

        // Return response
        res.json({
            reply: aiResponse,
            productsUsed: products.length
        });

    } catch (error) {
        console.error('❌ Chat error:', error.message);

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to process chat request'
        });
    }
});

module.exports = router;
