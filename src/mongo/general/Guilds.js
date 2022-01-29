const mongoose = require('mongoose');


const guildsSchema = new mongoose.Schema({
	
	guildId: { type: String, required: true },
	permissionLevelRoles: [{ type: String }],
	commandsPermissions: {
		type: Map,
		of: {
			lvl: { type: Number, required: true },
			roles: [{ type: String }]
		}
	},
	disabledCommands: [{ type: String }]
  
});

const Model = mongoose.model('guilds', guildsSchema);
module.exports = Model;


module.exports.create = async (guildId) => {
	console.log("добавляем новый сервер в бд");
	
      if (await Model.findOne({ guildId: guildId })) return console.log('[ERROR] Гильдия уже занесена в базу данных!');
      
	const lvls = [];
	for (let i = 0; i < 11; i++) lvls.push(null);
  
	const data = {
		guildId: guildId,
		permissionLevelRoles: lvls,
		commandsPermissions: new Map(),
		disabledCommands: []
	};
      
      try {
            console.log(await new Model(data).save());
            console.log('[SUCCESS] Гильдия занесена в базу данных!');
      } catch (err) {
            console.log('[ERROR] При добавлении новой гильдии в базу данных произошла ошибка!\n' + err);
      }
  
};