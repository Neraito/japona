const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

const Profile = require(`${__main}/schemas/Profile.js`);
const GuildSettings = require(`${__main}/schemas/GuildSettings.js`);

module.exports.help = {
  name: "balance",
  description: "_Крч тута можна посмотретб сколька у тибя денях и тута еще можна добавить и убавить денях, вооот._"
  + `\n${icons.options} **Доступные опции команды:**`
  + "\n・**\`target\`** _(Можно указать пользователя, без этой опции команда применяется на вызвавшего команду)_"
  + "\n・**\`add\`** _(Используется для увеличения баланса пользователя, доступно только админам)_"
  + "\n・**\`remove\`** _(Используется для уменьшения баланса пользователя, доступно только админам)_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('balance')
    .setDescription('Управление балансом пользователя.')
    .addStringOption(option => option.setName('add').setDescription('Сколько добавить на баланс.\n🛡 Нужна роль с доступом!'))
    .addStringOption(option => option.setName('remove').setDescription('Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!'))
    .addUserOption(option => option.setName('target').setDescription('На кого использовать команду.'))
  );
  commandDataArray.push({
    name: "balance",
    command: editBalance_Subcommand
  });
};


// === /// === /// === // === === === //


const showBalance_Subcommand = async (interaction) => {
  let user = await Profile.findOne({userId: interaction.user.id});
  if (!user) user = await Profile.create({userId: interaction.user.id});
  
  await interaction.reply(
    `>>> <@${user.userId}>`
    +`\nБаланс: ${new Intl.NumberFormat().format(user.balance*1)}`
  );
};

// --- --- --- // --- --- --- // --- --- --- //

const editBalance_Subcommand = async (interaction) => {
  let add = interaction.options.getString('add');
  let remove = interaction.options.getString('remove');
  
  if (!add && !remove) showBalance(interaction);
  else if (add && !remove) await checkBotAdmin(interaction, addBalance);
  else if (!add && remove) await checkBotAdmin(interaction, removeBalanceemove);
  else if (add && remove) interaction.reply({content: 'Выбери что-то одно, добавить или убавить.', ephemeral: true})
};


const showBalance = async (interaction) => {
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  
  let profile = await Profile.findOne({userId: user.id});
  if (!profile) profile = await Profile.create({userId: user.id});
  
  await interaction.reply(
    `>>> <@${profile.userId}>`
    +`\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`
  );
};

const addBalance = async (interaction) => {
  let add = interaction.options.getString('add');
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  
  let profile = await Profile.findOne({userId: user.id});
  if (!profile) profile = await Profile.create({userId: user.id});
  
  await Profile.updateOne(
    {userId: user.id},
    {$set: {balance: profile.balance*1 + add*1}}
  );
  profile = await Profile.findOne({userId: user.id});
  
  await interaction.reply(
    `>>> <@${profile.userId}>`
    +`\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`
  );
};

const removeBalance = async (interaction) => {
  let remove = interaction.options.getString('remove');
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  
  let profile = await Profile.findOne({userId: user.id});
  if (!profile) profile = await Profile.create({userId: user.id});
  
  let newBalance = profile.balance*1 - remove*1;
  if (newBalance < 0) newBalance = 0;
  
  await Profile.updateOne(
    {userId: user.id},
    {$set: {balance: newBalance}}
  );
  profile = await Profile.findOne({userId: user.id});
  
  await interaction.reply(
    `>>> <@${profile.userId}>`
    +`\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`
  );
};



const checkBotAdmin = async (interaction, functionCallback) => {
  let guildSettings = await GuildSettings.findOne({guildId: interaction.guildId});
  console.log(guildSettings);
  if (guildSettings?.botAdminRoleId != 'none' && !interaction.member.roles.resolve(guildSettings?.botAdminRoleId)) {
    return interaction.reply({
      content: "У тебя недостаточно прав.",
      ephemeral: true
    });
  }
  else {
    functionCallback(interaction);
  }
};

// === /// === /// === // === === === //

/*module.exports.cmd = {
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
