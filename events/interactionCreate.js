module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'При вызове команды произошла неизвестная ошибка!', ephemeral: true
        });
      }
    }
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'При нажатии на кнопку произошла неизвестная ошибка!', ephemeral: true
        });
      }
    }
    else return;
  },
};