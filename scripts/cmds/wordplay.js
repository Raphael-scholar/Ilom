const axios = require('axios');

const gameTypes = ['anagram', 'rhyme', 'define', 'synonym', 'antonym', 'acronym'];

function shuffleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

function generateAcronym(phrase) {
  return phrase.split(' ').map(word => word[0].toUpperCase()).join('');
}

async function fetchWordData(word, type) {
  try {
    const response = await axios.get(`https://api.datamuse.com/words?${type}=${word}&max=10`);
    return response.data.map(item => item.word);
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error.message);
    return [];
  }
}

async function fetchDefinition(word) {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const definition = response.data[0].meanings[0].definitions[0].definition;
    return definition;
  } catch (error) {
    console.error('Error fetching definition:', error.message);
    return "Definition not found.";
  }
}

module.exports = {
  config: {
    name: "wordplay",
    version: "1.0",
    author: "Raphael Ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Word games and utilities",
    longDescription: {
      en: "Play various word games or get word information. Includes anagrams, rhymes, definitions, synonyms, antonyms, and acronym generation."
    },
    category: "Fun",
    guide: {
      en: "{prefix}wordplay <game> <word/phrase>\nAvailable games: anagram, rhyme, define, synonym, antonym, acronym"
    }
  },

  onStart: async function({ api, event, args }) {
    const [gameType, ...wordArgs] = args;
    const word = wordArgs.join(' ');

    if (!gameType || !word || !gameTypes.includes(gameType)) {
      return api.sendMessage(`Invalid command. Usage: {prefix}wordplay <game> <word/phrase>\nAvailable games: ${gameTypes.join(', ')}`, event.threadID, event.messageID);
    }

    let response = '';

    switch (gameType) {
      case 'anagram':
        response = `Anagram for "${word}": ${shuffleWord(word)}`;
        break;
      case 'rhyme':
        const rhymes = await fetchWordData(word, 'rel_rhy');
        response = rhymes.length > 0 ? `Words that rhyme with "${word}": ${rhymes.join(', ')}` : `No rhymes found for "${word}".`;
        break;
      case 'define':
        const definition = await fetchDefinition(word);
        response = `Definition of "${word}": ${definition}`;
        break;
      case 'synonym':
        const synonyms = await fetchWordData(word, 'rel_syn');
        response = synonyms.length > 0 ? `Synonyms for "${word}": ${synonyms.join(', ')}` : `No synonyms found for "${word}".`;
        break;
      case 'antonym':
        const antonyms = await fetchWordData(word, 'rel_ant');
        response = antonyms.length > 0 ? `Antonyms for "${word}": ${antonyms.join(', ')}` : `No antonyms found for "${word}".`;
        break;
      case 'acronym':
        response = `Acronym for "${word}": ${generateAcronym(word)}`;
        break;
    }

    api.sendMessage(response, event.threadID, event.messageID);
  }
};
