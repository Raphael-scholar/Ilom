const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TINYURL_API_KEY = 'goZ66KEqK7xxt7gGJaTcFo0K89McxwZ7c4bucA2ZYuZLT25I9zgErEpLy8qj';

async function shortenURL(url) {
  try {
    const response = await axios.post('https://api.tinyurl.com/create', {
      url: url,
      domain: 'tiny.one'
    }, {
      headers: {
        Authorization: `Bearer ${TINYURL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data.tiny_url;
  } catch (error) {
    console.error(`Error shortening URL: ${error.message}`);
    return null;
  }
}

async function downloadFile(url, fileName) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(fileName);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

module.exports = {
  config: {
    name: "link",
    version: "1.3",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Fetch, shorten, and download media URLs.",
    longDescription: {
      en: "Fetch, shorten, and download image, audio, and video URLs using TinyURL.",
    },
    category: "media",
    guide: {
      en: "{prefix}link <reply with img or vid> [download]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { messageReply } = event;

    if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length !== 1) {
      return api.sendMessage("Please reply to a single image, audio, or video attachment.", event.threadID, event.messageID);
    }

    const attachment = messageReply.attachments[0];
    const url = attachment.url;

    try {
      const shortURL = await shortenURL(url);
      if (shortURL) {
        let message = `Here's your requested URL: ${shortURL}`;

        if (args[0] === "download") {
          const fileName = `download_${Date.now()}${path.extname(url)}`;
          await downloadFile(url, fileName);
          message += `\n\nFile downloaded as: ${fileName}`;
        }

        api.sendMessage(message, event.threadID, event.messageID);

        if (args[0] === "download") {
          api.sendMessage(
            { attachment: fs.createReadStream(fileName) },
            event.threadID,
            () => fs.unlinkSync(fileName)
          );
        }
      } else {
        api.sendMessage("Failed to shorten the URL.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
  }
};
