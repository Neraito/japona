const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const path = require('path');

const { isCommandDisabled, checkCommandPermissions } = require(`${__main}/utils/utils.js`);
const { commandPermissionsError, commandOptionsError } = require(`${__main}/utils/errors.js`);

const config = {
	name: __filename.split(path.sep).slice(-1).join('-').slice(0, -3),
	id: __filename.split(path.sep).slice(-2).join('-').slice(0, -3),
	aliases: [],
	category: __filename.split(path.sep).slice(-2, -1),
	subcommand: false,
	disabled: false,
	features: [
		{ name: 'main', defaultLevel: 25 },
	],
};

const help = {
	description: `Позволяет разработчику обновить слэш команды на сервере.`,
	options: [],
};

const slashConfig = {
	name: config.name,
	description: 'Обновляет слэш команды на сервере.',
	options: [
            { name: 'server', description: 'Можно указать айди другого сервера.' }
      ]
};

async function run(data) {
	if (config.disabled) return;
	if (await isCommandDisabled(data.guild.id, config.id)) return;

	if (!await checkCommandPermissions(data, config.features[0].defaultLevel, `${config.id}-${config.features[0].name}`)) return commandPermissionsError(data);
	if (data.interaction.user.id != '612409053955620898') return data.interaction.reply({ content: 'Только создатель бота может использовать эту команду!', ephemeral: true });	
	main(data.interaction)
}


module.exports = {
	config: config,
	help: help,
	slashConfig: slashConfig,
	run: run
};


const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


async function main(interaction) {
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