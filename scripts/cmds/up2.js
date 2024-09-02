const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "up2",
    aliases: ["up2"],
    version: "1.0",
    author: "Rômeo", //Don't change Author 
    role: 0,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for."
    },
    category: "system",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot."
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      // Calculate uptime
      const uptime = process.uptime();
      const secondsLeft = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime / 60) % 60);
      const hours = Math.floor((uptime / (60 * 60)) % 24);
      const days = Math.floor(uptime / (60 * 60 * 24));
      const uptimeString = `${days} 𝙳𝚊𝚢𝚜 ${hours} 𝙷𝚘𝚞𝚛𝚜 ${minutes} 𝙼𝚒𝚗𝚞𝚝𝚎𝚜 ${secondsLeft} 𝚂𝚎𝚌𝚘𝚗𝚍𝚜`;

      // Bot information
      const botname = "  Raphael's Bot"; // Replace with your actual bot name
      const insta = "Isaiahraphael606"; // Replace with your Instagram handle
      const github = "Isaiah-ilom"; // Replace with your GitHub handle
      const fb = "Raphael scholar"; // Replace with your Facebook handle

      // Prepare the API URL for image generation
      const apiUrl = `https://deku-rest-api.gleeze.com/canvas/uptime?id=4&instag=${insta}&ghub=${github}&fb=${fb}&hours=${hours}&minutes=${minutes}&seconds=${secondsLeft}&botname=${botname}`;

      
      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const attachmentPath = path.join(tempDir, `uptime_${event.senderID}.png`);

      // Fetch the image from the API
      const response = await axios.get(apiUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(attachmentPath);
      response.data.pipe(writer);

  
      writer.on('finish', async () => {
        const message = `𝗛𝗲𝗹𝗹𝗼 𝗠𝗮𝘀𝘁𝗲𝗿~ 🐼,\n\n 🫶 𝙔𝙤𝙪𝙧 𝙗𝙤𝙩 𝙞𝙨 𝙧𝙪𝙣𝙣𝙞𝙣𝙜 𝙛𝙧𝙤𝙢\n\n ${uptimeString}.`;

        await api.sendMessage({
          body: message,
          attachment: fs.createReadStream(attachmentPath)
        }, event.threadID, () => {
          fs.unlinkSync(attachmentPath);
        });
      });

      // Handle errors during the writing process
      writer.on('error', (err) => {
        console.error("Error writing the file:", err);
        api.sendMessage("Unable to retrieve uptime image. Error: " + err.message, event.threadID);
      });

    } catch (error) {
      console.error("Error in uptime command:", error);
      api.sendMessage("Unable to display uptime information.", event.threadID);
    }
  }
};
