const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

global.client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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



client.login(process.env.TOKEN);