const fs = require('fs');


module.exports = async () => {
	const commandsModules = fs.readdirSync(`${__dirname}/`).filter(f => (!f.endsWith('.js')));
	
	for (let commandsModule of commandsModules) {
		const commandsModuleHelpFile = fs.readdirSync(`${__dirname}/${commandsModule}/`).filter(f => f.startsWith('help.') && f.endsWith('.json'));			
		const commandsModuleHelpFileData = require(`${__dirname}/${commandsModule}/${commandsModuleHelpFile}`);
		
		if (commandsModuleHelpFileData?.id) await initCommandsModuleWithSubcommands(commandsModule);
		if (!commandsModuleHelpFileData?.id) await initCommandsModuleWithoutSubcommands(commandsModule);
	}
	console.log(bot.commands)
};


async function initCommandsModuleWithoutSubcommands(commandsModule) {
  
	const commands = fs.readdirSync(`${__dirname}/${commandsModule}/`).filter(f => f.endsWith('.js'));
  
	for (let command of commands) {
		command = require(`${__dirname}/${commandsModule}/${command}`);
		bot.commands.set(command.name, command.execute);
		
		if (!command.buttons) continue;
		for (let button of command.buttons) {
			bot.buttons.set(button.name, button);
		}
	}
	
}


async function initCommandsModuleWithSubcommands(commandsModule) {
  
	const commandsData = [];
	const commands = fs.readdirSync(`${__dirname}/${commandsModule}/`).filter(f => f.endsWith('.js'));
  
	for (let command of commands) {
		command = require(`${__dirname}/${commandsModule}/${command}`);
		commandsData.push({ name: command.name, execute: command.execute });
		
		if (!command.buttons) continue;
		for (let button of command.buttons) {
			bot.buttons.set(button.name, button);
		}
	}
	
	async function execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		for (let command of commandsData) {
			if (subcommand === command.name) command.execute(interaction);
		}
	}
  
	bot.commands.set(commandsModule, execute);
	
}