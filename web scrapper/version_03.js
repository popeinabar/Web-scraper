

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
      console.log(`The text "${searchText}" was found on the page ${url}`);

      // Search for year in HTML using regex
      const yearRegex = /20(0[2-9]|[1-2][0-9]|3[0-9])/g;
      const yearMatches = html.match(yearRegex);

      if (yearMatches && yearMatches.length > 0) {
        const filteredYears = yearMatches.filter(year => parseInt(year) >= 2002 && parseInt(year) <= 2023);
        console.log(`Found ${filteredYears.length} matches for years between 2002 and 2023:`);
        console.log(filteredYears);

        // Find anchor tag in child or sibling element
        filteredYears.forEach(year => {
          const yearElement = $(`*:contains(${year})`).first()[0];
          const anchorTag = $(yearElement).siblings('a').first();

          if (anchorTag.length === 0) {
            const childAnchorTag = $(yearElement).find('a').first();
            if (childAnchorTag.length > 0) {
              console.log(`Found anchor tag for year ${year} in child element:`);
              console.log(childAnchorTag.attr('href'));
            } else {
              console.log(`No anchor tag found for year ${year}.`);
            }
          } else {
            console.log(`Found anchor tag for year ${year} in sibling element:`);
            console.log(anchorTag.attr('href'));
          }
        });
      } else {
        console.log(`No matches found for year.`);
      }
    } else {
      console.log(`The text "${searchText}" was not found on the page ${url}`);
    }
  })
  .catch(err => console.log(err));

