global.__main = __dirname;

(async () => {
  
  require('dotenv').config();
  const config = require(`${__main}/config/config.json`);
  const { Client, Collection, Intents } = require('discord.js');
  
  
  global.bot = new Client({ intents: new Intents(config.intents) });
  bot.commands = new Collection();
  bot.buttons = new Collection();
  
  
  await require(`${__main}/mongo/index.js`)();
  require(`${__main}/modules/index.js`)();
  require(`${__main}/handlers/index.js`)();
  
  
  bot.login(process.env.TOKEN);
  
})();