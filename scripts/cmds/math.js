module.exports = {
  config: {
    name: "math",
    version: "1.0",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Perform basic math operations.",
    longDescription: {
      en: "This command allows you to perform basic math operations like addition, subtraction, multiplication, and division."
    },
    category: "Utility",
    guide: {
      en: "{prefix}math <operation> <num1> <num2>"
    }
  },

  onStart: async function({ api, event, args }) {
    const [operation, num1, num2] = args;
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    if (isNaN(number1) || isNaN(number2)) {
      return api.sendMessage("Please provide valid numbers.", event.threadID, event.messageID);
    }

    let result;
    switch (operation) {
      case 'add':
        result = number1 + number2;
        break;
      case 'subtract':
        result = number1 - number2;
        break;
      case 'multiply':
        result = number1 * number2;
        break;
      case 'divide':
        result = number1 / number2;
        break;
      default:
        return api.sendMessage("Please provide a valid operation (add, subtract, multiply, divide).", event.threadID, event.messageID);
    }

    api.sendMessage(`Result: ${result}`, event.threadID, event.messageID);
  }
};
