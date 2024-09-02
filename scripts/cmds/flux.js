const axios = require('axios');

module.exports = {
  config: {
    name: "flux",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    shortDescription: "anime image generator",
    longDescription: "",
    category: "𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ message, args }) {
    let prompt = args.join(" ");

    try {
      const apiUrl = `https://samirxzy.onrender.com/flux?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, { responseType: 'stream' });

      if (!response.data) {
        return message.reply("Failed to retrieve image.");
      }

      return message.reply({
        body: '',
        attachment: response.data
      });
    } catch (error) {
      console.error(error);
      return message.reply("Failed to retrieve image.");
    }
  }
};
