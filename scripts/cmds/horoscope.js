const axios = require('axios');

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

module.exports = {
  config: {
    name: "horoscope",
    version: "1.1",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Get the daily horoscope for a specified zodiac sign.",
    longDescription: {
      en: "This command allows you to get the daily horoscope for a specified zodiac sign. You can also get a random horoscope or view all zodiac signs."
    },
    category: "Fun",
    guide: {
      en: "{prefix}horoscope <zodiac sign | random | list>"
    }
  },

  onStart: async function({ api, event, args }) {
    const input = args.join(' ').toLowerCase();

    if (!input) {
      return api.sendMessage("Please provide a zodiac sign, 'random', or 'list'.", event.threadID, event.messageID);
    }

    if (input === 'list') {
      return api.sendMessage(`Available zodiac signs: ${zodiacSigns.join(', ')}`, event.threadID, event.messageID);
    }

    let sign = input;
    if (input === 'random') {
      sign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
    }

    if (!zodiacSigns.includes(sign)) {
      return api.sendMessage(`Invalid zodiac sign. Type '${this.config.name} list' to see all available signs.`, event.threadID, event.messageID);
    }

    try {
      const response = await axios.post(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`);
      const { description, current_date, compatibility, mood, color, lucky_number, lucky_time } = response.data;

      const horoscopeMessage = `
🔮 Horoscope for ${sign.charAt(0).toUpperCase() + sign.slice(1)} (${current_date}):

${description}

Compatibility: ${compatibility}
Mood: ${mood}
Color: ${color}
Lucky Number: ${lucky_number}
Lucky Time: ${lucky_time}
      `.trim();

      api.sendMessage(horoscopeMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error(`Error fetching horoscope: ${error.message}`);
      api.sendMessage("An error occurred while fetching the horoscope. Please try again later.", event.threadID, event.messageID);
    }
  }
};
