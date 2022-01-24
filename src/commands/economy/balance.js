const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const checkPerms = require(`${__main}/controllers/permissionsController.js`).check;
const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds, Profile } = require(`${__main}/mongo/index.js`).schemas;
const numbers = new Intl.NumberFormat('de-DE');

const commandName = 'balance';
const permissionsPath = 'economy/balance';

module.exports.help = {
	name: commandName,
	aliases: [ 'баланс' ],
	description: [
		 	`_Крч тута можна посмотретб сколька у тибя денях и тута еще можна добавить и убавить денях, вооот._`,
		 	`${icons.options1} **Доступные опции команды:**`,
		 	`・**\`target\`** _(Можно указать пользователя, без этой опции команда применяется на вызвавшего команду)_`,
		 	`・**\`add\`** _(Используется для увеличения баланса пользователя, доступно только админам)_`,
		 	`・**\`remove\`** _(Используется для уменьшения баланса пользователя, доступно только админам)_`
	].join('\n')
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

module.exports.name = commandName;
module.exports.execute = commandExecution;


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
 			`Баланс: ${numbers.format(profile.balance*1)}`
	].join('\n'));
};


const addBalance = async (interaction) => {
	if (!await checkPerms(6, `${permissionsPath}/add`, interaction)) return;
	
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
	if (!await checkPerms(6, `${permissionsPath}/remove`, interaction)) return;
	
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
