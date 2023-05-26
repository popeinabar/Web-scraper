const port = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

const url = 'https://www.microsoft.com/investor/reports/ar22/download-center/';
const searchText = 'Annual Report';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const annualReportElement = $('*:contains("Annual Report")').first()[0];

    if (annualReportElement) {
      console.log('\x1b[32m%s\x1b[0m', `SUCCESS: Found "${searchText}" text on page: ${url}`);

      // Search for year in HTML using regex
      const yearRegex = /20(0[2-9]|[1-2][0-9]|3[0-9])/g;
      const yearMatches = html.match(yearRegex);

      if (yearMatches && yearMatches.length > 0) {
        const filteredYears = yearMatches.filter(year => parseInt(year) >= 2002 && parseInt(year) <= 2023);
        console.log(`SUCCESS: Found ${filteredYears.length} matches for years between 2002 and 2023:`);

        console.table(filteredYears.map(year => ({ Year: year })));

        // Search for anchor tag with href containing the year
        filteredYears.forEach(year => {
          const anchorTag = $(`a[href*=\'${year}\']`).first();

          if (anchorTag && anchorTag.attr('href')) {
            console.log('\x1b[36m%s\x1b[0m', `SUCCESS: Found anchor tag for year ${year} in child or sibling element:`);
            console.table([{ Year: year, Link: anchorTag.attr('href') }]);
          } else {
            console.log('\x1b[31m%s\x1b[0m', `WARNING: No anchor tag found for year ${year}`);
          }
        });
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'WARNING: No matches found for year.');
      }
    } else {
      console.log('\x1b[31m%s\x1b[0m', `ERROR: Could not find "${searchText}" text on page: ${url}`);
    }
  })
  .catch(err => console.log('\x1b[31m%s\x1b[0m', `ERROR: ${err}`));



  // async function getData(){
//     try{
//         const response = await axios.get(url)
//         const $ = cheerio.load(response.data)
//         const head = $('#_ctrl0_ctl54_divModuleContainer > div > div > div > div > div.module_item.js--active > div').text()
//         console.log(head)
//     }
//     catch(error){
//         console.log(error)
        
//     }
// }
app.listen(port, ()=> console.log('server running in port 8000'))