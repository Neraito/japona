const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  MessageActionRow,
  MessageButton
} = require('discord.js');


module.exports.cmd = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Отвечает словом Pong!'),

  async execute(interaction) {
    //console.log(interaction)
    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('PingButton')
      .setLabel('Ping')
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('PingPongButton')
      .setLabel('Pong')
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('PingStopButton')
      .setLabel('Stop')
      .setStyle('DANGER'),
    );
    await interaction.reply({
      content: 'Pong!', components: [row]
    });
  },
};


module.exports.btn = [{
  name: "PingButton",
  async execute(interaction) {
    /*console.log('///// ••••••••• /////\nInteraction:')
      console.log(interaction)
      console.log('///// ====== /////\nSlash User:')
      console.log(interaction.message.interaction.user)
      console.log('--- --- ---\nButton User:')
      console.log(interaction.user)*/

    if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({
      content: "Не смей тыкать на чужие кнопки!", ephemeral: true
    })

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('PingButton')
      .setLabel('Ping')
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('PingPongButton')
      .setLabel('Pong')
      .setStyle('PRIMARY'),
      new MessageButton()
      .setCustomId('PingStopButton')
      .setLabel('Stop')
      .setStyle('DANGER'),
    );
    await interaction.update({
      content: 'Pong again!', components: [row]
    });
  },
},
  {
    name: "PingPongButton",
    async execute(interaction) {
      if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({
        content: "Не смей тыкать на чужие кнопки!", ephemeral: true
      })

      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('PingButton')
        .setLabel('Ping')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('PingPongButton')
        .setLabel('Pong')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('PingStopButton')
        .setLabel('Stop')
        .setStyle('DANGER'),
      );
      await interaction.update({
        content: 'Pong aga... Wait what? Ping!', components: [row]
      });
    }
  },
  {
    name: "PingStopButton",
    async execute(interaction) {
      if (interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({
        content: "Не смей тыкать на чужие кнопки!", ephemeral: true
      })

      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('PingButton')
        .setLabel('Ping')
        .setStyle('PRIMARY')
        .setDisabled(true),
        new MessageButton()
        .setCustomId('PingPongButton')
        .setLabel('Pong')
        .setStyle('PRIMARY')
        .setDisabled(true),
        new MessageButton()
        .setCustomId('PingStopButton')
        .setLabel('Stop')
        .setStyle('DANGER')
        .setDisabled(true),
      );
      await interaction.update({
        content: 'Stoooop! Don\'t ping me!!!', components: [row]
      });
    }
  },
]