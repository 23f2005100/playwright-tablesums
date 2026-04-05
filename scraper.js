const { chromium } = require('playwright');

async function scrapeSums() {
  const browser = await chromium.launch({ headless: false });  // See browser in CI
  let grandTotal = 0;
  
  const urls = [
    '?seed=2', '?seed=3', '?seed=4', '?seed=5', '?seed=6',
    '?seed=7', '?seed=8', '?seed=9', '?seed=10', '?seed=11'
  ];
  
  const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/';
  
  for (const seed of urls) {
    const page = await browser.newPage();
    await page.goto(baseUrl + seed, { waitUntil: 'networkidle' });  // Wait JS fully loads
    
    // Wait extra for tables/charts
    await page.waitForTimeout(3000);
    await page.waitForSelector('table', { timeout: 10000 }) || console.log('⚠️ No table selector');
    
    // GRAB ALL text on page, extract EVERY number (td, th, spans, divs)
    const allText = await page.evaluate(() => document.body.innerText);
    const numbers = allText
      .split(/\s+/)
      .filter(text => /^-?\d+(?:\.\d+)?(?:,\d{3})*(?:\.?\d*)?$/.test(text))  // All number formats
      .map(n => parseFloat(n.replace(/,/g, '')))
      .filter(n => !isNaN(n) && n !== 0);
    
    const pageSum = numbers.reduce((a, b) => a + b, 0);
    grandTotal += pageSum;
    
    console.log(`\n🕷️  SEED ${seed.slice(1)}:`);
    console.log(`📊 Found ${numbers.length} numbers`);
    console.log(`💰 Page sum: ${pageSum.toLocaleString()}`);
    console.log(`📈 Sample: ${numbers.slice(0,5).join(', ')}...`);
    
    await page.screenshot({ path: `seed-${seed.slice(1)}.png` });
    await page.close();
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 GRAND TOTAL SUM OF ALL TABLES ACROSS ALL SEEDS: ' + grandTotal.toLocaleString());
  console.log('🎉 GRAND TOTAL SUM OF ALL TABLES ACROSS ALL SEEDS: ' + grandTotal.toLocaleString());
  console.log('📧 23f2005100@ds.study.iitm.ac.in');
  console.log('🎉 GRAND TOTAL SUM OF ALL TABLES ACROSS ALL SEEDS: ' + grandTotal.toLocaleString());
  console.log('=' .repeat(50));
  
  await browser.close();
}

scrapeSums().catch(console.error);
