const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');
const sleep = require('util').promisify(setTimeout);

const GuildSettings = require('../../../schemas/GuildSettings.js');
const Profile = require('../../../schemas/Profile.js');

const checkBotAdmin = async (interaction, functionCallback) => {
  let guildSettings = await GuildSettings.findOne({
    guildId: interaction.guildId
  })
  console.log(guildSettings)
  if (guildSettings?.botAdminRoleId != 'none' && !interaction.member.roles.resolve(guildSettings?.botAdminRoleId)) {
    return interaction.reply({
      content: "У тебя не достаточно прав.",
      ephemeral: true
    })
  } else {
    functionCallback(interaction)
  }
}


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
    await checkBotAdmin(interaction, balanceAdd);
  } else if (!interaction.options.getString('add') && interaction.options.getString('remove')) {
    await checkBotAdmin(interaction, balanceRemove);
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
    .setDescription('Управление балансом пользователя.')
    .addStringOption(option => option.setName('add').setDescription('Сколько добавить на баланс.\n🛡 Нужна роль с доступом!'))
    .addStringOption(option => option.setName('remove').setDescription('Сколько удалить с баланса.\n️🛡 Нужна роль с доступом!'))
    .addUserOption(option => option.setName('target').setDescription('На кого использовать команду.'))
  ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'show') {
      showSubcommand(interaction);
    } else if (interaction.options.getSubcommand() === 'balance') {
      balanceSubcommand(interaction);
    }
  },
}