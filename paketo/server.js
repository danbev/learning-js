const express = require('express');
const port = process.env.PORT || 8080;

const app = express();

app.get('/', (request, response) => {
  response.send(`<!DOCTYPE html>
<html>
  <head>
    <title>Paketo Buildpacks example</title>
  </head>
  <body>
    Paketo Buildpacks example
  </body>
</html>`);
});

app.listen(port);
