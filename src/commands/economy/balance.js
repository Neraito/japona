const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds, Profile } = require(`${__main}/mongo/index.js`).schemas;
const numbers = new Intl.NumberFormat();


const commandName = __filename.split('/').slice(-1).join('/').slice(0, -3);
const commandId = __filename.split('/').slice(-2).join('/').slice(0, -3);

const commandIsDisabled = async function (guildId) {
	return Boolean( await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} }) );
};

const commandHelp = {
	name: commandName,
	subcommandCategory: commandId.split('/')[0],
	aliases: [ 'баланс' ],
	description: [
	 	`Крч тута можна посмотретб сколька у тибя денях и тута еще можна добавить и убавить денях, вооот.`,
	].join('\n'),
	id: commandId,
	isDisabled: commandIsDisabled,
	defaultLevel: 0,
	options: [
	 	{ name: 'target', description: `Можно указать пользователя, без этой опции команда применяется на вызвавшего команду` },
	 	{ name: 'add', defaultLevel: 6, description: `Используется для увеличения баланса пользователя, доступно только админам` },
	 	{ name: 'remove', defaultLevel: 6, description: `Используется для уменьшения баланса пользователя, доступно только админам` },
	]
};

function commandSlash(slashCommand) {
	slashCommand.addSubcommand(subcommand =>
		subcommand
            .setName(commandName)
            .setDescription('Управление балансом пользователя.')
            .addStringOption(option => option.setName('add').setDescription('Сколько добавить на баланс.\n🛡 Нужна роль с доступом!'))			
            .addStringOption(option => option.setName('remove').setDescription('Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!'))			
            .addUserOption(option => option.setName('target').setDescription('На кого использовать команду.'))			
	);
}

module.exports = {
      name: commandName,
      id: commandId,
      isDisabled: commandIsDisabled,
      help: commandHelp,
      slash: commandSlash,
      execute: commandExecution
};


async function checkPermissions(interaction, params) {
	const checkPerms = require(`${__main}/controllers/permissionsController.js`).check;
	return await checkPerms(commandHelp.options[params.optionIndex].defaultLevel, `${commandId}/${commandHelp.options[params.optionIndex].name}`, interaction);			
}


async function commandExecution(interaction) {
	const add = interaction.options.getString('add');
	const remove = interaction.options.getString('remove');
	
	if (!add && !remove) await showBalance(interaction);
	if (add && !remove) await addBalance(interaction);
	if (!add && remove) await removeBalance(interaction);
	if (add && remove) interaction.reply({ content: 'Выбери что-то одно: добавить или убавить.', ephemeral: true });
}


const showBalance = async (interaction) => {
	const user = interaction.options.getUser('target') || interaction.user;
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
  
	await interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(+profile.balance)}`
	].join('\n'));
};

const addBalance = async (interaction) => {
	if (!await checkPermissions(interaction, { optionIndex: 1 })) return;
	
	const user = interaction.options.getUser('target') || interaction.user;
	let add = +interaction.options.getString('add');
	if (isNaN(add)) add = 0;
	
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
	profile.balance = +profile.balance + add;
      profile.save();
  
	await interaction.reply([
            `>>> <@${profile.userId}>`,
            `Баланс: ${numbers.format(profile.balance)}`
	].join('\n'));
};

const removeBalance = async (interaction) => {
	if (!await checkPermissions(interaction, { optionIndex: 2 })) return;
	
	const user = interaction.options.getUser('target') || interaction.user;
	let remove = +interaction.options.getString('remove');
	if (isNaN(remove)) remove = 0;
	
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
	profile.balance = (+profile.balance - remove > 0) ? +profile.balance - remove : 0;
      profile.save();
  
	await interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(profile.balance)}`
	].join('\n'));
};