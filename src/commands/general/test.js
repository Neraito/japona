const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);


module.exports.name = commandName = __filename.split('/').slice(-1).join('/').slice(0, -3);
module.exports.id = commandId = __filename.split('/').slice(-2).join('/').slice(0, -3);

module.exports.isDisabled = isCommandDisabled = async function (guildId) {
	return Boolean( await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} }) );
};

module.exports.help = helpData = {
	name: commandName,
	aliases: [ 'тест' ],
	description: [
		`_Что это, одному разрабу известно._`
	].join('\n'),
	id: commandId,
	isDisabled: isCommandDisabled,
};

module.exports.slash = new SlashCommandBuilder()
	 		.setName(commandName)
	 		.setDescription('Dev tests');


module.exports.execute = async function commandExecution(interaction) {
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
};

//module.exports.buttons = [];