const { Guilds } = require(`${__main}/mongo/index.js`).schemas;
const { Collection } = require('discord.js');


module.exports.check = async (defaultLvl, commandPermissionsPath, interaction) => {
	
	const guild = interaction.member.guild;
	const member = interaction.member;
	
	const dbGuild = await Guilds.findOne({ guildId: guild.id});
	const commandPerms = dbGuild.commandsPermissions.get(commandPermissionsPath);
	console.log(dbGuild.commandsPermissions)
	
	if (await member.roles.cache.find(r => commandPerms?.roles.includes(r.id))) return true;
	
	if (defaultLvl < 0) defaultLvl = 0;
	if (defaultLvl > 10) defaultLvl = 10;
	const commandPermLvl = commandPerms?.lvl || defaultLvl;
	console.log('Required level: ' + commandPermLvl)
	
	const memberPermLvl = await member.roles.cache.reduce((mem, cur) => { mem = Math.max(mem, dbGuild.permissionLevelRoles.indexOf(cur.id)) }, -1);					
	console.log('Member lvl: ' + memberPermLvl)
	
	if (memberPermLvl >= commandPermLvl) return true;
	else {
		interaction.reply({ content: "❌  У тебя недостаточно прав.", ephemeral: true });
		return false;
	}
	
};



module.exports.update = async (permLvl, guild) => {
	
};