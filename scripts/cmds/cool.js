const axios = require("axios");

module.exports = {
  config: {
    name: "cool",
    version: "1.0",
    author: "Raphael ilom",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "Text to Image"
    },
    category: "image",
    guide: {
      en: "{pn} prompt"
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("😡 Please provide a prompt");
    }
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    const startTime = Date.now();
    message.reply("✅| Generating, please wait.", async (err, reply) => {
      try {
        const url = `https://smfahim.onrender.com/sdxl?prompt=${encodeURIComponent(prompt)}`;
        const imageStream = await global.utils.getStreamFromURL(url);
        const elapsedTime = (Date.now() - startTime) / 1000;
        const response = {
          body: `Here is your image 🥰\nTime taken: ${elapsedTime} seconds`,
          attachment: imageStream
        };
        message.reply(response);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      } catch (error) {
        console.error(error);
        message.reply("😔 Something went wrong, please try again later.");
        api.setMessageReaction("❌", event.messageID, () => {}, true);
      }
    });
  }
};
