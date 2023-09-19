import * as fs from 'fs';
import * as cheerio from 'cheerio';

try {
    const htmlContent = fs.readFileSync('coverage/lcov-report/index.html', 'utf-8');

    // Parse the HTML content
    const $ = cheerio.load(htmlContent);

    const linesCoverage = $('.pad1y:nth-child(4) .strong').text();
    console.log('Lines Coverage:', linesCoverage);

} 
catch (error) {
    console.error('Error reading or parsing the HTML file:', error);
}
