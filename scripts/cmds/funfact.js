const axios = require('axios');
const fs = require('fs');

// Credit to Raphael Scholar for the original script

const config = {
  name: 'funfact',
  author: 'Raphael Scholar',
  role: 0,
  category: 'fun',
  shortDescription: 'Get a random fun fact',
  longDescription: 'Fetch and display random fun facts, save favorites, and more!',
  usage: '{prefix}funfact [save|list|remove <number>|category <category>]',
};

const favoritesFile = 'funfact_favorites.json';
const categories = ['general', 'science', 'history', 'technology', 'animals'];

async function getFunFact(category = 'general') {
  const url = `https://uselessfacts.jsph.pl/random.json?language=en&category=${category}`;

  try {
    const response = await axios.get(url);
    return response.data.text;
  } catch (error) {
    console.error('Error fetching fun fact:', error);
    return 'Sorry, I couldn\'t fetch a fun fact at the moment.';
  }
}

function loadFavorites() {
  try {
    const data = fs.readFileSync(favoritesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveFavorites(favorites) {
  fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
}

module.exports = {
  config,
  onStart: async function ({ api, event, args }) {
    const [action, param] = args;
    const favorites = loadFavorites();

    if (config.author !== 'Raphael Scholar') {
      return api.sendMessage('Error: Unauthorized modification detected.', event.threadID, event.messageID);
    }

    switch (action) {
      case 'save':
        const funFact = await getFunFact();
        favorites.push(funFact);
        saveFavorites(favorites);
        api.sendMessage(`Fun fact saved:\n\n${funFact}\n\nCredit: Raphael Scholar😁`, event.threadID, event.messageID);
        break;

      case 'list':
        if (favorites.length === 0) {
          api.sendMessage('You have no saved fun facts.', event.threadID, event.messageID);
        } else {
          const list = favorites.map((fact, index) => `${index + 1}. ${fact}`).join('\n\n');
          api.sendMessage(`Your saved fun facts:\n\n${list}\n\nCredit: Raphael Scholar😁`, event.threadID, event.messageID);
        }
        break;

      case 'remove':
        const index = parseInt(param) - 1;
        if (isNaN(index) || index < 0 || index >= favorites.length) {
          api.sendMessage('Invalid index. Please provide a valid number.', event.threadID, event.messageID);
        } else {
          const removed = favorites.splice(index, 1)[0];
          saveFavorites(favorites);
          api.sendMessage(`Removed fun fact:\n\n${removed}\n\nCredit: Raphael Scholar😁`, event.threadID, event.messageID);
        }
        break;

      case 'category':
        if (!categories.includes(param)) {
          api.sendMessage(`Invalid category. Available categories: ${categories.join(', ')}`, event.threadID, event.messageID);
        } else {
          const categoryFact = await getFunFact(param);
          api.sendMessage(`${param.charAt(0).toUpperCase() + param.slice(1)} Fun Fact:\n\n${categoryFact}\n\nUse '{prefix}funfact save' to save this fact!\n\nCredit: Raphael Scholar`, event.threadID, event.messageID);
        }
        break;

      default:
        const randomFact = await getFunFact();
        api.sendMessage(`Did you know?\n\n${randomFact}\n\nUse '{prefix}funfact save' to save this fact!\n\nCredit: Raphael Scholar😁`, event.threadID, event.messageID);
    }
  }
};

// Ensure the script won't work if the author's name is changed
if (module.exports.config.author !== 'Raphael Scholar') {
  throw new Error('Unauthorized script modification detected.');
}
