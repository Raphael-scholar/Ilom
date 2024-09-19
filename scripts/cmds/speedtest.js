const fast = require('fast-speedtest-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "speedtest",
    aliases: ["speed", "internet", "netspeed"],
    version: "2.1",
    author: "Raphael ilom",
    countDown: 60,
    role: 2,
    shortDescription: "Check internet speed",
    longDescription: "Check internet speed and display results with a Goku image",
    category: "system",
    guide: "{pn}"
  },
  onStart: async function ({ api, event }) {
    const timeStart = Date.now();
    await api.sendMessage("🏃‍♂️ Running speed test...", event.threadID);

    try {
      const speedTest = new fast({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false,
        timeout: 10000,
        https: true,
        urlCount: 5,
        bufferSize: 8,
        unit: fast.UNITS.Mbps
      });

      const downloadSpeed = await speedTest.getSpeed();
      const uploadSpeed = await speedTest.getSpeed({ direction: "upload" });

      const gokuImageUrl = "https://tiny.one/2p8xftbk";
      const imagePath = path.join(__dirname, "goku-speedtest.jpg");

      const imageResponse = await axios.get(gokuImageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

      const cpuUsage = process.cpuUsage();
      const memoryUsage = process.memoryUsage();

      let resultMessage = "🚀 Speed Test Results:\n\n";
      resultMessage += `📥 Download: ${downloadSpeed.toFixed(2)} Mbps\n`;
      resultMessage += `📤 Upload: ${uploadSpeed.toFixed(2)} Mbps\n`;
      resultMessage += `\n💻 System Info:\n`;
      resultMessage += `CPU Usage: ${(cpuUsage.user / 1000000).toFixed(2)}s user, ${(cpuUsage.system / 1000000).toFixed(2)}s system\n`;
      resultMessage += `Memory Usage: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\n`;
      resultMessage += `\n⏱️ Test Duration: ${((Date.now() - timeStart) / 1000).toFixed(2)}s`;

      await api.sendMessage({ body: resultMessage, attachment: fs.createReadStream(imagePath) }, event.threadID);

      fs.unlinkSync(imagePath);
    } catch (error) {
      api.sendMessage(`❌ An error occurred during the speed test: ${error.message}`, event.threadID);
    }
  }
};

function checkAuthorization() {
  const config = module.exports.config;
  if (config.author !== "Raphael ilom") {
    throw new Error("Unauthorized: Author name has been changed.");
  }
}

checkAuthorization();
