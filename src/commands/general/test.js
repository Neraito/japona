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
		{ name: 'main', defaultLevel: 0 },
	],
};

const help = {
	description: `Что это, одному разрабу известно.`,
	options: [],
};

const slashConfig = {
	name: config.name,
	description: 'Dev tests',
	options: [],
};

async function run(data) {
	if (config.disabled) return;
	if (await isCommandDisabled(data.guild.id, config.id)) return;

	if (!await checkCommandPermissions(data, config.features[0].defaultLevel, `${config.id}-${config.features[0].name}`)) return commandPermissionsError(data);
	main(data.interaction)
}


module.exports = {
	config: config,
	help: help,
	slashConfig: slashConfig,
	run: run
};


const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


async function main(interaction) {
      console.log(interaction)
	/*const Guilds = require(`${__main}/schemas/Guilds.js`);
	
	let result = await Guilds.findOne({ guildId: interaction.member.guild.id })
	console.log(result)
	console.log(result.commandsPermissions.get('economy/balance/show'))
	
	let perms = result.commandsPermissions.get('economy/balance/shower')
	let permLvl;
	let permRole;
	if (!perms) permLvl = 5;
	if (perms) permLvl = perms.lvl;
	if (perms?.role) permRole = perms.role;
	
	console.log('\n\n------')
	console.log(permLvl)
	console.log(permRole)
	*/
	//console.log(null + 'a')
	
	await interaction.reply({ content: 'да', ephemeral: true });
}

//module.exports.buttons = [];