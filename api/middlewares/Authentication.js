const jwt = require('../utils/jwt')

module.exports = function () {
    return function (req, res, next) {
        // If there is Authorization present in the headers
        var token;
        if (req.headers['authorization']) {
            token = req.headers['authorization'].split('Bearer')[1];
        }
        else {
            return res.status(403).json({ msg: 'No authorization header sent', status: 403 });
        }

        jwt.validate(token, function (err, payload) {
            if (err)
                return res.status(401).json({ msg: 'Token expired', status: 401 });

            // TODO: Add Username and role to the request to be used in Authenticated API's
            req.user = {
                username: payload.username,
                role: payload.role
            }

            return next();

        });
    }
} 