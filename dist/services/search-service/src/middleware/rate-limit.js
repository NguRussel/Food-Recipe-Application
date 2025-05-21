"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const rateLimitWindows = new Map();
const rateLimit = (requestsPerMinute = 60) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const windowSize = 60 * 1000; // 1 minute in milliseconds
        let window = rateLimitWindows.get(clientIP);
        if (!window || (now - window.startTime) > windowSize) {
            // Create new window
            window = { count: 1, startTime: now };
            rateLimitWindows.set(clientIP, window);
            next();
            return;
        }
        if (window.count >= requestsPerMinute) {
            res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((window.startTime + windowSize - now) / 1000)
            });
            return;
        }
        window.count++;
        next();
    };
};
exports.rateLimit = rateLimit;
//# sourceMappingURL=rate-limit.js.map