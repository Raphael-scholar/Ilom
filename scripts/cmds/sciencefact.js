const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'sciencefacts_cache.json');
const COOLDOWN_TIME = 30000;
const userCooldowns = new Map();

const API_URL = 'https://api.api-ninjas.com/v1/facts?category=science';
const API_KEY = 'L7s+MIx6b6kGS4TVz11iyg==hgU2HWsYxZJdNn06';

const AUTHOR_NAME = "Raphael scholar";

async function loadCache() {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { facts: [], lastFetch: 0 };
    }
}

async function saveCache(cache) {
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache));
}

async function fetchNewFacts() {
    const response = await axios.get(API_URL, {
        headers: { 'X-Api-Key': API_KEY }
    });
    return response.data.map(item => item.fact);
}

async function getScienceFact() {
    let cache = await loadCache();
    const now = Date.now();

    if (cache.facts.length === 0 || now - cache.lastFetch > 24 * 60 * 60 * 1000) {
        cache.facts = await fetchNewFacts();
        cache.lastFetch = now;
        await saveCache(cache);
    }

    const fact = cache.facts.pop();
    await saveCache(cache);
    return fact;
}

async function scienceFactCommand(api, event) {
    const userId = event.senderID;
    const now = Date.now();

    if (userCooldowns.has(userId)) {
        const cooldownEnd = userCooldowns.get(userId) + COOLDOWN_TIME;
        if (now < cooldownEnd) {
            const remainingTime = (cooldownEnd - now) / 1000;
            return api.sendMessage(`Please wait ${remainingTime.toFixed(1)} seconds before using this command again.`, event.threadID);
        }
    }

    userCooldowns.set(userId, now);

    try {
        const fact = await getScienceFact();
        const message = `🔬 Science Fact of the Day:\n\n${fact}\n\n🌟 Powered by Ninjas 🌟\n\nCredit: Raphael scholar`;
        api.sendMessage(message, event.threadID);
    } catch (error) {
        console.error('Error fetching science fact:', error);
        api.sendMessage(`Sorry, I couldn't fetch a science fact at the moment. Please try again later.`, event.threadID);
    }
}

module.exports = {
    config: {
        name: "sciencefact",
        aliases: ["sf", "scifact"],
        version: "1.6",
        author: AUTHOR_NAME,
        countDown: 30,
        role: 0,
        shortDescription: "Get a random science fact",
        longDescription: "Retrieve a random, interesting science fact to expand your knowledge.",
        category: "education",
        guide: {
            en: "{p}sciencefact"
        }
    },

    onStart: async function ({ api, event }) {
        if (module.exports.config.author !== AUTHOR_NAME) {
            return api.sendMessage("Unauthorized script modification detected. Author name cannot be changed.", event.threadID);
        }
        return scienceFactCommand(api, event);
    }
};
