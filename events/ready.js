const fs = require('fs');

module.exports = {
  name: 'ready',
  once: true,
  async execute(bot) {
    console.log(`Готово! Бот залогинен под аккаунтом ${bot.user.tag}`);
    //require(`${__main}/modules/index.js`)()
    
    //initBotModules();
    global.helpData = createHelpData();
    
    const { botId, guildId } = require(`${__main}/lib/config.json`);
    //console.log(await bot.guilds.cache.get(guildId)?.commands.fetch('902844894110945321'));
  },
};


function createHelpData() {
  
  let modulesHelpData = [];
  let modulesCommandsHelpData = [];
  
  let modulesDir = `${__main}/modules`;
  
  let modules = fs.readdirSync(`${modulesDir}/`)
    .filter(f => (!f.endsWith('.js')));
  
  
  for (let module of modules) {
    
    let helpFile = fs.readdirSync(`${modulesDir}/${module}/`)
      .filter(f => f.startsWith('help.'));
    let helpData = require(`${modulesDir}/${module}/${helpFile}`);
    modulesHelpData.push(helpData);
    
    
    let helpDataTemp = [];
    let moduleCommands = fs.readdirSync(`${modulesDir}/${module}/commands/`)
      .filter(f => f.endsWith('.js'));
    
    
    for (let command of moduleCommands) {
      command = require(`${modulesDir}/${module}/commands/${command}`);
      helpDataTemp.push(command.help);
    }
    
    modulesCommandsHelpData.push(helpDataTemp);
    
    
  }
  
  return {
    categories: modulesHelpData,
    commands: modulesCommandsHelpData
  };
  
  
  
  
}