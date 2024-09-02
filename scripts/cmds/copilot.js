const fetch = require('node-fetch');

const url = 'https://copilot5.p.rapidapi.com/copilot';
const headers = {
  'x-rapidapi-key': 'e4e32f1f43msh3b9899a4b753cf2p19f034jsn5bc4c1112795',
  'x-rapidapi-host': 'copilot5.p.rapidapi.com',
  'Content-Type': 'application/json'
};

async function fetchFromCopilot(message, conversationId = null, tone = 'BALANCED', markdown = false, photoUrl = null) {
  const body = JSON.stringify({
    message,
    conversation_id: conversationId,
    tone,
    markdown,
    photo_url: photoUrl
  });

  const options = {
    method: 'POST',
    headers,
    body
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching from Copilot:', error);
    throw error;
  }
}

async function getAIResponse(input, userId, messageID) {
  try {
    const result = await fetchFromCopilot(input);
    return { response: result.reply || result.message, messageID };
  } catch (error) {
    return { response: 'Sorry, I could not process your request at the moment.', messageID };
  }
}

const prefixes = ['copilot'];

module.exports = {
  config: {
    name: 'copilot',
    author: 'Raphael scholar',//do not change author name or else you'll be banned from using this script
    role: 0,
    category: 'ai',
    shortDescription: 'Fetch response from Copilot API',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage('Please provide a message to send to Copilot.', event.threadID, event.messageID);
      return;
    }

    try {
      const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
      api.sendMessage(response, event.threadID, messageID);
    } catch (error) {
      api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
    }
  },
  onChat: async function ({ event, message, args }) {
    const messageContent = event.body.trim().toLowerCase();
    if (prefixes.some(prefix => messageContent.startsWith(prefix))) {
      const input = args.join(' ').trim();
      try {
        const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
        message.reply(response, messageID);
      } catch (error) {
        message.reply('An error occurred while processing your request.');
      }
    }
  }
};

// Example call to fetchFromCopilot function
fetchFromCopilot('Hello').then(console.log).catch(console.error);
