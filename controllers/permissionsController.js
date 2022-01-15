const Guilds = require(`${__main}/schemas/Guilds.js`);
const { Collection } = require('discord.js');


module.exports.check = async (defaultLvl, commandPermissionsPath, interaction) => {
  
  const guild = interaction.member.guild;
  const member = interaction.member;
  const mongoGuild = await Guilds.findOne({ guildId: guild.id});
  const commandPerms = mongoGuild.commandsPermissions.get(commandPermissionsPath);
  console.log(mongoGuild.commandsPermissions)
  
  
  if (commandPerms?.roles) {
    console.log(commandPerms.roles)
    const memberPermRole = await member.roles.cache
      .find(r => {
        for (let role of commandPerms.roles) if (r.id == role) return r.id;
      });
    console.log('роль: ' + memberPermRole?.id)
    if (memberPermRole?.id) return true;
  };
  
  
  if (defaultLvl < 0) defaultLvl = 0;
  if (defaultLvl > 10) defaultLvl = 10;
  let commandPermLvl;
  if (commandPerms?.lvl) commandPermLvl = commandPerms.lvl;
  else commandPermLvl = defaultLvl;
  console.log('лвл: ' + commandPermLvl)
  
  
  let memberPermissionsLvl = -1;
  for (let i = 0; i < mongoGuild.permissionLvls.length; i++) {
    
    const mongoPermLvl = mongoGuild.permissionLvls[i];
    
    const memberLvlRole = await member.roles.cache
      .find(r => r.id == mongoPermLvl);
    
    if (memberLvlRole?.id) memberPermissionsLvl = i;
    //console.log(memberPermissionsLvl)
    
    
  }
  
  if (memberPermissionsLvl >= commandPermLvl) return true;
  else {
    interaction.reply({
      content: "❌  У тебя недостаточно прав.",
      ephemeral: true
    });
    return false;
  }
  
  
  
  
};

module.exports.update = async (permLvl, guild) => {
  
};