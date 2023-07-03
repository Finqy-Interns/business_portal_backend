const jwt = require('jsonwebtoken');

function generateToken({ username, role }) {

    // What all Details will the token contain
    const payload = {
        username,
        role
    }

    const token = jwt.sign(payload, 'secret-key', { expiresIn: '1h' });

    return token;
}

module.exports = generateToken