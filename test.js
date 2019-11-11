const url = require('url');

const endsWithSlash = url
  .parse('https://edwardnunez.io')
  .pathname.endsWith('/');

console.log(endsWithSlash);
