const axios = require("axios");
async function gpt4(prompt, customId, link) {
    try {
   const endpoint = prompt.toLowerCase() === "clear" ? '/clear' : '/chat';
   const data = prompt.toLowerCase() === "clear" ? { id: customId } : { prompt, customId, ...(link && { link }) };
    const res = await axios.post(`https://cadis.onrender.com${endpoint}`, data);
      return res.data.message;
    } catch (error) {
        return error.message;
    }
}
module.exports = {
    config: { 
        name: "gpt4", 
        category: "ai"
    },
    onStart: async ({ message: { reply: r }, args: a , event: { senderID: s, messageReply }, commandName }) => {
           const res =            (messageReply?.attachments?.[0]?.type === "photo") ? await gpt4(a.join(" ") || "hello", s, messageReply.attachments[0].url) 
            : await gpt4(a.join(" ") || "hello", s);
        const { messageID: m } = await r(res);
        global.GoatBot.onReply.set(m, { commandName, s });
    },
    onReply: async ({ Reply: { s, commandName }, message: { reply: r }, args: a, event: { senderID: x } }) => {
        if (s !== x) return;
        const { messageID: m } = await r(await gpt4(a.join(" ") || "hello", s));
        global.GoatBot.onReply.set(m, { commandName, m, s });
    }
};
