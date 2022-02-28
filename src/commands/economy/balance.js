const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const path = require('path');

const { isCommandDisabled, checkCommandPermissions } = require(`${__main}/utils/utils.js`);
const { commandPermissionsError, commandOptionsError } = require(`${__main}/utils/errors.js`);

const config = {
	name: __filename.split(path.sep).slice(-1).join('-').slice(0, -3),
	id: __filename.split(path.sep).slice(-2).join('-').slice(0, -3),
	aliases: [],
	category: __filename.split(path.sep).slice(-2, -1),
	subcommand: true,
	disabled: false,
	features: [
		{ name: 'showBalance', defaultLevel: 0 },
		{ name: 'addBalance', defaultLevel: 6 },
		{ name: 'removeBalance', defaultLevel: 6 },
	]
};

const help = {
	description: `Крч тута можна посмотретб сколька у тибя денях и тута еще можна добавить и убавить денях, вооот.`,
	options: [
		{ name: 'target', description: `Можно указать пользователя, без этой опции команда применяется на вызвавшего команду` },
		{ name: 'add', description: `Используется для увеличения баланса пользователя, доступно только админам` },
		{ name: 'remove', description: `Используется для уменьшения баланса пользователя, доступно только админам` },
	],
};

const slashConfig = {
	name: config.name,
	description: 'Управление балансом пользователя.',
	options: [
		{ name: 'add', type: 'string', description: 'Сколько добавить на баланс.\n🛡 Нужна роль с доступом!' },
		{ name: 'remove', type: 'string', description: 'Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!' },
		{ name: 'target', type: 'user', description: 'На кого использовать команду.' },
	]
};


async function run(data) {
	if (config.disabled) return;
	if (await isCommandDisabled(data.guild.id, config.id)) return;

	const add = data.interaction.options.getString('add');
	const remove = data.interaction.options.getString('remove');

	if (!add && !remove) {
		if (!await checkCommandPermissions(data, config.features[0].defaultLevel, `${config.id}-${config.features[0].name}`)) return commandPermissionsError(data);
		showBalance(data);
	}
	if (add && !remove) {
		if (!await checkCommandPermissions(data, config.features[1].defaultLevel, `${config.id}-${config.features[1].name}`)) return commandPermissionsError(data);
		addBalance(data);
	}
	if (!add && remove) {
		if (!await checkCommandPermissions(data, config.features[2].defaultLevel, `${config.id}-${config.features[2].name}`)) return commandPermissionsError(data);
		removeBalance(data);
	}
	if (add && remove) return commandOptionsError(data);
}


module.exports = {
	config: config,
	help: help,
	slashConfig: slashConfig,
	run: run
};



const icons = require(`${__main}/utils/constants.js`).icons;
const { Guilds, Profile } = require(`${__main}/mongo/index.js`).schemas;
const numbers = new Intl.NumberFormat();


const showBalance = async (data) => {
	const user = data.interaction.options.getUser('target') || data.interaction.user;
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
  
	await data.interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(+profile.balance)}`
	].join('\n'));
};

const addBalance = async (data) => {
	const user = data.interaction.options.getUser('target') || data.interaction.user;
	let add = +data.interaction.options.getString('add');
	if (isNaN(add)) add = 0;
	
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
	profile.balance = +profile.balance + add;
      profile.save();
  
	await data.interaction.reply([
            `>>> <@${profile.userId}>`,
            `Баланс: ${numbers.format(profile.balance)}`
	].join('\n'));
};

const removeBalance = async (data) => {
	const user = data.interaction.options.getUser('target') || data.interaction.user;
	let remove = +data.interaction.options.getString('remove');
	if (isNaN(remove)) remove = 0;
	
	const profile = await Profile.findOne({userId: user.id}) || await Profile.create({userId: user.id});
	profile.balance = (+profile.balance - remove > 0) ? +profile.balance - remove : 0;
      profile.save();
  
	await data.interaction.reply([
		`>>> <@${profile.userId}>`,
		`Баланс: ${numbers.format(profile.balance)}`
	].join('\n'));
};