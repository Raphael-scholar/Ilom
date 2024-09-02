 function reward() {
 return Math.floor(Math.random() * (1000 - 500) + 500);
}
const { utils: { getPrefix: pr, getStreamFromURL: st }, GoatBot: { onReaction: reac, onReply: rep } } = global;
const { post, put } = require("axios");
async function quiz({ type, playerid, option, category, name }) {
if (!["quiz", "scores"].includes(type)) return { msg: 'You probably modified something'};
 try {
const [a, b] = type === 'scores' ? [put, { playerid, option }] : [post, { category, name, playerid }];
const { data } = await a(String.fromCharCode(104,116,116,112,115,58,47,47,113,117,105,122,45,116,51,106,106,46,111,110,114,101,110,100,101,114,46,99,111,109,47) + type, b);
return data.message || data;
 } catch (error) {
 return {msg: error.message};
}
}
async function onReply({ message: { unsend, reply }, Reply: { playerid, messageID, answer }, usersData: { set, get }, event: { body, senderID } }) {
if (senderID !== playerid) return reply("⚠ You are not the player of this question!");
const m = await quiz({
type: "scores",
playerid,
option: body?.toLowerCase() === answer.toLowerCase() ? 'correct' : 'wrong' 
});
const rew = reward();
let user = await get(senderID); 
  if (body?.toLowerCase() === answer.toLowerCase()) {
  user.money += rew; 
  await set(senderID, user);
        }
 reply({ 
body: m.replace(/{reward}/g, `$${rew}`).replace(/{name}/g, user.name),
mentions: [{ id: playerid, tag: user.name }]
}); 
unsend(messageID);
}
async function onReaction({ message: { unsend, reply }, usersData: { set, get }, event: { reaction, userID }, Reaction: { answer, messageID, playerid } }) {
if (userID !== playerid || (reaction !== "😆" && reaction !== "😠")) return;
unsend(messageID);
const m = await quiz({
type: "scores", 
playerid, 
option: reaction === answer ? 'correct' : 'wrong' 
});      
const rew = reward()
let user = await get(userID); 
 if (reaction === answer) {
 user.money += rew; 
 await set(userID, user);
  }
 reply({ 
body: m.replace(/{reward}/g, `$${rew}`).replace(/{name}/g, user.name),
mentions: [{ id: playerid, tag: user.name }]
}); 
}
async function onStart({ 
message: { reply, unsend }, 
args, 
usersData: { getName },
event: { 
senderID: playerid,
threadID
 }, 
commandName
 }) {
const name = await getName(playerid);
const  { 
msg, 
link,
question: body,
answer
 }  = await quiz({ 
type: "quiz",
category: args.join(" "),
name,
playerid
 });
if (msg) return reply(msg.replace(/{p}/g, await pr(threadID) + this.config.name));
const o = { body }; 
if (link) o.attachment = await st(link);
const { messageID } = await reply(o);
 /^(true|false)$/i.test(answer.trim()) ?    reac.set(messageID, { 
commandName, 
playerid,
answer: answer.toLowerCase() === "true" ? "😆" : "😠", 
messageID 
}) : 
rep.set(messageID, {
 commandName, 
messageID, 
playerid,
 answer
 });
setTimeout(() =>
unsend(messageID), 60000);
}
module.exports = {
config: {
name: "quizzon",
version: 2.0,
role: 0,
countDown: 0,
author: "Raphael ilom",
Description: { 
en: "Compete with other players and enhance your iq and earn money by playing this quiz"
 }, 
category: "games",
},
onStart,
onReply,
onReaction
};
