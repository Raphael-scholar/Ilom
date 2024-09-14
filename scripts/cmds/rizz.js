const axios = require('axios');
const crypto = require('crypto');

module.exports = {
  config: {
    name: 'rizz',
    version: '3.2',
    author: 'Raphael scholar',
    countDown: 5,
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Tells a random rizz line with options'
    },
    longDescription: {
      en: 'Fetches a random rizz line from multiple APIs with customization options'
    },
    guide: {
      en: '{pn} rizz [options]\nOptions:\n- category: pickup, compliment, flirt\n- language: en, es, fr\n- target @mention'
    }
  },
  onStart: async function ({ api, event, args }) {
    const authorSignature = '7a28fb5c9c0d227a1f5993b5dda2b72b5e0b046c7590d528b31781f990763813';
    
    const verifyAuthor = () => {
      const currentSignature = crypto.createHash('sha256').update(JSON.stringify(module.exports.config)).digest('hex');
      return currentSignature === authorSignature;
    };

    if (!verifyAuthor()) {
      console.error('Unauthorized modification detected. Command execution aborted.');
      return api.sendMessage('This command is currently unavailable due to an authorization issue.', event.threadID);
    }

    const APIs = {
      pickup: 'https://vinuxd.vercel.app/api/pickup',
      compliment: 'https://complimentr.com/api',
      flirt: 'https://api.pickup-lines.net/v1/random'
    };

    const parseOptions = (args) => {
      const options = {
        category: 'pickup',
        language: 'en',
        target: null
      };

      args.forEach(arg => {
        if (Object.keys(APIs).includes(arg)) options.category = arg;
        if (['en', 'es', 'fr'].includes(arg)) options.language = arg;
        if (arg.startsWith('@')) options.target = arg.slice(1);
      });

      return options;
    };

    const translateText = async (text, targetLang) => {
      if (targetLang === 'en') return text;
      const response = await axios.post('https://libretranslate.de/translate', {
        q: text,
        source: 'en',
        target: targetLang
      });
      return response.data.translatedText;
    };

    const fetchRizzLine = async (category) => {
      const response = await axios.get(APIs[category]);
      switch (category) {
        case 'pickup':
          return response.data.pickup;
        case 'compliment':
          return response.data.compliment;
        case 'flirt':
          return response.data.line;
      }
    };

    try {
      const { category, language, target } = parseOptions(args);
      let rizzLine = await fetchRizzLine(category);
      rizzLine = await translateText(rizzLine, language);

      const mentions = [];
      if (target) {
        const targetUser = await api.getUserInfo(target);
        if (targetUser) {
          const userName = targetUser[target].name;
          rizzLine = `Hey ${userName}, ${rizzLine}`;
          mentions.push({
            tag: userName,
            id: target
          });
        }
      }

      const attachment = await api.sendMessage({
        body: rizzLine,
        mentions: mentions
      }, event.threadID, event.messageID);

      if (!attachment || !attachment.messageID) {
        throw new Error('Failed to send message with rizz line');
      }

      console.log(`Sent ${category} line in ${language} with message ID ${attachment.messageID}`);
    } catch (error) {
      console.error(`Failed to send rizz line: ${error.message}`);
      api.sendMessage('Oops! Something went wrong while trying to deliver a smooth line. Give it another shot!', event.threadID);
    }
  }
};
