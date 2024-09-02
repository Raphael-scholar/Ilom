const express = require('express');
const bodyParser = require('body-parser');
const { sendQuestion } = require('./quizzy');

const app = express();
const port = process.env.PORT || 3000;
const prefix = '-'; // Change this to your bot's prefix

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { message, sender } = req.body;

  if (message.startsWith(prefix)) {
    const command = message.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

    if (command === 'quizzy') {
      await sendQuestion(sender, sendMessage);
    }
  }

  res.sendStatus(200);
});

function sendMessage(sender, message) {
  // Replace with your Messenger API call
  console.log(`Sending message to ${sender}:`, message);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Module configuration
module.exports = {
  config: {
    name: "quizzy",
    aliases: [],
    version: "1.0",
    author: "Raphael scholar",//authorized author ,do not change
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Trò chơi đố vui",
      en: "Quiz game"
    },
    longDescription: {
      vi: "Trò chơi đố vui với các câu hỏi và lựa chọn",
      en: "Quiz game with questions and options"
    },
    category: "game",
    guide: {
      vi: "{pn} <câu hỏi>",
      en: "{pn} <question>"
    }
  },
  langs: {
    vi: {
      null: "Không có dữ liệu"
    },
    en: {
      null: "No data available"
    }
  }
};
