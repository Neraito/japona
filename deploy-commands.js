global.__main = __dirname;


const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botId, guildId } = require('./config.json');
require('dotenv').config();

global.mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => {
console.log("Успешное подключение к Mongo");

const botCommands = [];
const uncategorizedCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (let command of uncategorizedCommands) {
	command = require(`./commands/${command}`);
	botCommands.push(command.cmd.data.toJSON());
}

let botModules = fs.readdirSync('./bot modules/');
console.log(botModules)

for (let module of botModules) {
  let deployModule = fs.readdirSync(`./bot modules/${module}/`).filter(file => file.startsWith('deploy.'));
  deployModule = require(`./bot modules/${module}/${deployModule}`);
  deployModule(botCommands);
  console.log(deployModule)
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
rest.put(
  Routes.applicationGuildCommands(botId, guildId),
  { body: botCommands }
)
.then(() => console.log('Успешно зарегистрированы команды приложения.'))
.catch(console.error);

});