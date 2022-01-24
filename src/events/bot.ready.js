const fs = require('fs');


module.exports = {
  
	name: 'ready',
	once: true,
	async execute(bot) {
		console.log(`[SUCCESS] Бот залогинен под аккаунтом ${bot.user.tag}`);
		global.helpData = createHelpData();
	},
  
};



function createHelpData() {
  
	const modulesHelpData = [];
	const modulesCommandsHelpData = [];
	const modulesDir = `${__main}/commands`;
	const modules = fs.readdirSync(`${modulesDir}/`).filter(f => (!f.endsWith('.js')));
  
	for (let module of modules) {
    
		const helpFile = fs.readdirSync(`${modulesDir}/${module}/`).filter(f => f.startsWith('help.') && f.endsWith('.json'));		
		const helpData = require(`${modulesDir}/${module}/${helpFile}`);
		modulesHelpData.push(helpData);
    
		const helpDataTemp = [];
		const moduleCommands = fs.readdirSync(`${modulesDir}/${module}/`).filter(f => f.endsWith('.js'));
    
		for (let command of moduleCommands) {
      		command = require(`${modulesDir}/${module}/${command}`);
      		helpDataTemp.push(command.help);
		}
    
		modulesCommandsHelpData.push(helpDataTemp);
    
	}
  
	return {
		categories: modulesHelpData,
		commands: modulesCommandsHelpData
	};
  
}