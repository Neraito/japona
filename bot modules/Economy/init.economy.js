const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const economySystem = require('./economySystem.js');

module.exports = async () => {
  let slashCommandCategory = new SlashCommandBuilder()
    .setName('economy')
    .setDescription('.');
  
  let commandDataArray = [];
  
  let categoryCommands = fs.readdirSync(__dirname + '/commands')
    .filter(file => file.endsWith('.js'));
  
  for (let command of categoryCommands) {
    command = require(`./commands/${command}`);
    command.init(slashCommandCategory, commandDataArray);
    
    if (command.btn)
      for (let button of command.btn)
        bot.buttons.set(button.name, button);
  }
  
  async function execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    
    for (let commandData of commandDataArray) 
      if (subcommand === commandData.name)
        commandData.command(interaction);
  }
  
  bot.commands.set(slashCommandCategory.name, {data: slashCommandCategory, execute});
  //console.log(bot.commands)
  
  // --- --- --- //
  
  //economySystem.mining();
};