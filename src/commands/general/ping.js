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
	description: `Пингующая тыкалка с кнопками.`,
	options: [],
};

const slashConfig = {
	name: config.name,
	description: 'Отвечает словом Pong!',
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
      //console.log(interaction)
	const row = new MessageActionRow()
	.addComponents(
	new MessageButton()
		.setCustomId('PingButton')
		.setLabel('Ping')
		.setStyle('PRIMARY'),
	new MessageButton()
		.setCustomId('PingPongButton')
		.setLabel('Pong')
		.setStyle('PRIMARY'),
	new MessageButton()
		.setCustomId('PingStopButton')
		.setLabel('Stop')
		.setStyle('DANGER'),
	);
  
	const row2 = new MessageActionRow()
	.addComponents(
	new MessageSelectMenu()
		.setCustomId('testSelectMenu')
		.setPlaceholder('Где ты здесь пинг увидел?')
		.addOptions([
		{
			label: 'Пинг?',
			description: 'В общем...',
			value: 'PingMenuOption1'
		},
		{
			label: 'Понг?',
			description: 'Если хочешь реальный пинг...',
			value: 'PingMenuOption2'
		},
		{
			label: 'или Пинг?',
			description: 'Тебе просто нужно поставить...',
			value: 'PingMenuOption3'
		},
		{
			label: 'или Понг?',
			description: 'Символ @ перед ником...',
			value: 'PingMenuOption4'
		},
		{
			label: 'может всетаки Пинг?',
			description: 'И тогда тебя человек возненавидит.',
			value: 'PingMenuOption5'
		},
		])
	);
  
	//console.log(interaction)
	//console.log(await permissionsController.check(6, interaction));
  
  await interaction.reply({ content: 'Pong! ' + bot.ws.ping + "ms", components: [row, row2] });			
}



module.exports.buttons = [
{
	name: "PingButton",
	async execute(interaction) {
		/*console.log('///// ••••••••• /////\nInteraction:')
		console.log(interaction)
		console.log('///// ====== /////\nSlash User:')
		console.log(interaction.message.interaction.user)
		console.log('--- --- ---\nButton User:')
		console.log(interaction.user)*/
		
		if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({ content: "Не смей тыкать на чужие кнопки!", ephemeral: true });			
		
		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
			.setCustomId('PingButton')
			.setLabel('Ping')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('PingPongButton')
			.setLabel('Pong')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('PingStopButton')
			.setLabel('Stop')
			.setStyle('DANGER'),
		);
		
		await interaction.update({ content: 'Pong again! ' + bot.ws.ping + "ms", components: [row] });			
	},
},
{
	name: "PingPongButton",
	async execute(interaction) {
		if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({ content: "Не смей тыкать на чужие кнопки!", ephemeral: true });			
		
		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
			.setCustomId('PingButton')
			.setLabel('Ping')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('PingPongButton')
			.setLabel('Pong')
			.setStyle('PRIMARY'),
		new MessageButton()
			.setCustomId('PingStopButton')
			.setLabel('Stop')
			.setStyle('DANGER'),
		);
		
		await interaction.update({ content: 'Pong aga... Wait what? Ping! ' + bot.ws.ping + "ms", components: [row] });			
	}
},
{
	name: "PingStopButton",
	async execute(interaction) {
		if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({ content: "Не смей тыкать на чужие кнопки!", ephemeral: true });					
		
		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
			.setCustomId('PingButton')
			.setLabel('Ping')
			.setStyle('PRIMARY')
			.setDisabled(true),
		new MessageButton()
			.setCustomId('PingPongButton')
			.setLabel('Pong')
			.setStyle('PRIMARY')
			.setDisabled(true),
		new MessageButton()
			.setCustomId('PingStopButton')
			.setLabel('Stop')
			.setStyle('DANGER')
			.setDisabled(true),
		);
		
		await interaction.update({ content: 'Stoooop! Don\'t ping me!!! ' + bot.ws.ping + "ms", components: [row] });			
	}
},
];