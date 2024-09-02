const axios = require('axios');

module.exports = {
  config: {
    name: "crypto",
    version: "1.0",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Get the current price of a specified cryptocurrency.",
    longDescription: {
      en: "This command allows you to get the current price of a specified cryptocurrency."
    },
    category: "Utility",
    guide: {
      en: "{prefix}crypto <symbol>"
    }
  },

  onStart: async function({ api, event, args }) {
    const symbol = args[0];
    if (!symbol) {
      return api.sendMessage("Please provide a cryptocurrency symbol (e.g., BTC, ETH).", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
      const price = response.data[symbol].usd;
      api.sendMessage(`The current price of ${symbol.toUpperCase()} is $${price}`, event.threadID, event.messageID);
    } catch (error) {
      console.error(`Error fetching cryptocurrency price: ${error.message}`);
      api.sendMessage("An error occurred while fetching the cryptocurrency price.", event.threadID, event.messageID);
    }
  }
};
