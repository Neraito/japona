module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isCommand()) runCommand(interaction);
		else if (interaction.isButton() || interaction.isSelectMenu()) runButton(interaction);		
		else return;
	},
};


async function runCommand(interaction) {
	
	const command = bot.commands2.get(interaction.commandName);
	if (!command) return;

	const data = {
		guild: interaction.guild,
		author: interaction.member,
		interaction: interaction,
		message: null
	}
  
	try {
		await command(data);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'При вызове команды произошла неизвестная ошибка!', ephemeral: true });		
	}
	
}


async function runButton(interaction) {
	
	const button = bot.buttons2.get(interaction.customId);
	if (!button) return;
  
	try {
		await button.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'При нажатии на кнопку произошла неизвестная ошибка!', ephemeral: true });		
	}
	
}