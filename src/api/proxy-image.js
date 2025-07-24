// api/proxy-image.js
const fetch = require('node-fetch'); // Vercel's Node.js runtime has fetch available,
                                    // but it's good practice to explicitly import if you're used to it.
                                    // If you have issues, you might need to 'npm install node-fetch' in your frontend project's root.

module.exports = async (req, res) => {
    const imageUrl = req.query.url; // Get the original image URL from the query parameter

    if (!imageUrl) {
        return res.status(400).send('Error: Image URL parameter is missing. Use /api/proxy-image?url=YOUR_IMAGE_URL');
    }

    // Basic validation for security (optional but recommended)
    // Ensure only unavatar.io URLs or allowed domains are proxied
    if (!imageUrl.startsWith('https://unavatar.io/')) {
        return res.status(403).send('Forbidden: Only unavatar.io images can be proxied.');
    }

    try {
        // Fetch the image from the original URL
        const response = await fetch(imageUrl);

        if (!response.ok) {
            console.error(`Failed to fetch image from ${imageUrl}: ${response.status} ${response.statusText}`);
            return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
        }

        // Set appropriate headers from the original response (e.g., Content-Type)
        // It's crucial for images!
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        // Add Cache-Control headers for better performance and reduced re-fetching
        // This tells Vercel's CDN and browsers to cache the image
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year, immutable for browsers

        // Stream the image data directly to the client
        response.body.pipe(res);

    } catch (error) {
        console.error('Proxy serverless function error:', error);
        res.status(500).send('Proxy serverless function error when fetching image.');
    }
};