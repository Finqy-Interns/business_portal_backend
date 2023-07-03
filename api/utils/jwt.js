const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "secret-key-finqy.ai";

module.exports = {
  // getUserToken: () => {

  // },
  validate: (token, callback) => {
    return jwt.verify(token, secret, callback);
  },
  generateToken: ({ username, role }) => {
    // What all Details will the token contain
    const payload = {
      username,
      role,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "10h" });

    return token;
  },
};
