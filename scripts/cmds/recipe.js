const axios = require('axios');

module.exports = {
  config: {
    name: "recipe",
    version: "1.0",
    author: "Raphael ilom",
    countDown: 5,
    role: 0,
    shortDescription: "Get a random recipe or search for a recipe by ingredient.",
    longDescription: {
      en: "This command allows you to get a random recipe or search for a recipe by ingredient."
    },
    category: "Utility",
    guide: {
      en: "{prefix}recipe [ingredient]"
    }
  },

  onStart: async function({ api, event, args }) {
    const ingredient = args.join(' ');
    const url = ingredient 
      ? `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      : 'https://www.themealdb.com/api/json/v1/1/random.php';

    try {
      const response = await axios.get(url);
      const meal = response.data.meals[0];
      const message = `Recipe: ${meal.strMeal}\nCategory: ${meal.strCategory}\nInstructions: ${meal.strInstructions}\nLink: ${meal.strSource || 'N/A'}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(`Error fetching recipe: ${error.message}`);
      api.sendMessage("An error occurred while fetching the recipe.", event.threadID, event.messageID);
    }
  }
};
