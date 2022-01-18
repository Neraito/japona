const fs = require('fs');


module.exports = {
  
  name: 'ready',
  once: true,
  async execute(bot) {
    
    console.log(`Готово! Бот залогинен под аккаунтом ${bot.user.tag}`);
    
    global.helpData = createHelpData();
    
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