const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:52240';

const PROXY_CONFIG = [
  {
    context: [
      "/api/athlete"
   ],
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  },
  {
    context: ["/ws"],
    target: target,
    secure: false,
    ws: true
  }
]

module.exports = PROXY_CONFIG;
