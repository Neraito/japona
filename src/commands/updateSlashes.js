const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require(`${__main}/config/config.json`);
const { Guilds } = require(`${__main}/mongo/index.js`).schemas;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


module.exports = slashCommandsDeploy;


async function slashCommandsDeploy(guildId) {
  
  const slashesData = await getSlashesData(guildId);
  
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  rest.put(
    Routes.applicationGuildCommands(config.botId, guildId),
    { body: slashesData }
  )
  .then(() => console.log('[SUCCESS] Успешно зарегистрированы команды приложения.'))
  .catch(console.error);
  
}


async function getSlashesData(guildId) {
  
  const slashesData = [];
  
  const commandsModules = fs.readdirSync(`${__dirname}/`).filter(f => (!f.endsWith('.js')));
  //console.log(commandsModules)
  
  for (let commandsModule of commandsModules) {
    
    const commandsModuleHelpFile = fs.readdirSync(`${__dirname}/${commandsModule}/`)
      .filter(f => f.startsWith('help.') && f.endsWith('.json'));
    const commandsModuleHelpFileData = require(`${__dirname}/${commandsModule}/${commandsModuleHelpFile}`);
    //console.log(commandsModuleHelpData.id)
    
    if (commandsModuleHelpFileData.id === null)
      await initCommandsModuleWithoutSubcommands(guildId, commandsModule, slashesData);
    if (commandsModuleHelpFileData.id !== null)
      await initCommandsModuleWithSubcommands(guildId, commandsModule, slashesData, commandsModuleHelpFileData);
    
  }
  
  console.log(slashesData)
  
  return slashesData;
  
}



async function initCommandsModuleWithoutSubcommands(guildId, commandsModule, slashesData) {
  
  const commands = fs.readdirSync(`${__dirname}/${commandsModule}/`).filter(file => file.endsWith('.js'));
  
  for (let command of commands) {
    if (!devCommandOnDevServer(command, guildId)) continue;
    command = require(`${__dirname}/${commandsModule}/${command}`);
    slashesData.push(command.slash.toJSON());
  }
  
}


async function initCommandsModuleWithSubcommands(guildId, commandsModule, slashesData, commandsModuleHelpData) {
  
  const slashCommand = new SlashCommandBuilder()
    .setName(commandsModuleHelpData.id)
    .setDescription('.');
  
  const commands = fs.readdirSync(`${__dirname}/${commandsModule}/`).filter(f => f.endsWith('.js'));
  
  for (let command of commands) {
    if (!devCommandOnDevServer(command, guildId)) continue;
    command = require(`${__dirname}/${commandsModule}/${command}`);
    command.slash(slashCommand);
  }
  
  slashesData.push(slashCommand.toJSON());
  
}



function devCommandOnDevServer(commandName, guildId) {
  
  const devCommands = [
    'update-slashes.js'
  ];
  const devServers = [
    '831878963839107112'    // ФаньСи
  ];
  
  const isDevCommand = devCommands.includes(commandName);
  const isDevServer = devServers.includes(guildId);
  
  if (!isDevCommand) return true;
  return (isDevCommand && isDevServer) ? true : false;
  
}