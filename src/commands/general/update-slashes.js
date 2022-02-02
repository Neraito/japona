const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);

const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


const commandName = __filename.split('/').slice(-1).join('/').slice(0, -3);
const commandId = __filename.split('/').slice(-2).join('/').slice(0, -3);

const commandIsDisabled = async function (guildId) {
	return Boolean( await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} }) );
};

const commandHelp = {
	name: commandName,
	aliases: [ 'обновить-слэши' ],
	description: [
		`Позволяет разработчику обновить слэш команды на сервере.`,
	].join('\n'),
	id: commandId,
	isDisabled: commandIsDisabled,
	defaultLevel: 0,
      options: [
            { name: 'server', description: 'Можно указать айди другого сервера.'}
      ]
};

const commandSlash = new SlashCommandBuilder()
 	.setName(commandName)
 	.setDescription('Обновляет слэш команды на сервере')
 	.addStringOption(option => option.setName('server').setDescription('Укажите id сервера который хотите обновить!'));


async function commandExecution(interaction) {
      if (await commandIsDisabled(interaction.guildId)) return;
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

module.exports = {
      name: commandName,
      id: commandId,
      isDisabled: commandIsDisabled,
      help: commandHelp,
      slash: commandSlash,
      execute: commandExecution
};

//module.exports.buttons = [];