const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (botCommands) => {
  let slashCommandCategory = new SlashCommandBuilder()
    .setName('economy')
    .setDescription('.');
  
  let commandDataArray = [];
  
  let categoryCommands = fs.readdirSync(__dirname + '/commands')
    .filter(file => file.endsWith('.js'));
  
  for (let command of categoryCommands) {
    command = require(`./commands/${command}`);
    command.init(slashCommandCategory, commandDataArray);
  }
  
  botCommands.push(slashCommandCategory.toJSON());
};