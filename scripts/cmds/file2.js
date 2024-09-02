const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file2",
    version: "2.0",
    author: "Raphael XShota",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file or list available files",
    category: "owner",
    guide: "{pn} [file name | list]. Ex: .{pn} filename or .{pn} list"
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["61553871285563" , "100091893014482" ];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("You don't have permission to use this command.", event.threadID, event.messageID);
    }
    
    if (!args[0]) {
      return api.sendMessage("Please provide a file name or use 'list' to see available files.", event.threadID, event.messageID);
    }

    if (args[0].toLowerCase() === 'list') {
      const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
      return api.sendMessage(`Available files:\n${files.join('\n')}`, event.threadID, event.messageID);
    }

    const fileName = args[0];
    const filePath = path.join(__dirname, `${fileName}.js`);

    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileSize = fs.statSync(filePath).size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);

    api.sendMessage({ 
      body: `File: ${fileName}.js\nSize: ${fileSizeKB} KB\n\nContent:\n${fileContent}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, (err, info) => {
      if (err) {
        console.error(err);
        api.sendMessage("An error occurred while sending the file.", event.threadID, event.messageID);
      }
      fs.unlinkSync(filePath);
    });
  }
};
