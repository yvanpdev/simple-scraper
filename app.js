const {fetchWebData, scrapeData} = require("./scraper");
const fs = require('fs');

// THIS WAS WRITTEN TO SCRAPE A SPECIFIC SITE. THE LOGIC CAN BE MODIFIED TO FIT YOUR NEEDS
// replace url with the url you are trying to scrape
async function scrape() {
  const result = await fetchWebData("https://supportlocal.usatoday.com/").then(datas => {
    return Promise.all(datas.map((data) => {
     return scrapeData(data)
    }));
  }).then(res => res.flat());
  let jsonString = JSON.stringify(result);
  fs.writeFileSync('./output.json', jsonString, 'utf-8');
  console.log("done!");
};

scrape();