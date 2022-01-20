global.__main = __dirname;

(async () => {
  
  require('dotenv').config();
  const config = require(`${__main}/config/config.json`);
  const { Client, Collection, Intents } = require('discord.js');
  
  
  global.bot = new Client({ intents: new Intents(config.intents) });
  bot.commands = new Collection();
  bot.buttons = new Collection();
  
  
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Успешное подключение к Mongo");
  });
  
  
  require(`${__main}/modules/index.js`)();
  require(`${__main}/handlers/index.js`)();
  
  
  bot.login(process.env.TOKEN);
  
})();