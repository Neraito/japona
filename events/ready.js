const fs = require('fs');

module.exports = {
  name: 'ready',
  once: true,
  async execute(bot) {
    console.log(`Готово! Бот залогинен под аккаунтом ${bot.user.tag}`);
    
    botModulesInit();
    global.helpData = createHelpData();
    
    const { botId, guildId } = require(`${__main}/config.json`);
    //console.log(await bot.guilds.cache.get(guildId)?.commands.fetch('902844894110945321'));
  },
};


function botModulesInit() {
  let botModules = fs.readdirSync('./bot modules/');
  
  for (let module of botModules) {
    let initModule = fs.readdirSync(`./bot modules/${module}/`)
      .filter(file => file.startsWith('init.'));
    
    initModule = require(`${__main}/bot modules/${module}/${initModule}`);
    initModule();
  }
}

function createHelpData() {
  let helpAboutModules = [];
  let helpAboutModuleCommands = [];
  
  let botModules = fs.readdirSync('./bot modules/');
  //console.log(botModules)
  
  for (let module of botModules) {
    let helpAboutModule = fs.readdirSync(`./bot modules/${module}/`).filter(file => file.startsWith('help.'));
    
    helpAboutModule = require(`${__main}/bot modules/${module}/${helpAboutModule}`);
    helpAboutModules.push(helpAboutModule);
    //console.log(helpAboutModule)
    
    let moduleCommands = fs.readdirSync(`./bot modules/${module}/commands/`).filter(file => file.endsWith('.js'));
    
    let helpAboutModuleCommandsTemp = [];
    for (let command of moduleCommands) {
      command = require(`${__main}/bot modules/${module}/commands/${command}`);
      helpAboutModuleCommandsTemp.push(command.help);
    }
    helpAboutModuleCommands.push(helpAboutModuleCommandsTemp);
  }
  //console.log(helpAboutModules)
  //console.log(helpAboutModuleCommands)
  
  
  helpAboutModules.push({
    name: '—  О С Т А Л Ь Н О Е  —',
    description: 'Здесь представлены команды и информация о них, которые не попали ни в одну категорию',
    path: ''
  });
  let commands = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
  let commandsTemp = [];
  for (let command of commands) {
    command = require(`${__main}/commands/${command}`);
    commandsTemp.push(command.help);
  }
  helpAboutModuleCommands.push(commandsTemp);
  
  
  return {
    categories: helpAboutModules,
    commands: helpAboutModuleCommands
  };
}