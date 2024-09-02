const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const request = require("request");
/*Do not change
        the credit 🐢👑🥴*/
 
module.exports = {
  config: {
    name: "pinv5",
    aliases: ["pinterest"],
    version: "1.0",
    author: "𝐀𝐒𝐈𝐅 𝐱𝟔𝟗",
    role: 0,
    countDown: 20,
    description: {
      en: "Get Image From Pinterest",
    },
    category: "Search",
    guide: {
      en: "{pn} <search query> <number of images>\nExample: {pn} Hacker -10"
    },
    langs: {
      "en": {
          "missing": '{pn} anime girl - 10'
      }
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
    const keySearch = args.join(" ");
  const { spotify, pintarest } = require('nayan-server')
    if(keySearch.includes("-") == false) 
      return message.reply("Please enter the search query and - number of images (1-50)", event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    const numberSearch = keySearch.split("-").pop() || 6
    const res = await pintarest(`${encodeURIComponent(keySearchs)}`);
  console.log(res)
    const data = res.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    message.reply({
        attachment: imgData,
        body: numberSearch + ' images for '+ keySearchs
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`)
    };
      } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred.`,
        event.threadID,
        event.messageID
      );
}
}
	  }
