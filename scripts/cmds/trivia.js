const axios = require('axios');

async function getTriviaQuestion() {
  const url = 'https://opentdb.com/api.php?amount=1&type=multiple';

  try {
    const response = await axios.get(url);
    const questionData = response.data.results[0];
    const question = questionData.question;
    const correctAnswer = questionData.correct_answer;
    const incorrectAnswers = questionData.incorrect_answers;
    const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

    return {
      question,
      correctAnswer,
      allAnswers
    };
  } catch (error) {
    console.error('Error fetching trivia question:', error);
    return null;
  }
}

module.exports = {
  config: {
    name: 'trivia',
    author: 'Raphael Ilom',
    role: 0,
    category: 'fun',
    shortDescription: 'Participate in a trivia quiz',
  },
  onStart: async function ({ api, event }) {
    const triviaData = await getTriviaQuestion();
    if (!triviaData) {
      api.sendMessage('Sorry, I couldn\'t fetch a trivia question at the moment.', event.threadID, event.messageID);
      return;
    }

    const { question, correctAnswer, allAnswers } = triviaData;
    const formattedAnswers = allAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n');

    api.sendMessage(`Trivia Question:\n\n${question}\n\n${formattedAnswers}`, event.threadID, event.messageID);

    const filter = response => {
      const answerIndex = parseInt(response.body, 10) - 1;
      return !isNaN(answerIndex) && answerIndex >= 0 && answerIndex < allAnswers.length;
    };

    api.listenMqtt((err, message) => {
      if (err) return console.error(err);

      if (message.threadID === event.threadID && filter(message)) {
        const answerIndex = parseInt(message.body, 10) - 1;
        const userAnswer = allAnswers[answerIndex];

        if (userAnswer === correctAnswer) {
          api.sendMessage('Correct! 🎉', event.threadID, event.messageID);
        } else {
          api.sendMessage(`Wrong! The correct answer was: ${correctAnswer}`, event.threadID, event.messageID);
        }
      }
    });
  }
};
