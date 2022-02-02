const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);

const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


const commandName = __filename.split('/').slice(-1).join('/').slice(0, -3);
const commandId = __filename.split('/').slice(-2).join('/').slice(0, -3);

const commandIsDisabled = async function (guildId) {
	return Boolean( await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} }) );
};

const commandHelp = {
	name: commandName,
	aliases: [ 'тест' ],
	description: [
		`Что это, одному разрабу известно.`
	].join('\n'),
	id: commandId,
	isDisabled: commandIsDisabled,
	defaultLevel: 0
};

const commandSlash = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription('Dev tests');


async function commandExecution(interaction) {
      if (await commandIsDisabled(interaction.guildId)) return;
      
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

module.exports = {
      name: commandName,
      id: commandId,
      isDisabled: commandIsDisabled,
      help: commandHelp,
      slash: commandSlash,
      execute: commandExecution
};

//module.exports.buttons = [];