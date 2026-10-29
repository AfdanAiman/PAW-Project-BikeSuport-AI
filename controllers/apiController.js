class ApiController {
    // Endpoint API /api/status
    static getStatus(req, res) {
        res.json({
            status: "online",
            server: "BikeSupport Backend API",
            version: "1.0.0",
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ApiController;