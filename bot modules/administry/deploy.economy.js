const fs = require('fs');

module.exports = (botCommands) => {
  /*const categorizedCommands = fs.readdirSync('./bot modules/economy/commands').filter(file => file.endsWith('.js'));

  for (let command of categorizedCommands) {
    command = require(`./commands/${command}`);
    botCommands.push(command.cmd.data.toJSON());
  }*/
  
  const { SlashCommandBuilder } = require('@discordjs/builders');
  
  let slashCommand = new SlashCommandBuilder()
    .setName('administry')
    .setDescription('.');
  let subcommands = [];
  
  let testCommands = fs.readdirSync('./bot modules/administry/commands').filter(file => file.endsWith('.js'));
  for (let testCommand of testCommands) {
    testCommand = require(`./commands/${testCommand}`);
    testCommand.init(slashCommand, subcommands);
  }
  
  botCommands.push(slashCommand.toJSON());
  
  /*commandData = new SlashCommandBuilder()
    .setName('economy')
    .setDescription('.')
  
  let cmd = {
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('.')
    .addSubcommand(subcommand =>
      subcommand
      .setName('show')
      .setDescription('Показать профиль.')
    )
    .addSubcommand(subcommand =>
      subcommand
      .setName('balance')
      .setDescription('Управление балансом пользователя.')
      .addStringOption(option => option.setName('add').setDescription('Сколько добавить на баланс.\n🛡 Нужна роль с доступом!'))
      .addStringOption(option => option.setName('remove').setDescription('Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!'))
      .addUserOption(option => option.setName('target').setDescription('На кого использовать команду.'))
    ),
  
    async execute(interaction) {
      let subcommand = interaction.options.getSubcommand();
      
      if (subcommand === 'show') showBalance_Subcommand(interaction);
      else if (subcommand === 'balance') editBalance_Subcommand(interaction);
    },
  };*/
};