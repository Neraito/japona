const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();
global.mongoose = require('mongoose');

//const allIntents = Intents.FLAGS.GUILDS;
//global.client = new Client({ intents: allIntents }) 
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

// ------

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Collection();
for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	client.commands.set(command.cmd.data.name, command.cmd);
}

client.buttons = new Collection();
for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	if (command.btn) {
   	for (let button of command.btn) {
     	client.buttons.set(button.name, button);
   	}
	}
}

// ------

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ------

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => console.log("Успешное подключение к Mongo"))

// ------


client.login(process.env.TOKEN);