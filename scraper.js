const { chromium } = require('playwright');

async function scrapeSums() {
  const browser = await chromium.launch();
  let grandTotal = 0;
  
  // All the URLs to scrape
  const urls = [
    '?seed=2', '?seed=3', '?seed=4', '?seed=5', '?seed=6',
    '?seed=7', '?seed=8', '?seed=9', '?seed=10', '?seed=11'
  ];
  
  const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/';
  
  for (const seed of urls) {
    const page = await browser.newPage();
    console.log(`🕷️  Scraping ${baseUrl}${seed}`);
    
    await page.goto(baseUrl + seed);
    await page.waitForSelector('table');
    
    // Find all table cells with numbers and sum them
    const numbers = await page.$$eval('table td, table th', elements => 
      elements
        .map(el => el.textContent.trim())
        .filter(text => /^\d+(?:\.\d+)?$/.test(text))  // Only numbers
        .map(Number)
    );
    
    const pageSum = numbers.reduce((a, b) => a + b, 0);
    grandTotal += pageSum;
    
    console.log(`✅ Seed ${seed}: ${numbers.length} numbers, sum = ${pageSum.toLocaleString()}`);
    await page.close();
  }
  
  await browser.close();
  
  console.log('\n🎉 GRAND TOTAL SUM OF ALL TABLES:', grandTotal.toLocaleString());
  console.log('📧 23f2005100@ds.study.iitm.ac.in');
  
  return grandTotal;
}

scrapeSums();
