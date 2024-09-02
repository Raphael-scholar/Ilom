module.exports.config = {
  name: "reminder",
  aliases: ["reminder", "remind"],
  haspermssion: 0,
  version: 1.0,
  credits: "Raphael ilom",
  cooldowns: 2,
  usePrefix: true,
  description: "Set a reminder for a specified time.",
  commandCategory: "Utility",
  usages: "[time in minutes] [message]"
};

module.exports.run = async function ({ api, args, event }) {
  const { threadID, messageID } = event;
  const time = parseInt(args[0]);
  const reminderMessage = args.slice(1).join(' ');

  if (isNaN(time) || !reminderMessage) {
    return api.sendMessage("Please provide a valid time in minutes and a reminder message.", threadID, messageID);
  }

  api.sendMessage(`Reminder set for ${time} minutes.`, threadID, messageID);

  setTimeout(() => {
    api.sendMessage(`Reminder: ${reminderMessage}`, threadID);
  }, time * 6000);
};
