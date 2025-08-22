const jwt = require('jsonwebtoken');
const user = require('../service/user');

function authMiddleware(role) {
    return async (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(400).json({ msg: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);

            if (!decoded || !decoded.id || !decoded.role) {
                return res.status(401).json({ msg: 'Invalid token payload' });
            }

            const verify = await user.Verify(decoded.id, decoded.role);

            if (!verify || (role && !role.includes(decoded.role))) {
                return res.status(401).json({ msg: 'User is not authorized' });
            }

            req.session = decoded;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ msg: 'Invalid or expired token' });
        }
    };
}

module.exports = authMiddleware;