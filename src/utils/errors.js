async function commandPermissionsError(data) {
      if (data.interaction) {
            return data.interaction.reply({ content: "❌  У тебя недостаточно прав.", ephemeral: true });
      }
      if (data.message) {
            return data.message.reply({ content: "❌  У тебя недостаточно прав." });
      }
}

async function commandOptionsError(data) {
      if (data.interaction) {
            return data.interaction.reply({ content: "❌  Указаны опции которые нельзя использовать вместе.", ephemeral: true });
      }
      if (data.message) {
            return data.message.reply({ content: "❌  Указаны опции которые нельзя использовать вместе." });
      }
}

module.exports = {
      commandPermissionsError: commandPermissionsError,
      commandOptionsError: commandOptionsError,
}
