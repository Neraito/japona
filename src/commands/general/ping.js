const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);

const commandName = 'ping';

module.exports.help = {
	name: `/${commandName}`,
	description: `_Пингующая тыкалка с кнопками._`
};

module.exports.slash = new SlashCommandBuilder()
	 		  .setName(commandName)
	 		  .setDescription('Отвечает словом Pong!');

module.exports.name = commandName;
module.exports.execute = commandExecution;


async function commandExecution(interaction) {
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