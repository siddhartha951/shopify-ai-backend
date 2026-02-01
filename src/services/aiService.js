/**
 * AI Service
 * Handles OpenAI chat completion with product context
 */

const OpenAI = require('openai');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    console.log('✅ OpenAI client initialized');
} else {
    console.warn('⚠️ OpenAI API key not configured. Chat will not work.');
}

/**
 * Generate AI response with product context
 * @param {string} userMessage - User's question
 * @param {string} productContext - Formatted product list
 * @returns {Promise<string>} - AI response
 */
async function generateChatResponse(userMessage, productContext) {
    if (!openai) {
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a helpful shopping assistant for an online store. 
You help customers find products, answer questions about them, and provide recommendations.

Available Products:
${productContext}

Instructions:
- Be friendly and helpful
- If asked about products, use the product list above
- If a product isn't in the list, say it's not currently available
- Include prices when relevant
- Keep responses concise but informative`;

    console.log('🤖 Sending to OpenAI...');

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('✅ OpenAI response received');
    return response;
}

module.exports = {
    generateChatResponse
};
