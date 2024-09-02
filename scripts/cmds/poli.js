const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "poli",
  version: "1.1.0",
  hasPermission: 0,
  credits: "Raphael scholar × shota Akiro (Enhanced by Assistant)",
  description: "Generate image from Pollinations AI with advanced options",
  usePrefix: true,
  commandCategory: "image",
  usages: "[query] | [options]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  
  // Parse arguments
  const [query, ...options] = args.join(" ").split("|").map(arg => arg.trim());
  
  if (!query) {
    return api.sendMessage("Please provide a text query for image generation.", threadID, messageID);
  }

  // Parse options
  const parsedOptions = parseOptions(options);

  api.sendMessage("Generating image, please wait...", threadID, messageID);

  try {
    const imagePath = path.join(__dirname, 'cache', `poli_${threadID}.png`);
    const imageUrl = buildImageUrl(query, parsedOptions);
    
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));

    await api.sendMessage(
      {
        body: `Here's the generated image for: "${query}"\nOptions: ${formatOptions(parsedOptions)}`,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      () => fs.unlink(imagePath),
      messageID
    );
  } catch (error) {
    console.error("Error generating image:", error);
    api.sendMessage("An error occurred while generating the image. Please try again later.", threadID, messageID);
  }
};

function parseOptions(options) {
  const defaultOptions = {
    width: 512,
    height: 512,
    seed: Math.floor(Math.random() * 1000000),
    style: "default"
  };

  options.forEach(option => {
    const [key, value] = option.split("=");
    if (key && value) {
      defaultOptions[key.toLowerCase()] = value;
    }
  });

  return defaultOptions;
}

function buildImageUrl(query, options) {
  const baseUrl = "https://image.pollinations.ai/prompt/";
  const encodedQuery = encodeURIComponent(query);
  const params = new URLSearchParams({
    width: options.width,
    height: options.height,
    seed: options.seed,
    style: options.style
  });

  return `${baseUrl}${encodedQuery}?${params.toString()}`;
}

function formatOptions(options) {
  return Object.entries(options)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}
