const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

const AUTHOR = "Raphael ilom";
const AUTHOR_HASH = crypto.createHash('sha256').update(AUTHOR).digest('hex');

function verifyAuthor(name) {
  return crypto.createHash('sha256').update(name).digest('hex') === AUTHOR_HASH;
}

module.exports = {
  config: {
    name: "monitor",
    aliases: ["status"],
    version: "2.0",
    author: AUTHOR,
    role: 0,
    shortDescription: {
      en: "Displays the bot's uptime and system info."
    },
    longDescription: {
      en: "Find out how long the bot has been running and view system statistics."
    },
    category: "system",
    guide: {
      en: "Use {p}monitor or {p}uptime to reveal the bot's operational duration and system info."
    }
  },
  onStart: async function ({ api, event, args }) {
    if (!verifyAuthor(this.config.author)) {
      return api.sendMessage("Unauthorized modification detected. Command aborted.", event.threadID, event.messageID);
    }

    try {
      const searchQueries = ["zoro", "madara", "obito", "luffy", "boa", "Goku", "naruto", "sasuke", "itachi", "kakashi"];
      const randomQueryIndex = Math.floor(Math.random() * searchQueries.length);
      const searchQuery = searchQueries[randomQueryIndex];

      const apiUrl = `https://pin-two.vercel.app/pin?search=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);
      const imageLinks = response.data.result;

      const randomImageIndex = Math.floor(Math.random() * imageLinks.length);
      const imageUrl = imageLinks[randomImageIndex];

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'cache', `monitor_${Date.now()}.jpg`);
      await fs.outputFile(imagePath, imageResponse.data);

      const uptime = process.uptime();
      const days = Math.floor(uptime / (24 * 60 * 60));
      const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((uptime % (60 * 60)) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = [
        days && `${days} days`,
        hours && `${hours} hours`,
        minutes && `${minutes} minutes`,
        `${seconds} seconds`
      ].filter(Boolean).join(', ');

      const osInfo = {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        cpuUsage: process.cpuUsage(),
        memoryUsage: process.memoryUsage()
      };

      const message = `🤖 Bot Status Report 🤖

⏱️ Uptime: ${uptimeString}

💻 System Info:
• Platform: ${osInfo.platform}
• Architecture: ${osInfo.arch}
• Node.js Version: ${osInfo.nodeVersion}
• CPU Usage: ${JSON.stringify(osInfo.cpuUsage)}
• Memory Usage: ${Math.round(osInfo.memoryUsage.rss / 1024 / 1024)}MB / ${Math.round(osInfo.memoryUsage.heapTotal / 1024 / 1024)}MB

🔧 Developed by: ${AUTHOR}`;

      const imageStream = fs.createReadStream(imagePath);

      await api.sendMessage({
        body: message,
        attachment: imageStream
      }, event.threadID, event.messageID);

      await fs.unlink(imagePath);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred while fetching system information.`, event.threadID, event.messageID);
    }
  }
};
