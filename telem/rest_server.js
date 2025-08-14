const express = require("express");
const app = express();
const rest_server=app.listen(6002, () => {
  console.log("base listening on port 6002");
});

module.exports = { rest_server };
