const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds, Profile } = require(`${__main}/mongo/index.js`).schemas;
const numbers = new Intl.NumberFormat();

console.log(__filename.split('/').slice(-1).join('/').slice(0, -3))
console.log(__filename.split('/').slice(-2).join('/').slice(0, -3))

module.exports.name = commandName = __filename.split('/').slice(-1).join('/').slice(0, -3);
module.exports.id = commandId = __filename.split('/').slice(-2).join('/').slice(0, -3);

module.exports.isDisabled = isCommandDisabled = async function (guildId) {
	return Boolean( await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} }) );
};

module.exports.help = helpData = {
	name: commandName,
	subcommandCategory: commandId.split('/')[0],
	aliases: [ 'баланс' ],
	description: [
	 	`_Крч тута можна посмотретб сколька у тибя денях и тута еще можна добавить и убавить денях, вооот._`,
	 	`${icons.options1} **Доступные опции команды:**`,
	 	`・**\`target\`** _(Можно указать пользователя, без этой опции команда применяется на вызвавшего команду)_`,
	 	`・**\`add\`** _(Используется для увеличения баланса пользователя, доступно только админам)_`,
	 	`・**\`remove\`** _(Используется для уменьшения баланса пользователя, доступно только админам)_`
	].join('\n'),
	id: commandId,
	isDisabled: isCommandDisabled,
	options: [
	 	{ name: 'target', description: `Можно указать пользователя, без этой опции команда применяется на вызвавшего команду` },
	 	{ name: 'add', defaultLevel: 6, description: `Используется для увеличения баланса пользователя, доступно только админам` },
	 	{ name: 'remove', defaultLevel: 6, description: `Используется для уменьшения баланса пользователя, доступно только админам` },
	]
};

module.exports.slash = (slashCommand) => {
	slashCommand.addSubcommand(subcommand =>
		subcommand.setName(commandName)
		 	.setDescription('Управление балансом пользователя.')
		 	.addStringOption(option => option.setName('add').setDescription('Сколько добавить на баланс.\n🛡 Нужна роль с доступом!'))			
		 	.addStringOption(option => option.setName('remove').setDescription('Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!'))			
		 	.addUserOption(option => option.setName('target').setDescription('На кого использовать команду.'))			
	);
};


module.exports.execute = async function commandExecution(interaction) {
	const add = interaction.options.getString('add');
	const remove = interaction.options.getString('remove');
	
	if (!add && !remove) await showBalance(interaction);
	if (add && !remove) await addBalance(interaction);
	if (!add && remove) await removeBalance(interaction);
	if (add && remove) interaction.reply({ content: 'Выбери что-то одно: добавить или убавить.', ephemeral: true });
};

async function checkPermissions(interaction, params) {
	const checkPerms = require(`${__main}/controllers/permissionsController.js`).check;
	return checkPerms(helpData.options[params.optionIndex].defaultLevel, `${commandId}/${helpData.options[params.optionIndex].name}`, interaction);			
}

const showBalance = async (interaction) => {
	const user = interaction.options.getUser('target') || interaction.user;
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
  
	await interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(profile.balance*1)}`
	].join('\n'));
};

const addBalance = async (interaction) => {
	if (!await checkPermissions(interaction, { optionIndex: 1 })) return;
	
	let add = interaction.options.getString('add')*1;
	if (isNaN(add)) add = 0;
	const user = interaction.options.getUser('target') || interaction.user;
	let profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
  
	await Profile.updateOne(
		{userId: user.id},
		{$set: {balance: profile.balance*1 + add}},
	);
	profile = await Profile.findOne({userId: user.id});
  
	await interaction.reply([
	 	`>>> <@${profile.userId}>`,
	 	`Баланс: ${numbers.format(profile.balance*1)}`
	].join('\n'));
};

const removeBalance = async (interaction) => {
	if (!await checkPermissions(interaction, { optionIndex: 2 })) return;
	
	let remove = interaction.options.getString('remove')*1;
	if (isNaN(remove)) remove = 0;
	const user = interaction.options.getUser('target') || interaction.user;
	let profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
	
	let newBalance = profile.balance*1 - remove;
	if (newBalance < 0) newBalance = 0;
	
	await Profile.updateOne(
		{userId: user.id},
		{$set: {balance: newBalance}},
	);
	profile = await Profile.findOne({userId: user.id});
  
	await interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(profile.balance*1)}`
	].join('\n'));
};