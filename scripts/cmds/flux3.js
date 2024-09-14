const axios = require("axios");

module.exports = {
  config: {
    name: "flux3",
    version: "1.1",
    author: "Fahim_Noob",
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    category: "image",
    guide: {
      en: `{pn} your prompt | type models here are \n
1 | dev
2 | schnell`
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');

    if (!text) {
      return message.reply("Please provide a prompt with models");
    }

    const startTime = new Date().getTime();

    const [prompt, model] = text.split('|').map((text) => text.trim());
    
    const modelMap = {
      '1': 'dev',
      '2': 'schnell'
    };
    const selectedModel = modelMap[model] || modelMap['1'];
    
    const puti = 'xyz';
    let baseURL = `https://smfahim.${puti}/flux3?prompt=${encodeURIComponent(prompt)}&model=${selectedModel}`;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const response = await axios.get(baseURL, { responseType: 'stream' });
      const attachment = response.data;

      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      await message.reply({
        body: `Here is your imagination 🥰\nTime taken: ${timeTaken} seconds`,
        attachment: attachment
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error('Error fetching image:', error);
      message.reply("Failed to generate image. Please try again.");
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};￼Enter
