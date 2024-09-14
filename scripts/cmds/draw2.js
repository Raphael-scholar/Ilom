const axios = require("axios");

 module.exports = {
  config: {
    name: "draw2",
    version: "1.1",
    author: "OtinXSandip",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "image",
    guide: {
      en: `{pn} your prompt `
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');

    if (!text) {
      return message.reply("😡Please provide a prompt with models");
    }


    const baseURL = `https://ashbina.onrender.com/gen2?prompt=${text}`;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    message.reply("✅| Generating please wait.", async (err, info) => {
      message.reply({
        attachment: await global.utils.getStreamFromURL(baseURL)
      });
      let ui = info.messageID;
      message.unsend(ui);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  }
};￼Enter
