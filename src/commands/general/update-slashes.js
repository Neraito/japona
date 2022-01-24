const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);

const icons = require(`${__main}/utils/constants.js`).icons;

const commandName = 'update-slashes';

module.exports.help = {
	name: `/${commandName}`,
	description: [
		`_Позволяет разработчику обновить слэш команды на сервере._`,
		`${icons.options1} **Доступные опции команды:**`,
		`・**\`server\`** _(Можно указать айди другого сервера.)_`
	].join('\n')
};

module.exports.slash = new SlashCommandBuilder()
	 		.setName(commandName)
	 		.setDescription('Обновляет слэш команды на сервере')
	 		.addStringOption(option => option.setName('server').setDescription('Укажите id сервера который хотите обновить!'));

module.exports.name = commandName;
module.exports.execute = commandExecution;


async function commandExecution(interaction) {
	if (interaction.user.id != '612409053955620898') return interaction.reply({ content: 'Только создатель бота может использовать эту команду!', ephemeral: true });			
	const server = interaction.options.getString('server');
	
	if (!server) {
		try {
			await require(`${__main}/commands/updateSlashes.js`)(interaction.guildId);
			await interaction.reply({ content: `Слэш команды на сервере **${interaction.guild.name}** были обновлены!` });
		}
		catch (err) {
			console.error(err);
			await interaction.reply({ content: `При обновлении слэш команд на сервере **${interaction.guild.name}** произошла ошибка!` });
		}
	}
	
	if (server) {
		try {
			await require(`${__main}/commands/updateSlashes.js`)(server);
			await interaction.reply({ content: `Слэш команды на сервере **${await bot.guilds.resolve(server)}** были обновлены!` });
		}
		catch (err) {
			console.error(err);
			await interaction.reply({ content: `При обновлении слэш команд на сервере **${await bot.guilds.resolve(server)}** произошла ошибка!` });
		}
	}
}

//module.exports.buttons = [];