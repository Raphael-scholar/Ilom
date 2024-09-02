const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  config: {
    name: 'exec',
    aliases: ['terminate', 'run'],
    version: '2.0.1.Beta',
    author: 'Yukinori ʚĭɞ',
    role: 2,
    category: 'utility',
    shortDescription: {
      en: 'Executes terminal commands with added features.',
    },
    longDescription: {
      en: 'Executes terminal commands and returns the output. Includes timeout, permission check, and output truncation.',
    },
    guide: {
      en: '{pn} [command]',
    },
  },
  onStart: async function ({ api, event, args, message }) {
    const permission = ["100091893014482", "61553871285563"];

    if (!permission.includes(event.senderID)) {
      message.reply('You do not have permission to use this command.');
      return;
    }

    if (!args.length) {
      message.reply('Usage: {pn} [command]');
      return;
    }

    const command = args.join(' ');
    const timeout = 5000; // Set timeout to 5 seconds
    const maxOutputLength = 2000; // Maximum output length to prevent spamming

    try {
      const { stdout, stderr } = await exec(command, { timeout });

      let output = stderr || stdout;
      if (output.length > maxOutputLength) {
        output = output.substring(0, maxOutputLength) + '\n...Output truncated.';
      }

      message.send(output);
    } catch (error) {
      if (error.killed) {
        message.reply('Error: Command timed out.');
      } else {
        console.error('Command execution failed:', error);
        message.reply(`Error: ${error.message}`);
      }
    }
  },
};
