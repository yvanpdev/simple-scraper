const cheerio = require("cheerio");
const axios = require("axios");

const fetchWebData = async (siteUrl) => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

// THIS WAS WRITTEN FOR A SPECIFIC WEBSITE; LOGIC CAN BE MODIFIED TO FIT YOUR SCRAPING NEEDS
const scrapeHomePage = async (url) => {
  const $ = await fetchWebData(url);
  const locations = [];

  $(".sl-cities-list-item").each((index, element) => {
    locations.push($(element).prop("href"));
  });
  return locations
};

const scrapeData = async (url) => {
  const locations = [];
  let error = false
  for(let x = 0; x < 11; x+=1) {
    const page = `page/${x}`
    await fetchWebData(`${url}/${x === 0? "": page}`).then($ => {
      $(".sl-business-list-item").each((index, element) => {
        const giftCardLink = $(element).children(".sl-business-list-item-action").find("a").prop("href");
        const restaurantName = $(element).children(".sl-business-list-item-details").find("p").find("a").text();
        const address = $(element).children(".sl-business-list-item-details").find(".address").text().trim().replace(/(\r\n|\n|\r|\t)/gm, "");

        locations.push({restaurantName, address, giftCardLink});
      })}).catch(err => {error = true});

      if(error) {
        return {
          locations
        }
      }
  }
  return locations
}

module.exports = {scrapeHomePage, scrapeData};
