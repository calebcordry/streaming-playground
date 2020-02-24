const express = require('express');
const fs = require('fs');
const { IS_DEV } = require('./utils/dev');
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/dom-streamer', (request, response) => {
  response.sendFile(__dirname + '/views/dom-streamer.html');
});

const CHUNK_SIZE = 256;

app.get('/stream', (request, response) => {
  const { chunkSpeed } = request.query;
  const responsePath = __dirname + '/views/response.html';
  if (!chunkSpeed) {
    return response.sendFile(responsePath);
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });

  const chunks = [];

  fs.createReadStream(responsePath, {
    highWaterMark: CHUNK_SIZE,
    encoding: 'utf8',
  })
    .on('data', chunk => {
      chunks.push(chunk);
    })
    .on('close', () => {
      for (let i = 0; i < chunks.length; i++) {
        setTimeout(() => {
          response.write(chunks[i]);
          if (i === chunks.length - 1) {
            response.end();
          }
        }, i * chunkSpeed);
      }
    });
});

const PORT = IS_DEV ? 3000 : process.env.PORT;
// listen for requests :)
const listener = app.listen(PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
