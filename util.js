

const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");

/**
 _ Loads the html string returned for the given URL
 _ and sends a Cheerio parser instance of the loaded HTML
 */
const fetchHtmlFromUrl = async url => {
  return await axios
    .get("https://www.youtube.com/feed/trending")
    .then(response => cheerio.load(response.data))
    .catch(error => {
      error.status = (error.response && error.response.status) || 500;
      throw error;
    });
};

module.exports = {
  fetchHtmlFromUrl,
};