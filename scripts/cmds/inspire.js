const axios = require('axios');

const API_NINJAS_KEY = 'L7s+MIx6b6kGS4TVz11iyg==hgU2HWsYxZJdNn06';

async function getQuote(apiChoice) {
  let url;
  switch (apiChoice) {
    case 'quotable':
      url = 'https://api.quotable.io/random?tags=inspirational';
      break;
    case 'theySaidSo':
      url = 'https://quotes.rest/qod?category=inspire';
      break;
    case 'forismatic':
      url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';
      break;
    case 'apiNinjas':
      url = 'https://api.api-ninjas.com/v1/quotes?category=inspirational';
      break;
    case 'paperQuotes':
      url = 'https://api.paperquotes.com/apiv1/quotes/?tags=inspirational';
      break;
    default:
      url = 'https://api.quotable.io/random?tags=inspirational';
  }

  try {
    const response = await axios.get(url, {
      headers: apiChoice === 'apiNinjas' ? { 'X-Api-Key': API_NINJAS_KEY } : {}
    });
    if (apiChoice === 'theySaidSo') {
      return response.data.contents.quotes[0].quote;
    } else if (apiChoice === 'forismatic') {
      return response.data.quoteText;
    } else if (apiChoice === 'apiNinjas') {
      return response.data[0].quote;
    } else if (apiChoice === 'paperQuotes') {
      return response.data.results[0].quote;
    } else {
      return `${response.data.content} — ${response.data.author}`;
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    return 'Sorry, I couldn\'t fetch a quote at the moment.';
  }
}

module.exports = {
  config: {
    name: 'inspire',
    author: 'Raphael',
    role: 0,
    category: 'motivation',
    shortDescription: 'Get a random inspirational quote',
    usage: '-Cmd inspire [apiChoice]',
  },
  onStart: async function ({ api, event, args }) {
    // Ensure the author name is not changed
    if (module.exports.config.author !== 'Raphael') {
      api.sendMessage('Unauthorized modification detected. The script will not run.', event.threadID, event.messageID);
      return;
    }

    const apiChoice = args[0] || 'quotable';
    const inspiration = await getQuote(apiChoice);
    api.sendMessage(`Here's some inspiration for you:\n\n${inspiration}`, event.threadID, event.messageID);
  }
};
