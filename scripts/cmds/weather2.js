const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WEATHER_API_KEY = 'a9b4c37c68380d91903251d40ffa89ec'; 
const USER_DATA_FILE = path.join(__dirname, 'userData.json');
const CACHE_FILE = path.join(__dirname, 'weatherCache.json');

let userData = {};
let weatherCache = {};

if (fs.existsSync(USER_DATA_FILE)) {
  userData = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
}

if (fs.existsSync(CACHE_FILE)) {
  weatherCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
}

async function fetchWeather(location) {
  const cacheKey = `weather_${location}`;
  if (weatherCache[cacheKey] && Date.now() - weatherCache[cacheKey].timestamp < 3600000) {
    return weatherCache[cacheKey].data;
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`);
    weatherCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    saveWeatherCache();
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

async function fetchForecast(location) {
  const cacheKey = `forecast_${location}`;
  if (weatherCache[cacheKey] && Date.now() - weatherCache[cacheKey].timestamp < 3600000) {
    return weatherCache[cacheKey].data;
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${WEATHER_API_KEY}&units=metric`);
    weatherCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    saveWeatherCache();
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return null;
  }
}

function saveUserData() {
  fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
}

function saveWeatherCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(weatherCache, null, 2));
}

function getUserProfile(userId) {
  if (!userData[userId]) {
    userData[userId] = { preferences: {}, history: [] };
  }
  return userData[userId];
}

function addUserMessageToHistory(userId, message) {
  const profile = getUserProfile(userId);
  profile.history.push(message);
  if (profile.history.length > 10) {
    profile.history.shift();
  }
  saveUserData();
}

function getWeatherEmoji(description) {
  const emojiMap = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️'
  };
  return emojiMap[description.toLowerCase()] || '🌈';
}

module.exports = {
  config: {
    name: 'weather2',
    author: 'Raphael Scholar',
    role: 0,
    category: 'utility',
    shortDescription: 'Fetches current weather information',
    longDescription: 'Fetches current weather information for a specified location using the OpenWeatherMap API.',
    usage: 'weather2 <location>',
  },
  onStart: async function ({ api, event, args }) {
    const location = args.join(' ').trim();
    if (!location) {
      api.sendMessage('Please provide a location to get the weather information.', event.threadID, event.messageID);
      return;
    }

    const weatherData = await fetchWeather(location);
    const forecastData = await fetchForecast(location);
    if (weatherData && forecastData) {
      const message = `The current weather in ${weatherData.name} is ${weatherData.weather[0].description} ${getWeatherEmoji(weatherData.weather[0].description)} with a temperature of ${weatherData.main.temp}°C.\n\n` +
                      `5-day forecast:\n` +
                      forecastData.list.slice(0, 5).map(item => `${item.dt_txt}: ${item.weather[0].description} ${getWeatherEmoji(item.weather[0].description)}, ${item.main.temp}°C`).join('\n');
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      api.sendMessage('Sorry, I could not fetch the weather information. Please try again later.', event.threadID, event.messageID);
    }
  },
  commands: {
    clearHistory: async function ({ api, event }) {
      const userId = event.senderID;
      const profile = getUserProfile(userId);
      profile.history = [];
      saveUserData();
      api.sendMessage('Your chat history has been cleared.', event.threadID, event.messageID);
    },
    getLocationWeather: async function ({ api, event }) {
      const userId = event.senderID;
      const profile = getUserProfile(userId);
      const location = profile.preferences.location;
      if (!location) {
        api.sendMessage('Please set your location first using the setLocation command.', event.threadID, event.messageID);
        return;
      }

      const weatherData = await fetchWeather(location);
      if (weatherData) {
        const message = `The current weather in ${weatherData.name} is ${weatherData.weather[0].description} ${getWeatherEmoji(weatherData.weather[0].description)} with a temperature of ${weatherData.main.temp}°C.`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Sorry, I could not fetch the weather information. Please try again later.', event.threadID, event.messageID);
      }
    },
    setLocation: async function ({ api, event, args }) {
      const userId = event.senderID;
      const location = args.join(' ').trim();
      if (!location) {
        api.sendMessage('Please provide a location to set.', event.threadID, event.messageID);
        return;
      }

      const profile = getUserProfile(userId);
      profile.preferences.location = location;
      saveUserData();
      api.sendMessage(`Your location has been set to ${location}.`, event.threadID, event.messageID);
    }
  }
};

// Ensure the script won't work if the author's name is changed
if (module.exports.config.author !== 'Raphael Scholar') {
  throw new Error('Unauthorized script modification detected.');
}
