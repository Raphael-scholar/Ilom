var noPrefix = [ "ai", "prefixv2", "liner", "sicbo", "gemini" ];
var  prefix = "?";
const { getStreamFromURL: st } = global.utils,
 { get, post } = require("axios");
async function onChat({ message: m, event: e, args: a, usersData: u }) {
  if (!(a[0]?.toLowerCase().startsWith(prefix) || noPrefix.some(_=> a[0]?.toLowerCase() === _ ))) return;
  try {
  const prompt = a.length === 1 &&  a[0] === `${prefix}`  ? "prefixv2" : noPrefix.some(_=> a[0].toLowerCase() === _) ? a.join(" ")  : ["fuck"].some(x => a[0].toLowerCase().substring(prefix.length) === x) && Object.keys(e.mentions).length > 0 ? a[0].substring(prefix.length) + ' ' + (Object.keys(e.mentions)[0]) : (prefix) && a[0].startsWith(prefix) && ["gemini", "lens"].some(x => a[0].toLowerCase().substring(prefix.length) === x) && e.type === "message_reply" && e.messageReply.attachments?.[0]?.type === "photo"  ? a.join(" ").substring(prefix.length) + ' ' + e.messageReply.attachments[0].url  : a.join(" ").substring(prefix.length),
id = e.senderID,
   name = await u.getName(id),
{ data: { result, av }  } = await post("https://apiv1-k60p.onrender.com/gpt", {  prompt, name, id  }),
 body = Array.isArray(result) ? JSON.stringify(result, null, 2) : (!a[0].startsWith(prefix)) ? result.replace(/!🐥/g, "") : result.replace(/!🐥/g, prefix),
  o = { body, mentions: [{ id, tag: name }] };
    if (av) {
      o.attachment = Array.isArray(av) ? await Promise.all(av.map(async (i) => (await get(i, { responseType: 'stream' })).data)) :  (av.startsWith("https://cdn")) ? await st(av, "spotify.mp3") : (av.startsWith("https://te")) ? await st(av, "nigger.png") : await st(av);
    }
    m.reply(o);
  } catch (err) {
m.reply(err.message);
  }
}
module.exports = {
  config: {
    name: "botv2",
    author: "Raphael ilom",
    role: 0,
    shortDescription: "A second verison of bot",
    category: "botv2"
  },
  onStart: () => {},
  onChat
};
