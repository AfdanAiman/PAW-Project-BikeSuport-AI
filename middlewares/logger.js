const loggerMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Method: ${req.method} | Path: ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`);
    });

    next();
};

module.exports = loggerMiddleware;