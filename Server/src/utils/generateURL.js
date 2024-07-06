const { URLSearchParams } = require("url");

function generateURL(params) {
  const searchParams = new URLSearchParams(params);
  return searchParams.toString();
}

module.exports = generateURL;
