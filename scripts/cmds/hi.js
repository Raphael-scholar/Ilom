const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "hi",
    version: "1.3",
    author: "Raphael Ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Hii",
    longDescription: "Auto bot reply to your message",
    category: "no prefix",
  },

  onStart: async function() {
    console.log('Command "menyapa" has started.');
  },

  onChat: async function({ event, message, getLang, api }) {
    if (event.body) {
      const word = event.body.toLowerCase();
      const triggerWords = ["hi", "hello", "hey", "hiya", "greetings", "salutations", "howdy"];
      const replies = [
        "𝗛𝗲𝘆 𝗕𝗮𝗸𝗮 𝗛𝗮𝘃𝗲 𝗔 𝗪𝗼𝗻𝗱𝗲𝗿𝗳𝘂𝗹 𝗗𝗮𝘆🙂",
        "Hello! How can I assist you today? 😊",
        "Hey there! What's up? 👋",
        "Hi! Hope you're having a great day! 🌟",
        "Greetings! How are you doing today? 🤗",
        "Hiya! Anything exciting happening? 😃",
        "Hello! Need any help? 🛠",
        "Hey! What's new with you? 📰"
      ];

      if (triggerWords.includes(word)) {
        api.setMessageReaction("💗", event.messageID, event.messageID, api);
        const randomIndex = Math.floor(Math.random() * replies.length);
        message.reply({
          body: replies[randomIndex],
        });
      }
    }
  },
};
