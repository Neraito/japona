global.__main = __dirname;

global.icons = {
  slash1: '<:slash1:928312917802221598>',
  options1: '<:options1:928312574167101511>',
  type1: '<:page_type1:928276480574767114>',
  left1: '<:page_left1:928276577874239538>',
  left2: '<:page_left2:928276679875514469>',
  right1: '<:page_right1:928276789497847838>',
  right2: '<:page_right2:928276869235761252>',
};



(async () => {
  
  require('dotenv').config();

  const fs = require('fs');
  const config = require(`${__main}/lib/config.json`);
  const { Client, Collection, Intents } = require('discord.js');
  const modulesInit = require(`${__main}/modules/index.js`);
  global.mongoose = require('mongoose');
  
  global.bot = new Client({ intents: new Intents(config.intents) });


  bot.commands = new Collection();
  bot.buttons = new Collection();
  
  
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Успешное подключение к Mongo");
  });
  
  
  modulesInit();
  
  
  const events = fs.readdirSync('./events')
    .filter(file => file.endsWith('.js'));
  
  for (let event of events) {
    
    event = require(`./events/${event}`);
    if (event.once) bot.once(event.name, (...args) => event.execute(...args));
    else bot.on(event.name, (...args) => event.execute(...args));
    
  }
  
  
  
  bot.login(process.env.TOKEN);
  
  
  
  process.on('uncaughtException', function(err) {
    console.log('Ошибка ять: ' + err);
  });
  
  
  
  
})();