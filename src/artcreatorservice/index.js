const http = require('http');
const request = require('request');

getAPIHostAndPort = function (req, appendEndSlash) {
  return (
    (req.connection && req.connection.encrypted ? 'https' : 'http') +
    '://' +
    req.headers.host +
    (appendEndSlash ? '/' : '')
  );
};

http
  .createServer(function (req, res) {
    const { rawHeaders, httpVersion, method, socket, url } = req;
    const { remoteAddress, remoteFamily } = socket;    
    console.log(
      JSON.stringify({
        timestamp: Date.now(),
        rawHeaders,
        httpVersion,
        method,
        remoteAddress,
        remoteFamily,
        url
      })
    );    
    if (req.url.includes('/art/')) {
      const url = new URL(req.url, getAPIHostAndPort(req, true));
      
      const seed = req.url.split('/art/')[1]
      request
        .get(
          `https://cdn.vcloud42.com/file/art42-cdn/cubism/seed_${seed}.jpg`
        )
        .pipe(res);
    } else {
      res.statusCode = 404;
      res.end('Not Found')
    }
  })
  .listen(8080, '0.0.0.0', () => console.log(`server listening`));
