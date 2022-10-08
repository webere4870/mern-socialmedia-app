var jwtFirst = require('express-jwt');
var jwks = require('jwks-rsa');

const jwtCheck = jwtFirst.expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        getToken: function fromHeaderOrQuerystring(req) {
            if (
              req.headers.authorization &&
              req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
              return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
              return req.query.token;
            }
            return null;
          },
        jwksUri: 'https://dev-3vss267m.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:5000',
  issuer: 'https://dev-3vss267m.us.auth0.com/',
  algorithms: ['RS256'],
});

module.exports = jwtCheck