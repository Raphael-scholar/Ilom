const axios = require('axios');

module.exports = {
  config: {
    name: "triviaquiz",
    version: "1.4",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Start a trivia quiz game.",
    longDescription: {
      en: "This command allows you to start a trivia quiz game with multiple questions, answer validation, score tracking, category selection, and a timer for each question."
    },
    category: "Fun",
    guide: {
      en: "{prefix}triviaquiz [category] [difficulty]"
    }
  },

  onStart: async function({ api, event, args }) {
    const category = args[0] || '17'; // Default to Science & Nature category
    const difficulty = args[1] || 'medium'; // Default to medium difficulty
    const amount = 5; // Number of questions
    const timeLimit = 30 * 1000; // 30 seconds per question

    try {
      const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`);
      const questions = response.data.results;
      let score = 0;
      let currentQuestion = 0;

      const askQuestion = () => {
        const question = questions[currentQuestion];
        const options = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);
        const message = `Question ${currentQuestion + 1}: ${question.question}\nA: ${options[0]}\nB: ${options[1]}\nC: ${options[2]}\nD: ${options[3]}`;
        api.sendMessage(message, event.threadID, (err, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            questions,
            currentQuestion,
            score,
            options,
            timer: setTimeout(() => {
              api.sendMessage(`Time's up! The correct answer was ${question.correct_answer}.`, event.threadID, () => {
                handleReply.currentQuestion += 1;
                handleReply.score = score;
                if (currentQuestion + 1 < questions.length) {
                  askQuestion();
                } else {
                  api.sendMessage(`Quiz over! Your final score is ${score}/${questions.length}.`, event.threadID);
                }
              });
            }, timeLimit)
          });
        });
      };

      askQuestion();
    } catch (error) {
      console.error(`Error fetching trivia questions: ${error.message}`);
      api.sendMessage("An error occurred while fetching the trivia questions.", event.threadID, event.messageID);
    }
  },

  handleReply: async function({ api, event, handleReply }) {
    const { questions, currentQuestion, score, options, timer } = handleReply;
    clearTimeout(timer); // Clear the timer if the user responds in time
    const userAnswer = event.body.trim().toUpperCase();
    const correctAnswer = questions[currentQuestion].correct_answer;

    let newScore = score;
    if (options[userAnswer.charCodeAt(0) - 65] === correctAnswer) {
      newScore += 1;
      api.sendMessage("Correct! 🎉", event.threadID, event.messageID);
    } else {
      api.sendMessage(`Wrong! The correct answer was ${correctAnswer}.`, event.threadID, event.messageID);
    }

    if (currentQuestion + 1 < questions.length) {
      handleReply.currentQuestion += 1;
      handleReply.score = newScore;
      const nextQuestion = questions[handleReply.currentQuestion];
      const nextOptions = [nextQuestion.correct_answer, ...nextQuestion.incorrect_answers].sort(() => Math.random() - 0.5);
      const nextMessage = `Question ${handleReply.currentQuestion + 1}: ${nextQuestion.question}\nA: ${nextOptions[0]}\nB: ${nextOptions[1]}\nC: ${nextOptions[2]}\nD: ${nextOptions[3]}`;
      api.sendMessage(nextMessage, event.threadID, (err, info) => {
        handleReply.messageID = info.messageID;
        handleReply.options = nextOptions;
        handleReply.timer = setTimeout(() => {
          api.sendMessage(`Time's up! The correct answer was ${nextQuestion.correct_answer}.`, event.threadID, () => {
            handleReply.currentQuestion += 1;
            handleReply.score = newScore;
            if (handleReply.currentQuestion < questions.length) {
              askQuestion();
            } else {
              api.sendMessage(`Quiz over! Your final score is ${newScore}/${questions.length}.`, event.threadID);
            }
          });
        }, timeLimit);
      });
    } else {
      api.sendMessage(`Quiz over! Your final score is ${newScore}/${questions.length}.`, event.threadID, event.messageID);
    }
  }
};
