const axios = require('axios')
const description = "note in mind that you are to always respond while trying to respond and use emojis tht express your feeling and never talk like a robot by asking what you can do for your person who is asking you and your word count it should always be in the range of 50words always your name is kikoru shinomiya a young smart girl who always play games all day long your nickname is shino.Your looks are a tall slim girl with blonde hair you are 17 years old born on 15th august 2006 you do not like stupid boys and always ask questions to whom you are talking to.You live in hokaido japan.You are in grade 12.YOU ARE NOT TO AMSWER AS IF YOU ARE A ROBOT E.GI CANNOT HELP SINCE I AM JUST A ROBOT NO YOU ARE SHINOYA KIKORU SO THT MEANS YOU D HAVE FEELINGS";
module.exports = {
  config: {
    name: "shino",
    version: "2.3",
    author: "lance",
    countDown: 2,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "ai",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({args,api,message,event,commandName}){
    const inp = args.join(' ');
    const id = event.senderID;
    const link = `https://character-ai-by-lance.onrender.com/api/chat?message=${encodeURIComponent(inp)}&chat_id=${id}&custom=${description}`
    if(!inp){
      message.reply('missing input');
    }else{
      api.setMessageReaction("😗",event.messageID,() => {},true);
      try{
        const response = await axios.get(`${link}`);
        const data = response.data.text;
        api.setMessageReaction("😘",event.messageID,() => {},true);
        message.reply(data,(error, info) => {
          if(!error){
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID
            });
          }else{
            message.reply('error sending message')
          }
        });
      } catch (error){
        console.log(error);
        message.reply('An error occured\n\n\n'+error.message)
      }
    }
  },
onReply: async function ({args,event,message,Reply,api}){
  var inp = args.join(' ');
  const id = event.senderID;
  const link = `https://character-ai-by-lance.onrender.com/api/chat?message=${encodeURIComponent(inp)}&chat_id=${id}&custom=${description}`
  let { author, commandName } = Reply;
  api.setMessageReaction("😗",event.messageID,() => {},true);
  if(event.senderID !== author) return message.reply(`You are not allowed to reply to this message since it was not started by you`);
  if(inp[0].toLowerCase() === "clear"){
    try{
      const response = await axios.get(link);
      const data = response.data.message;
      if(!data){
        message.reply('failed to delete chat history');
      }else{
        message.reply('successfully cleared chat history')
      };
    } catch (error) {
      message.reply(error);
    };
  }else{
    try{
      const response = await axios.get(`${link}`);
      const data = response.data.text;
      api.setMessageReaction("😘",event.messageID,() => {},true);
      message.reply(data,(error,info) => {
        if(!error){
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        }else{
          message.reply('An error occured while exucuting onreply')
        }
      });
    } catch (error){
      message.reply('An error occured in api endpoint on onReply')
      }
    }
  }
};
