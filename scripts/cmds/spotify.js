const axios = require('axios');

module.exports = {
  config: { 
    name: "spotify", 
    countDown: 5, 
role: 0,
    author: "Raphael scholar × shota Akiro", 
    category: "media"
  },
  onStart: async ({ message, args }) => {
    if (!args[0]) return message.reply("please add a title");
message.reply(`Downloading... "${args.join(" ")}" please wait..`);
    try {
      const { metadata: {title, releaseDate, artists }, link } = await spotify(`${args.join(" ")}`);
      message.reply({
        body: `Title: ${title}\nArtists: ${artists}\nRelease: ${releaseDate}`,
        attachment: await global.utils.getStreamFromURL(link, "spotify.mp3"),
      });
    } catch (e) {
      throw e;
    }
  }
};

const spotify = async (q) => {
  try {
    const url = `
https://api-v1-3ciz.onrender.com`;
    const trackUrl = (await axios.get(`${url}/spotifs?q=${encodeURIComponent(q)}`)).data[0]?.track_url;
    if (!trackUrl) throw new Error(`${q} not found`);
    return (await axios.get(`${url}/spotifydl?link=${trackUrl}`)).data;
  } catch (e) {
    return e.response?.data || e.message;
  }
};
