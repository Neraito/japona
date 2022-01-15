const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const permissionsController = require(`${__main}/controllers/permissionsController.js`);

module.exports.help = {
  name: "/test",
  description: "_Что это, одному разрабу известно._"
};

module.exports.cmd = {
  data: new SlashCommandBuilder()
  .setName('test')
  .setDescription('Dev tests'),

  async execute(interaction) {
    
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
    
    await interaction.reply({
      content: 'да', ephemeral: true
    });
  },
};


//module.exports.btn = [];