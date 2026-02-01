/**
 * Product Search Service
 * Searches products in Supabase by title, vendor, or product_type
 */

const supabase = require('../utils/supabaseClient');

/**
 * Search products by query string
 * @param {string} query - Search query
 * @param {number} limit - Max results (default 10)
 * @returns {Promise<Array>} - Matching products
 */
async function searchProducts(query, limit = 10) {
    if (!supabase) {
        console.log('⏭️ Supabase not configured, returning empty results');
        return [];
    }

    if (!query || query.trim() === '') {
        // Return recent products if no query
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .neq('status', 'deleted')
            .order('updated_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('❌ Product fetch error:', error.message);
            return [];
        }
        return data || [];
    }

    const searchTerm = `%${query.trim()}%`;

    // Search in title, vendor, product_type, and tags
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('status', 'deleted')
        .or(`title.ilike.${searchTerm},vendor.ilike.${searchTerm},product_type.ilike.${searchTerm},tags.ilike.${searchTerm}`)
        .limit(limit);

    if (error) {
        console.error('❌ Product search error:', error.message);
        return [];
    }

    console.log(`🔍 Found ${data?.length || 0} products for query: "${query}"`);
    return data || [];
}

/**
 * Get all active products (for context)
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
async function getAllProducts(limit = 20) {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('status', 'deleted')
        .order('updated_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('❌ Product fetch error:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Format products for AI context
 * @param {Array} products 
 * @returns {string}
 */
function formatProductsForContext(products) {
    if (!products || products.length === 0) {
        return 'No products available.';
    }

    return products.map(p =>
        `- ${p.title} (${p.vendor || 'No vendor'}) - ₹${p.price_min}${p.price_max > p.price_min ? ` to ₹${p.price_max}` : ''} - ${p.product_url || 'No URL'}`
    ).join('\n');
}

module.exports = {
    searchProducts,
    getAllProducts,
    formatProductsForContext
};
