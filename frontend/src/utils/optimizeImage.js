/**
 * Optimizes Unsplash image URLs to reduce bandwidth and memory usage.
 * Handles edge cases: HTML entities, already-optimized URLs, and non-Unsplash URLs.
 * 
 * @param {string} url The original image URL
 * @param {number} width The desired width in pixels (defaults to 600)
 * @returns {string} The optimized image URL
 */
export const optimizeUnsplashUrl = (url, width = 600) => {
  if (!url) return 'https://placehold.co/400x400?text=No+Image';
  
  // Decode HTML entities (e.g., &amp; -> &) that may come from backend or HTML rendering
  let cleanUrl = url.replace(/&amp;/g, '&');
  
  if (cleanUrl.includes('images.unsplash.com')) {
    // Strip all existing query params and rebuild with optimized ones
    const baseUrl = cleanUrl.split('?')[0];
    // auto=format chooses modern webp/avif, fit=crop crops exactly, q=80 compresses size
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
  }
  
  return cleanUrl;
};
