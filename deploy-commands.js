const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
require('dotenv').config();

global.mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => {
console.log("Успешное подключение к Mongo")

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.cmd.data.toJSON());
}

const economyDeployCommands = require('./bot modules/Economy/economyDeployCommands.js')
economyDeployCommands(commands)

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: commands }
)
	.then(() => console.log('Успешно зарегистрированы команды приложения.'))
	.catch(console.error);
})