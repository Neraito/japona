const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const config = require(`${__main}/config/config.json`);
const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


module.exports = async () => {
  
  const modulesCommandsData = [];
  
  
  const modules = fs.readdirSync(`${__dirname}/`).filter(f => (!f.endsWith('.js')));
  //console.log(modules)
  for (let module of modules) {
    
    const moduleHelp = fs.readdirSync(`${__dirname}/${module}`).filter(f => f.startsWith('help.'));
    const moduleHelpData = require(`${__dirname}/${module}/${moduleHelp}`);
    //console.log(moduleHelpData.id)
    
    const mongoGuild = await Guilds.find({ guildId: config.guildId });
    console.log(mongoGuild)
    
    if (moduleHelpData.id === null)
      await initModuleWithoutSubcommands(module, modulesCommandsData);
    if (moduleHelpData.id !== null)
      await initModuleWithSubcommands(module, moduleHelpData, modulesCommandsData);
    
  }
  
  console.log(modulesCommandsData)
  
  return modulesCommandsData;
  
};


async function initModuleWithoutSubcommands(module, modulesCommandsData) {
  
  const commands = fs.readdirSync(`${__dirname}/${module}/commands/`).filter(file => file.endsWith('.js'));
  
  for (let command of commands) {
    
    command = require(`${__dirname}/${module}/commands/${command}`);
    bot.commands.set(command.cmd.data.name, command.cmd);
    
    if (command.btn)
      for (let button of command.btn)
        bot.buttons.set(button.name, button);
    
    modulesCommandsData.push(command.cmd.data.toJSON());
    
  }
  
}


async function initModuleWithSubcommands(module, moduleHelpData, modulesCommandsData) {
  
  const slashCommand = new SlashCommandBuilder()
    .setName(moduleHelpData.id)
    .setDescription('.');
  
  const commandsExecData = [];
  
  
  const commands = fs.readdirSync(`${__dirname}/${module}/commands/`).filter(f => f.endsWith('.js'));
  
  for (let command of commands) {
    
    command = require(`${__dirname}/${module}/commands/${command}`);
    command.init(slashCommand, commandsExecData);
    
    if (command.btn)
      for (let button of command.btn)
        bot.buttons.set(button.name, button);
    
  }
  
  modulesCommandsData.push(slashCommand.toJSON());
  
  
  async function execute(interaction) {
    
    const subcommand = interaction.options.getSubcommand();
    
    for (let command of commandsExecData)
      if (subcommand === command.name)
        command.execute(interaction);
    
  }
  
  bot.commands.set(slashCommand.name, {data: slashCommand, execute});
  
}