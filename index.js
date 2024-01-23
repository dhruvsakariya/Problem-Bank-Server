const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()
const PORT = 4000

// Middleware to handle CORS
app.use((req, res, next) => {
    const allowedOrigin = req.headers.origin; // Set to the origin of the incoming request

    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Configuration for proxying all HTTP and WebSocket requests
const proxy = createProxyMiddleware({
    target: 'https://api.jdoodle.com',
    changeOrigin: true,
    logLevel: 'debug',
    ws: true,
    onProxyRes: function (proxyRes, req, res) {
        const allowedOrigin = req.headers.origin;
        proxyRes.headers['Access-Control-Allow-Origin'] = allowedOrigin;
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
});

// Apply the proxy to all incoming requests
app.use('/', proxy);

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server listening on PORT ${PORT}`);
});

// Export the Express API
module.exports = app