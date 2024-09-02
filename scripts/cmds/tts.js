  module.exports = {
  config: {
    name: "tts",
    author: "",
    countDown: 7,
    role: 0,
    category: "media"
  },

  onStart: async function ({ message, args, event }) {
    if (args.length === 0) {
      return message.reply(`example usage: ${await global.utils.getPrefix(event.threadID)}${this.config.name} <txt> <1 - 40>`);
    }
    let model = parseInt(args[args.length - 1]);
    if (isNaN(model) || model < 1 || model > 40) {
      model = 1; 
    } else {
      args.pop(); 
    }
    let text = args.join(" ");
    if (event.messageReply?.body) {
      text = event.messageReply.body + "\n\n" + args.join(" ");
    }

    if (!text) {
      return message.reply("Please provide a text.");
    }

try {
    message.reply({
body: text,
      attachment: await global.utils.getStreamFromURL(`https://api-v1-3ciz.onrender.com/tts?text=${encodeURIComponent(text)}&voice=${model}`, "tts.mp3")
    });
  } catch (e) {
return message.reply(e.response?.data || e.message);
}

}
};￼Enter
