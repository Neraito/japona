const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');
const sleep = require('util').promisify(setTimeout);

const Profile = require('../schemas/Profile.js');


// === /// === /// ===


const showSubcommand = async (interaction) => {
  let user = await Profile.findOne({
    userId: interaction.user.id
  });
  if (!user) {
    user = await Profile.create({
      userId: interaction.user.id,
    })
  }
  /////
  await interaction.reply(`>>> <@${user.userId}>\nБаланс: ${new Intl.NumberFormat().format(user.balance*1)}`)
};


// --- --- ---


const balanceShow = async (interaction) => {
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  /////
  let profile = await Profile.findOne({
    userId: user.id
  });
  if (!profile) {
    profile = await Profile.create({
      userId: user.id,
    })
  }
  /////
  await interaction.reply(`>>> <@${profile.userId}>\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`)
};
// ---
const balanceAdd = async (interaction) => {
  let add = interaction.options.getString('add');
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  /////
  let profile = await Profile.findOne({
    userId: user.id
  });
  if (!profile) {
    profile = await Profile.create({
      userId: user.id,
    })
  };
  /////
  await Profile.updateOne({
    userId: user.id,
  }, {
    $set: {
      balance: profile.balance*1 + add*1,
    }
  });
  profile = await Profile.findOne({
    userId: user.id,
  });
  /////
  await interaction.reply(`>>> <@${profile.userId}>\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`)
};
// ---
const balanceRemove = async (interaction) => {
  let remove = interaction.options.getString('remove');
  let user = interaction.options.getUser('target');
  if (!user) user = interaction.user;
  /////
  let profile = await Profile.findOne({
    userId: user.id
  });
  if (!profile) {
    profile = await Profile.create({
      userId: user.id,
    })
  };
  /////
  let newBalance = profile.balance*1 - remove*1;
  if (newBalance < 0) newBalance = 0;
  await Profile.updateOne({
    userId: user.id,
  }, {
    $set: {
      balance: newBalance,
    }
  });
  profile = await Profile.findOne({
    userId: user.id,
  });
  /////
  await interaction.reply(`>>> <@${profile.userId}>\nБаланс: ${new Intl.NumberFormat().format(profile.balance*1)}`)
}

// ---

const balanceSubcommand = async (interaction) => {
  if (!interaction.options.getString('add') && !interaction.options.getString('remove')) {
    balanceShow(interaction)
  } else if (interaction.options.getString('add') && !interaction.options.getString('remove')) {
    balanceAdd(interaction)
  } else if (!interaction.options.getString('add') && interaction.options.getString('remove')) {
    balanceRemove(interaction)
  }
};


// === /// === /// ===


module.exports.cmd = {
  data: new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Посмотреть свой профиль пользователя.')
  .addSubcommand(subcommand =>
    subcommand
    .setName('show')
    .setDescription('Показать профиль.')
  )
  .addSubcommand(subcommand =>
    subcommand
    .setName('balance')
    .setDescription('Управление балансом.')
    .addStringOption(option => option.setName('add').setDescription('Укажите сколько добавить пользователю денег.'))
    .addStringOption(option => option.setName('remove').setDescription('Укажите сколько забрать у пользователя денег.'))
    .addUserOption(option => option.setName('target').setDescription('Используется если нужно изменить баланс другого пользователя.'))
  ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'show') {
      showSubcommand(interaction);
    } else if (interaction.options.getSubcommand() === 'balance') {
      balanceSubcommand(interaction);
    }
  },
}