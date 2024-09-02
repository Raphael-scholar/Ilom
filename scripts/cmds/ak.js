 module.exports = {
  config: {
    name: "ak",
    aliases: ["💋"],
    version: "1.0",
    author: "Xue Editz",
    countDown: 0,
    role: 0,
    shortDescription: "Send a random kiss gif",
    longDescription: "Send a random kiss gif using the waifu.pics API",
    category: "anime",
    guide: "{p}kiss",
      
  },
  
  onStart: async function ({ event, message, args, api }) {
    const fetch = require('node-fetch');
    const response = await fetch('https://api.waifu.pics/sfw/kiss');
    const data = await response.json();
    const gifUrl = data.url;
    const form = {
      body: gifUrl,
      attachment: await global.utils.getStreamFromURL(gifUrl),
      mentions: [{
        tag: "Raphael",
        id: "61553871285563"
      }]
    }
    message.reply(form);
  }
}
