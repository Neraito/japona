const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const fs = require('fs');

const { icons, invisibleImage } = require(`${__main}/utils/constants.js`);

const commandName = 'help';

module.exports.help = {
	 	name: `/${commandName}`,
	 	description: `_Вызывает прямо эту панельку с подсказками, да и что я тебе вообще рассказываю, ты уже вызвал(а) её и прямо сейчас смотришь на неё._`			
};

module.exports.slash = new SlashCommandBuilder()
 		.setName(commandName)
 		.setDescription('Список команд с описанием.');

module.exports.name = commandName;
module.exports.execute = commandExecution;


const pageSize = 2;

async function commandExecution(interaction) {
	const category = 0;
	const page = 1;
	await sendHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
}


module.exports.buttons = [
{
	name: "helpCategory1",
	async execute(interaction) {
		//console.log(interaction.message.embeds)
		const category = interaction.values[0].split('hc')[1];
		const page = 1;
		await sendHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
	}
},
{
	name: "helpLeft1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.category;
		let page = embedParams.page - 1;
		
		if (page <= 1) await sendHelp(interaction, category, 1, pageSize, [1,1,0,0,0,0]);
		else await sendHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
	}
},
{
	name: "helpLeft2",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.category;
		let page = embedParams.page - 5;
		
		if (page <= 1) await sendHelp(interaction, category, 1, pageSize, [1,1,0,0,0,0]);
		else await sendHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
	}
},
{
	name: "helpRight1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.category;
		let page = embedParams.page + 1;
		const lastPage = embedParams.lastPage;
		
		if (page >= lastPage) await sendHelp(interaction, category, lastPage, pageSize, [0,0,0,1,1,0]);
		else await sendHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
	}
},
{
	name: "helpRight2",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.category;
		let page = embedParams.page + 5;
		const lastPage = embedParams.lastPage;
		
		if (page >= lastPage) await sendHelp(interaction, category, lastPage, pageSize, [0,0,0,1,1,0]);
		else await sendHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
	}
},
{
	name: "helpTypePage1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.category;
		const lastPage = embedParams.lastPage;
		
		await interaction.reply({ content: "Отправьте в чат номер страницы!", ephemeral: true });
		
		const filter = (m) => { return m.author.id === interaction.user.id };
		const collector = interaction.channel.createMessageCollector({filter, time: 20000});
		
		collector.on('collect', async (message) => {
			message.delete().catch(e => {});
			
			let page = parseInt(message.content);
			if (isNaN(page)) page = 1;
			if (page < 1) page = 1;
			if (page > lastPage) page = lastPage;
			
			await editHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
		});
	}
},
];


async function sendHelp(...args) {
	const help = await prepareHelp(...args);
	return args[0].reply(help);
}
async function sendHelpEphemeral(...args) {
	const help = await prepareHelp(...args);
	help['ephemeral'] = true;
	return args[0].reply(help);
}
async function editHelp(...args) {
	const help = await prepareHelp(...args);
	return args[0].editReply(help);
}

async function prepareHelp(interaction, category, page, pageSize, buttonsState) {
	
	const helpData = await buildHelp();
	const commands = helpData.commands[category];
	const categories = helpData.categories[category];
	
	let lastPage = Math.ceil(commands.length / pageSize);
	if (page > lastPage) page = lastPage;
	if (page < 1) page = 1;
  
  
	if (page <= 1) startPage = 0;
	else startPage = page - 1;
  
	let helpDesc = `**${categories.description}**\n`;
	for (let i = pageSize * startPage; i < (pageSize * (page - 1) + pageSize); i++) {
		
		if (i >= commands.length) continue;
		helpDesc = [
			 	helpDesc,
			 	`${icons.slash1} ${categories.path} **${commands[i].name}**`,
			 	`${commands[i].description}\n`
		].join('\n');
		
	}
  
	const helpEmbed = new MessageEmbed()
 			.setColor('#ff99ff')
 			.setTitle(`**${categories.name}** `)
 			.setDescription(helpDesc + '_ _')
 			.setFooter({ text: `📖 Страница: ${page}/${lastPage}` })
 			.setThumbnail(`${invisibleImage}??{"category":"${category}","page":"${page}","lastPage":"${lastPage}"}`);
  
  
	const row = new MessageActionRow()
	.addComponents(
	new MessageButton()
		 .setCustomId('helpLeft1')
		 .setEmoji(icons.left1)
		 .setStyle(2)
		 .setDisabled(buttonsState[0]),
	new MessageButton()
		.setCustomId('helpLeft2')
		.setEmoji(icons.left2)
		.setStyle(2)
		.setDisabled(buttonsState[1]),
	new MessageButton()
		.setCustomId('helpTypePage1')
		.setEmoji(icons.type1)
		.setStyle(2)
		.setDisabled(buttonsState[2]),
	new MessageButton()
		.setCustomId('helpRight2')
		.setEmoji(icons.right2)
		.setStyle(2)
		.setDisabled(buttonsState[3]),
	new MessageButton()
		.setCustomId('helpRight1')
		.setEmoji(icons.right1)
		.setStyle(2)
		.setDisabled(buttonsState[4]),
	);
  
  
	const categoryOptions = [];
	for (let i = 0; i < helpData.categories.length; i++) {
		
		categoryOptions.push({
			label: helpData.categories[i].name,
			description: helpData.categories[i].description,
			value: `hc${i}`
		});
		
	}
  
	const row2 = new MessageActionRow()
	.addComponents(
	new MessageSelectMenu()
		.setCustomId('helpCategory1')
		.setPlaceholder('Выберите категорию')
		.addOptions(categoryOptions)
		.setDisabled(buttonsState[5])
	);
  
	return {
		embeds: [helpEmbed],
		components: [row, row2]
	};
  
}


async function buildHelp() {
  
	const helpCategories = [];
	const helpCommands = [];
	const commandsDir = `${__main}/commands`;
	const commandsCategories = fs.readdirSync(`${commandsDir}/`).filter(f => (!f.endsWith('.js')));
  
	for (let category of commandsCategories) {
		
		const categoryHelpFile = fs.readdirSync(`${commandsDir}/${category}/`).filter(f => f.startsWith('help.') && f.endsWith('.json'));		
		const categoryHelp = require(`${commandsDir}/${category}/${categoryHelpFile}`);
		helpCategories.push(categoryHelp);
		
		const helpCommandsTemp = [];
		const categoryCommands = fs.readdirSync(`${commandsDir}/${category}/`).filter(f => f.endsWith('.js'));
		
		for (let command of categoryCommands) {
			command = require(`${commandsDir}/${category}/${command}`);
			helpCommandsTemp.push(command.help);
		}
		
		helpCommands.push(helpCommandsTemp);
		
	}
	
	return {
		categories: helpCategories,
		commands: helpCommands
	};
	
}