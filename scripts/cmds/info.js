const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const NepaliDate = require('nepali-date');
const fast = require('fast-speedtest-api');
const crypto = require('crypto');

const AUTHOR = "Raphael ilom";
const AUTHOR_HASH = crypto.createHash('sha256').update(AUTHOR).digest('hex');

function verifyAuthor(name) {
  return crypto.createHash('sha256').update(name).digest('hex') === AUTHOR_HASH;
}

async function getGokuImage() {
  const fallbackImages = [
    'https://i.imgur.com/1234567.jpg',
    'https://i.imgur.com/2345678.jpg',
    'https://i.imgur.com/3456789.jpg'
  ];
  try {
    const response = await axios.get('https://api.jikan.moe/v4/characters/246/pictures', { timeout: 5000 });
    const images = response.data.data;
    return images[Math.floor(Math.random() * images.length)].jpg.image_url;
  } catch (error) {
    console.error('Error fetching Goku image:', error);
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
}

async function getCryptoPrice(coin) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`, { timeout: 5000 });
    return response.data[coin].usd;
  } catch (error) {
    console.error(`Error fetching ${coin} price:`, error);
    return 'N/A';
  }
}

module.exports = {
  config: {
    name: "info",
    aliases: ['info', 'owner'],
    version: "2.1",
    author: AUTHOR,
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with a Goku image."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin along with a Goku image."
    },
    category: "utility",
    guide: {
      en: "{pn}"
    },
    envConfig: {}
  },

  onStart: async function ({ message, api, event, usersData, threadsData }) {
    if (!verifyAuthor(this.config.author)) {
      return message.reply("Unauthorized modification detected. Command aborted.");
    }

    const timeStart = Date.now();

    try {
      const [allUsers, allThreads, speedTestResult, gokuImageUrl] = await Promise.all([
        usersData.getAll(),
        threadsData.getAll(),
        new fast({
          token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
          verbose: false,
          timeout: 10000,
          https: true,
          urlCount: 5,
          bufferSize: 8,
          unit: fast.UNITS.Mbps
        }).getSpeed(),
        getGokuImage()
      ]);

      const botName = global.GoatBot.config.nickNameBot;
      const botPrefix = global.GoatBot.config.prefix;
      const authorName = global.GoatBot.config.authorName;
      const authorFB = global.GoatBot.config.authorFB;
      const authorInsta = "https://www.instagram.com/isaiahraphael606?igsh=MjQwMjNqejN1cWc4";
      const authorEmail = global.GoatBot.config.authorEmail;
      const authorGithub = "https://github.com/Isaiah-ilom";
      const status = "𝙎𝙞𝙣𝙜𝙡𝙚";

      const now = moment().tz('Asia/Dhaka');
      const date = now.format('MMMM Do YYYY');
      const time = now.format('h:mm:ss A');

      const uptime = process.uptime();
      const uptimeString = formatUptime(uptime);

      const ping = Date.now() - timeStart;

      const [btcPrice, ethPrice] = await Promise.all([
        getCryptoPrice('bitcoin'),
        getCryptoPrice('ethereum')
      ]);

      const replyMessage = `===「 Bot & Owner Info 」===
❏ Bot Name: ${botName}
❏ Bot Prefix: ${botPrefix}
❏ Author Name: ${authorName}
❏ FB: ${authorFB}
❏ Instagram: ${authorInsta}
❏ Author Email: ${authorEmail}
❏ Author Github: ${authorGithub}
❏ Status: ${status}
❏ Date: ${date}
❏ Total Threads: ${allThreads.length}
❏ Total Users: ${allUsers.length}
❏ Time: ${time}
❏ Bot Running: ${uptimeString}
❏ Bot's Speed: ${speedTestResult.toFixed(2)} MBPS
❏ Ping: ${ping}ms
❏ Bitcoin Price: $${btcPrice}
❏ Ethereum Price: $${ethPrice}
=====================`;

      const attachment = await global.utils.getStreamFromURL(gokuImageUrl);
      message.reply({
        body: replyMessage,
        attachment
      });
    } catch (error) {
      console.error('Error in info command:', error);
      message.reply("An error occurred while fetching information. Please try again later.");
    }
  },

  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "info") {
      await this.onStart({ message });
    }
  }
};

function formatUptime(uptime) {
  const seconds = Math.floor(uptime % 60);
  const minutes = Math.floor((uptime / 60) % 60);
  const hours = Math.floor((uptime / (60 * 60)) % 24);
  const days = Math.floor(uptime / (60 * 60 * 24));

  const uptimeString = [];
  if (days > 0) uptimeString.push(`${days}d`);
  if (hours > 0) uptimeString.push(`${hours}h`);
  if (minutes > 0) uptimeString.push(`${minutes}min`);
  if (seconds > 0) uptimeString.push(`${seconds}sec`);

  return uptimeString.join(" ");
    }
