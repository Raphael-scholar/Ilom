const axios = require('axios');

module.exports = {
  config: {
    name: "motivation",
    version: "1.0",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Send a random motivational quote.",
    longDescription: {
      en: "This command allows you to send a random motivational quote."
    },
    category: "Fun",
    guide: {
      en: "{prefix}motivation"
    }
  },

  onStart: async function({ api, event }) {
    try {
      const response = await axios.get('https://type.fit/api/quotes');
      const quotes = response.data;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const message = `"${randomQuote.text}" - ${randomQuote.author || 'Unknown'}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(`Error fetching motivational quote: ${error.message}`);
      api.sendMessage("An error occurred while fetching the motivational quote.", event.threadID, event.messageID);
    }
  }
};
