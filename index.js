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


const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();
global.mongoose = require('mongoose');

global.bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });


// ------

const uncategorizedCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

bot.commands = new Collection();
for (let command of uncategorizedCommands) {
  command = require(`./commands/${command}`);
  bot.commands.set(command.cmd.data.name, command.cmd);
}

bot.buttons = new Collection();
for (let command of uncategorizedCommands) {
  command = require(`./commands/${command}`);
  if (command.btn) {
    for (let button of command.btn) {
      bot.buttons.set(button.name, button);
    }
  }
}

// ------

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of events) {
  const event = require(`./events/${file}`);
  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args));
  }
}

// ------

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => console.log("Успешное подключение к Mongo"))

// ------


bot.login(process.env.TOKEN);