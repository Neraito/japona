const fs = require('fs');

async function loadSlashCommands() {
      /* const commandsCategories = fs.readdirSync(`${__main}/commands/`).filter(f => !f.endsWith('.js'));
      commandsCategories.forEach(category => {
            const categorySlashCommands = new Set();

            const commands = fs.readdirSync(`${__main}/commands/${category}/`).filter(f => f.endsWith('.js'));
            commands.forEach(command => {
                  command = require(`${__main}/commands/${category}/${command}`);

                  if (!command.config.subcommand) bot.commands2.set(command.config.name, command.run);
                  else categorySlashCommands.add({ name: command.config.name, subcommands: new Map() }).set(command.config.name, command.run);

                  if (command.buttons) command.buttons.forEach(button => bot.buttons2.set(button.name, button)); 
            })

            categorySlashCommands.forEach(slashCommand => {
                  async function execute(data) {
                        const subcommand = data.interaction.options.getSubcommand();

                        slashCommand.subcommands.forEach((run, name) => {
                              if (subcommand === name) run(data);
                        })
                  }
                  console.log('tvar')
                  bot.commands2.set(slashCommand.name, execute)
            })
      }) */
      
      const commandsFolder = fs.readdirSync(`${__main}/commands/`).filter(f => !f.endsWith('.js'));
      console.log(commandsFolder)
      commandsFolder.forEach(categoryName => {
            const commands = new Map();
            console.log(categoryName)
            const category = fs.readdirSync(`${__main}/commands/${categoryName}/`).filter(f => f.endsWith('.js'));
            console.log(category)
            category.forEach(commandName => {
                  const command = require(`${__main}/commands/${categoryName}/${commandName}`);
                  if (!command.config?.subcommand) bot.commands2.set(command.config.name, command.run);
                  else {
                        if (!commands.has(command.config?.category)) commands.set(command.config.category, new Map());
                        const slashCommand = commands.get(command.config?.category);
                        slashCommand.set(command.config?.name, command.run);
                  }
                  command.buttons?.forEach(button => {
                        bot.buttons2.set(button.name, button);
                  });
            });
      
            commands.forEach((subcommands, command) => {
                  console.log(command)
                  async function run(data) {
                        const subcommand = subcommands.get(data.interaction.options.getSubcommand());
                        if (subcommand) subcommand(data);
                  }
                  bot.commands2.set(command[0], run);
            });
      });
    
      console.log(bot.commands2);
      console.log(bot.buttons2);
}

module.exports = loadSlashCommands;