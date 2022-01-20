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


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Успешное подключение к Mongo");
  slashCommandsDeploy();
});


async function slashCommandsDeploy() {
  
  let botCommands = await require(`${__main}/modules/index.js`)();
  console.log(botCommands)
  
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  rest.put(
    Routes.applicationGuildCommands(config.botId, config.guildId),
    { body: botCommands }
  )
  .then(() => console.log('Успешно зарегистрированы команды приложения.'))
  .catch(console.error);
  
}