const fs = require('fs');

module.exports = async () => {
  const { SlashCommandBuilder } = require('@discordjs/builders');
  
  let slashCommand = new SlashCommandBuilder()
    .setName('economy')
    .setDescription('.');
  let commandDataArray = [];
  
  let testCommands = fs.readdirSync('./bot modules/administry/commands')
    .filter(file => file.endsWith('.js'));
    
  for (let testCommand of testCommands) {
    testCommand = require(`./commands/${testCommand}`);
    testCommand.init(slashCommand, commandDataArray);
    if (testCommand.btn)
      for (let button of testCommand.btn) bot.buttons.set(button.name, button);
  }
  
  async function execute(interaction) {
    let subcommand = interaction.options.getSubcommand();
    for (let commandData of commandDataArray) 
      if (subcommand === commandData.name) commandData.command(interaction);
  }
  
  bot.commands.set(slashCommand.name, {data: slashCommand, execute});
};