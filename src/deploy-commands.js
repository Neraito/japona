global.__main = __dirname;

require('dotenv').config();
const { Client, Collection, Intents } = require('discord.js');
const config = require(`${__main}/config/config.json`);
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


global.bot = new Client({ intents: new Intents(config.intents) });
bot.commands = new Collection();
bot.buttons = new Collection();


require(`${__main}/mongo/index.js`)().then(slashCommandsDeploy());


async function slashCommandsDeploy() {
  
  let botCommands = await require(`${__main}/modules/index.js`)();
  //console.log(botCommands)
  
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  rest.put(
    Routes.applicationGuildCommands(config.botId, config.guildId),
    { body: botCommands }
  )
  .then(() => console.log('[SUCCESS] Успешно зарегистрированы команды приложения.'))
  .catch(console.error);
  
}