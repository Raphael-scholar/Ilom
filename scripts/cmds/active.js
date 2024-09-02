const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  const services = [
    { url: 'https://soyeon-api.onrender.com', params: { prompt: input, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
    { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = "Bot is active and ready to assist you!";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

const prefixes = ['active'];

module.exports = {
  config: {
    name: 'active',
    author: 'Raphael scholar',
    role: 0,
    category: 'utility',
    shortDescription: 'Check if the bot is active',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      const audioPath = path.join(__dirname, 'audio', 'https://tinyurl.com/2apdrg63');
      const audioExists = fs.existsSync(audioPath);

      if (audioExists) {
        api.sendMessage({
          body: `Bot is active and ready to assist you!`,
          attachment: fs.createReadStream(audioPath)
        }, event.threadID, event.messageID);
      } else {
        api.sendMessage(`Bot is active and ready to assist you!`, event.threadID, event.messageID);
      }
      return;
    }

    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
    api.sendMessage(`${response}`, event.threadID, messageID);
  },
  onChat: async function ({ event, message, args }) {
    const messageContent = event.body.trim().toLowerCase();
    if (prefixes.some(prefix => messageContent.startsWith(prefix))) {
      const input = args.join(" ").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      const audioPath = path.join(__dirname, 'audio', 'https://tinyurl.com/2apdrg63');
      const audioExists = fs.existsSync(audioPath);

      if (audioExists) {
        message.reply({
          body: `${response}`,
          attachment: fs.createReadStream(audioPath)
        }, messageID);
      } else {
        message.reply(`${response}`, messageID);
      }
    }
  }
};
