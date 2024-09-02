const axios = require('axios')
module.exports = {
  config: {
    name: "coral",
    version: "1.1",
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
    const link = `https://cohere-api-by-lanceq.onrender.com/api/chat?message=${encodeURIComponent(inp)}&&chat_id=${id}`
    if(!inp){
      message.reply('missing input');
    }else{
      try{
        const response = await axios.get(`${link}`);
        const data = response.data.text;
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
  const link = `https://cohere-api-by-lanceq.onrender.com/api/chat?message=${encodeURIComponent(inp)}&&chat_id=${id}`
  let { author, commandName } = Reply;
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
