/**
 * Product Service
 * Handles Shopify product data operations with Supabase
 */

const supabase = require('../utils/supabaseClient');

/**
 * Normalize Shopify product payload to match products table schema
 * @param {Object} shopifyProduct - Shopify product payload
 * @param {string} shopDomain - Shop domain from webhook header
 */
function normalizeProduct(shopifyProduct, shopDomain = '') {
    // Extract and validate product_id as STRING
    const productId = shopifyProduct.id != null ? String(shopifyProduct.id) : null;
    if (!productId) {
        throw new Error('Product ID is required');
    }

    // Compute price_min and price_max from variants
    const variants = shopifyProduct.variants || [];
    const prices = variants
        .map(v => parseFloat(v.price))
        .filter(p => !isNaN(p) && p >= 0);

    const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
    const priceMax = prices.length > 0 ? Math.max(...prices) : 0;

    // Generate full product_url with shop domain
    let productUrl = '';
    if (shopifyProduct.handle) {
        const cleanShop = shopDomain.replace(/^https?:\/\//, '');
        productUrl = cleanShop
            ? `https://${cleanShop}/products/${shopifyProduct.handle}`
            : `/products/${shopifyProduct.handle}`;
    }

    // Build normalized product object - all fields explicitly defined
    const normalized = {
        product_id: productId,  // STRING type
        title: shopifyProduct.title || '',
        vendor: shopifyProduct.vendor || '',
        product_type: shopifyProduct.product_type || '',
        price_min: priceMin,
        price_max: priceMax,
        status: shopifyProduct.status || 'active',
        tags: shopifyProduct.tags || '',
        product_url: productUrl,
        updated_at: shopifyProduct.updated_at || new Date().toISOString()
    };

    return normalized;
}

/**
 * Upsert product (create or update)
 * Returns promise that resolves when DB operation completes
 */
async function upsertProduct(shopifyProduct, shopDomain = '') {
    if (!supabase) {
        console.log('⏭️ Supabase not configured, skipping upsert');
        return null;
    }

    const product = normalizeProduct(shopifyProduct, shopDomain);

    console.log('📤 Supabase upsert starting:', {
        product_id: product.product_id,
        title: product.title,
        price_min: product.price_min,
        price_max: product.price_max
    });

    const { data, error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'product_id' })
        .select();

    if (error) {
        console.error('❌ Supabase upsert FAILED:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            product_id: product.product_id
        });
        throw error;
    }

    console.log('✅ Supabase upsert SUCCESS:', {
        product_id: product.product_id,
        title: product.title,
        returned_data: data
    });

    return data;
}

/**
 * Mark product as deleted (soft delete)
 */
async function deleteProduct(shopifyProduct) {
    if (!supabase) {
        console.log('⏭️ Supabase not configured, skipping delete');
        return null;
    }

    const productId = shopifyProduct.id != null ? String(shopifyProduct.id) : null;
    if (!productId) {
        console.error('❌ Cannot delete: Product ID is missing');
        return null;
    }

    console.log('🗑️ Supabase delete starting:', { product_id: productId });

    const { data, error } = await supabase
        .from('products')
        .update({
            status: 'deleted',
            updated_at: new Date().toISOString()
        })
        .eq('product_id', productId)
        .select();

    if (error) {
        console.error('❌ Supabase delete FAILED:', {
            message: error.message,
            code: error.code,
            details: error.details,
            product_id: productId
        });
        throw error;
    }

    console.log('✅ Supabase delete SUCCESS:', {
        product_id: productId,
        returned_data: data
    });

    return data;
}

module.exports = {
    normalizeProduct,
    upsertProduct,
    deleteProduct
};
