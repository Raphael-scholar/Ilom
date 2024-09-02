const axios = require("axios");
module.exports = {
config: {
name: "ai2",
category: "ai"
},
onStart(){},
onChat: async function ({ message, args, event }) {
if (!event.body?.toLowerCase().startsWith("ai") && !event.body?.toLowerCase().startsWith(`${await global.utils.getPrefix(event.threadID)}ai`)) return;
//message.reaction("🤬", event.messageID)
try {
return message.reply(await ai(`${args.slice(1).join(" ") + "\nAnswer shortly, don't yap. Answer directly" || "hi"}`))
} catch (e) {
throw e;
}
}
};
async function ai(q) {
var ms = Date.now();
  const models = ["llama3", "gemini", "liner", "partner", "bai"];
  const match = q.match(/--(llama3|gemini|liner|partner|bai)$/);
  const prompt = match ? q.replace(`--${match[1]}`, "").trim() : q;
  if (match) models.unshift(...models.splice(models.indexOf(match[1]), 1)); 
  const errors = [];
  for (const model of models) {
    try {
      const { data } = await axios.post("https://api-v1-3ciz.onrender.com/ai", { model, prompt });
  return `${data.result}\n`/*\nModel used: ${model}\nResponse time: ${((Date.now() - ms) / 1000).toFixed(2)} ${(((Date.now() - ms) / 1000).toFixed(2) === '1.00') ? 'second' : 'seconds'}`*/;
    } catch (e) {
   errors.push(`Model ${model} error: ${e.response ? JSON.stringify(e.response.data, null, 2) : e.message}`);
    }
  }
  return errors.join("\n\n");
}
