const fs = require('fs');

const html = fs.readFileSync('C:/Users/samue/Downloads/ReviewTap_100_Hitlist.html', 'utf8');

const prospects = [];
// Extract cards using regex
const cardRegex = /<div class="prospect-card".*?>([\s\S]*?)<!-- End Card -->|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
// Actually, regexing HTML is fragile. Let's use string splitting.
const cards = html.split('<div class="prospect-card"');
cards.shift(); // remove everything before first card

for (let i = 0; i < cards.length; i++) {
  const cardHtml = cards[i];
  
  const titleMatch = cardHtml.match(/<h3.*?>([\s\S]*?)<\/h3>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : 'Unknown';
  
  const rankMatch = cardHtml.match(/<div class="rank-badge">#(.*?)<\/div>/);
  const rank = rankMatch ? parseInt(rankMatch[1]) : i + 1;
  
  const spendMatch = cardHtml.match(/<div class="spend-badge">(.*?)<\/div>/);
  const spend = spendMatch ? spendMatch[1].trim() : 'R0';

  const nameMatch = cardHtml.match(/<td class="lbl">Name<\/td><td>(.*?)<\/td>/);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';

  const emailMatch = cardHtml.match(/<td class="lbl">Email<\/td><td>([\s\S]*?)<\/td>/);
  const email = emailMatch ? emailMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';
  
  const locationMatch = cardHtml.match(/<td class="lbl">Location<\/td><td>(.*?)<\/td>/);
  const location = locationMatch ? locationMatch[1].trim() : '';

  const ordersMatch = cardHtml.match(/<td class="lbl">Orders<\/td><td>(.*?)<\/td>/);
  const orders = ordersMatch ? ordersMatch[1].trim() : '';

  const urlMatch = cardHtml.match(/<td class="lbl">URL<\/td><td>([\s\S]*?)<\/td>/);
  const url = urlMatch ? urlMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';

  const noteMatch = cardHtml.match(/<div class="audit-note">([\s\S]*?)<\/div>/);
  const note = noteMatch ? noteMatch[1].trim() : '';

  const emailDraftMatch = cardHtml.match(/<div class="email-body">([\s\S]*?)<\/div>/);
  const emailDraft = emailDraftMatch ? emailDraftMatch[1].replace(/<br>/g, '\n').trim() : '';

  // Just push these
  prospects.push({
    id: rank,
    title,
    spend,
    name,
    email,
    location,
    orders,
    url,
    note,
    emailDraft
  });
}

fs.writeFileSync('./src/data/hitlist.json', JSON.stringify(prospects, null, 2));
console.log(`Parsed ${prospects.length} prospects to src/data/hitlist.json`);
