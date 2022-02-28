const { Guilds } = require(`${__main}/mongo/index.js`).schemas;


async function isCommandDisabled(guildId, commandId) {
      const result = await Guilds.findOne({ guildId: guildId, disabledCommands: {$in:[commandId]} });
      return Boolean(result);
}

async function checkCommandPermissions(data, defaultLvl, featureId) {
	const guild = data.guild;
	const member = data.author;
	
	const dbGuild = await Guilds.findOne({ guildId: guild.id});
	const commandPermissions = dbGuild.commandsPermissions.get(featureId);
	
	if (await member.roles.cache.find(r => commandPermissions?.roles.includes(r.id))) return true;
	
	if (defaultLvl < 0) defaultLvl = 0;
	if (defaultLvl > 10) defaultLvl = 10;
	const commandPermLvl = commandPermissions?.lvl || defaultLvl;
	console.log('Required level: ' + commandPermLvl)
	
	const memberPermLvl = await member.roles.cache.reduce((mem, cur) => mem = Math.max(mem, dbGuild.permissionLevelRoles.indexOf(cur.id)), -1);					
	console.log('Member lvl: ' + memberPermLvl)
	
	if (memberPermLvl >= commandPermLvl) return true;
	else return false;
}


module.exports = {
      isCommandDisabled: isCommandDisabled,
      checkCommandPermissions: checkCommandPermissions,
}