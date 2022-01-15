const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const fs = require('fs');


module.exports.help = {
  
  name: "/help",
  description: "_Вызывает прямо эту панельку с подсказками, да и что я тебе вообще рассказываю, ты уже вызвал(а) её и прямо сейчас смотришь на неё._"
  
  
};


const pageSize = 3;


module.exports.cmd = {
  
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Список команд с описанием.'),


  async execute(interaction) {
    
    let category = 0;
    let page = 1;
    
    let helpMessage = getHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
    await interaction.reply(helpMessage);
    
  },
  
};

module.exports.btn = [
  
  {
    name: "helpCategory1",
    async execute(interaction) {
      
      console.log(interaction)
      
      let category = interaction.values[0].split('hc')[1];
      let page = 1;
      
      let helpMessage = getHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
      await interaction.update(helpMessage);
      
      
    }
  },
  {
    name: "helpLeft1",
    async execute(interaction) {
      
      let category = interaction.message.embeds[0].footer.text
        .split(' ')[3];
      
      let page = parseInt(interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[0]);
      page -= 1;
      
      
      if (page <= 1) {
        page = 1;
        let helpMessage = getHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
        interaction.update(helpMessage);
      }
      else {
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
        interaction.update(helpMessage);
      }
      
      
    }
  },
  {
    name: "helpLeft2",
    async execute(interaction) {
      
      let category = interaction.message.embeds[0].footer.text
        .split(' ')[3];
      
      let page = parseInt(interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[0]);
      page -= 5;
      
      
      if (page <= 1) {
        page = 1;
        let helpMessage = getHelp(interaction, category, page, pageSize, [1,1,0,0,0,0]);
        interaction.update(helpMessage);
      }
      else {
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
        interaction.update(helpMessage);
      }
      
      
    }
  },
  {
    name: "helpRight1",
    async execute(interaction) {
      
      let category = interaction.message.embeds[0].footer.text
        .split(' ')[3];
      
      let page = parseInt(interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[0]);
      page += 1;
      
      let lastPage = interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[1];
      lastPage = parseInt(lastPage.slice(0, lastPage.length - 4));
      
      
      if (page >= lastPage) {
        page = lastPage;
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,1,1,0]);
        interaction.update(helpMessage);
      }
      else {
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
        interaction.update(helpMessage);
      }
      
      
    }
  },
  {
    name: "helpRight2",
    async execute(interaction) {
      
      let category = interaction.message.embeds[0].footer.text
        .split(' ')[3];
      
      let page = parseInt(interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[0]);
      page += 5;
      
      let lastPage = interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[1];
      lastPage = parseInt(lastPage.slice(0, lastPage.length - 4));
      
      
      if (page >= lastPage) {
        page = lastPage;
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,1,1,0]);
        interaction.update(helpMessage);
      }
      else {
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
        interaction.update(helpMessage);
      }
      
      
    }
  },
  {
    name: "helpTypePage1",
    async execute(interaction) {
      
      let category = interaction.message.embeds[0].footer.text
        .split(' ')[3];
        
      let lastPage = interaction.message.embeds[0].footer.text
        .split(' ')[2].split('/')[1];
      lastPage = lastPage.slice(0, lastPage.length - 4);
      
      await interaction.reply({content: "Отправьте в чат номер страницы!", ephemeral: true});
      
      
      let filter = (m) => { return m.author.id === interaction.user.id };
      let collector = interaction.channel.createMessageCollector({filter, time: 20000});
      
      collector.on('collect', (message) => {
        
        message.delete().catch(e => {});
        
        let page = parseInt(message.content);
        if (isNaN(page)) page = 1;
        if (page < 1) page = 1;
        if (page > lastPage) page = lastPage;
        
        let helpMessage = getHelp(interaction, category, page, pageSize, [0,0,0,0,0,0]);
        interaction.editReply(helpMessage);
        
      });
      
      
    }
  },
  
];

function getHelp(interaction, category, page, pageSize, buttonsState) {
  
  let commands = helpData.commands[category];
  let categories = helpData.categories[category];
  
  let lastPage = Math.ceil(commands.length / pageSize);
  if (page > lastPage) page = lastPage;
  if (page < 1) page = 1;
  
  
  if (page <= 1) startPage = 0;
  else startPage = page - 1;
  
  let helpDesc = `**${categories.description}**\n`;
  for (let i = pageSize * startPage; i < (pageSize * (page - 1) + pageSize); i++) {
    
    if (i < commands.length) {
      helpDesc = [
      helpDesc,
      `${icons.slash1} ${categories.path} **${commands[i].name}**`,
      `${commands[i].description}\n`
      ].join('\n');
    }
    
    
  }
  
  let helpEmbed = new MessageEmbed()
    .setColor('#ff99ff')
    .setTitle(`**${categories.name}** `)
    .setDescription(helpDesc/*helpDesc.slice(0, helpDesc.length - 1)*/ + '_ _')
    .setFooter(`📖 Страница: ${page}/${lastPage}\n🆔️ ${category}`);
  
  
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
  
  
  let categoryOptions = [];
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
      .setDisabled(buttonsState[5]),
  );
  
  
  return {
    embeds: [helpEmbed],
    components: [row, row2]
  };
  
  
  
  
}