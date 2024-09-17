const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "pingy",
    aliases: ["ms", "latency"],
    version: "2.0",
    author: "Raphael ilom",
    role: 0,
    shortDescription: {
      en: "Displays bot's ping and system info"
    },
    longDescription: {
      en: "Displays the current ping of the bot's system along with additional system information and a Goku image."
    },
    category: "System",
    guide: {
      en: "Use {p}pingy to check the bot's ping and system information."
    }
  },
  onStart: async function ({ api, event, args }) {
    const timeStart = Date.now();

    await api.sendMessage("Checking Bot's ping and system info...", event.threadID);

    const ping = Date.now() - timeStart;
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const gokuImageUrl = "https://tiny.one/yv83dua4";
    const imagePath = path.join(__dirname, "goku-image.jpg");

    try {
      const response = await axios.get(gokuImageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(response.data));

      const message = {
        body: `🏓 Pong!\n\n` +
              `📊 System Information:\n` +
              `⏱️ Ping: ${ping}ms\n` +
              `⌛ Uptime: ${formatUptime(uptime)}\n` +
              `💾 Memory Usage: ${formatBytes(memory.rss)}\n` +
              `🖥️ CPU Usage: ${(cpuUsage.user / 1000000).toFixed(2)}s user, ${(cpuUsage.system / 1000000).toFixed(2)}s system`,
        attachment: fs.createReadStream(imagePath)
      };

      await api.sendMessage(message, event.threadID);

      fs.unlinkSync(imagePath);
    } catch (error) {
      api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
  }
};

function formatUptime(uptime) {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkAuthorization() {
  const config = module.exports.config;
  if (config.author !== "Raphael ilom") {
    throw new Error("Unauthorized: Author name has been changed.");
  }
}

checkAuthorization()
