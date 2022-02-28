const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
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
	description: `Вызывает прямо эту панельку с подсказками, да и что я тебе вообще рассказываю, ты уже вызвал(а) её и прямо сейчас смотришь на неё.`,
	options: [],
};

const slashConfig = {
	name: config.name,
	description: 'Список команд с описанием.',
	options: [],
};

async function run(data) {
	if (config.disabled) return;
	if (await isCommandDisabled(data.guild.id, config.id)) return;

	if (!await checkCommandPermissions(data, config.features[0].defaultLevel, `${config.id}-${config.features[0].name}`)) return commandPermissionsError(data);
	main(data)
}


module.exports = {
	config: config,
	help: help,
	slashConfig: slashConfig,
	run: run
};


const fs = require('fs');

const { icons, invisibleImage } = require(`${__main}/utils/constants.js`);
const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


const pageSize = 2;

async function main(data) {
      const category = 0;
	const page = 1;
	await data.interaction.reply( await prepareHelp(data.interaction, category, page, pageSize, [1,1,0,0,0,0]) );
}


module.exports.buttons = [
{
	name: "helpCategory1",
	async execute(interaction) {
		//console.log(interaction.message.embeds)
		const category = interaction.values[0].split('hc')[1];
		const page = 1;
		await interaction.update( await prepareHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]) );
	}
},
{
	name: "helpLeft1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.categoryId;
		let page = embedParams.page - 1;
		
		if (page <= 1) await interaction.update( await prepareHelp(interaction, category, 1, pageSize, [1,1,0,0,0,0]) );
		else await interaction.update( await prepareHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]) );
	}
},
{
	name: "helpLeft2",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.categoryId;
		let page = embedParams.page - 5;
		
		if (page <= 1) await interaction.update( await prepareHelp(interaction, category, 1, pageSize, [1,1,0,0,0,0]) );
		else await interaction.update( await prepareHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]) );
	}
},
{
	name: "helpRight1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.categoryId;
		let page = embedParams.page + 1;
		const lastPage = embedParams.lastPage;
		
		if (page >= lastPage) await interaction.update( await prepareHelp(interaction, category, lastPage, pageSize, [0,0,0,1,1,0]) );
		else await interaction.update( await prepareHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]) );
	}
},
{
	name: "helpRight2",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.categoryId;
		let page = embedParams.page + 5;
		const lastPage = embedParams.lastPage;
		
		if (page >= lastPage) await interaction.update( await sendHelp(interaction, category, lastPage, pageSize, [0,0,0,1,1,0]) );
		else await interaction.update( await prepareHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]) );
	}
},
{
	name: "helpTypePage1",
	async execute(interaction) {
		const embedParams = JSON.parse(interaction.message.embeds[0].thumbnail.url.split('??')[1]);
		console.log(embedParams)
		const category = embedParams.categoryId;
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
			
			await interaction.editReply( await prepareHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]) );
		});
	}
},
];



async function prepareHelp(interaction, categoryId, page, pageSize, buttonsState) {
	
	const helpData = await buildHelp();
	const commandsHelp = helpData.commands[categoryId];
	const categoryHelp = helpData.categories[categoryId];
	
	let lastPage = Math.ceil(commandsHelp.length / pageSize);
	if (page > lastPage) page = lastPage;
	if (page < 1) page = 1;
  
  
	if (page <= 1) startPage = 0;
	else startPage = page - 1;
  
	let helpDesc = `**${categoryHelp.description}**\n`;
	for (let i = pageSize * startPage; i < (pageSize * (page - 1) + pageSize); i++) {
		
		if (i >= commandsHelp.length) continue;
		
		const categoryName = (commandsHelp[i]?.subcommandCategory) ? (commandsHelp[i].subcommandCategory + ' ') : '';                  
		
		helpDesc = [
                  helpDesc,
                  `${icons.slash1} /${categoryName}**${commandsHelp[i].name}**`,
                  `_${commandsHelp[i].description}_`
		].join('\n');
		
            if (commandsHelp[i]?.options) {
                  let commandOptions = `${icons.options1} **Доступные опции команды:**`;
                  commandsHelp[i].options.forEach(option => commandOptions = `${commandOptions}\n・**\`${option.name}\`** _(${option.description})_`);               
                  helpDesc = `${helpDesc}\n${commandOptions}\n`;
            }
            else helpDesc = helpDesc + '\n';
		
	}
  
	const helpEmbed = new MessageEmbed()
		.setColor('#ff99ff')
		.setTitle(`**${categoryHelp.name}** `)
		.setDescription(helpDesc + '\u200b')
		.setFooter({ text: `📖 Страница: ${page}/${lastPage}` })
		.setThumbnail(`${invisibleImage}??{"categoryId":"${categoryId}","page":"${page}","lastPage":"${lastPage}"}`);
  
  
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