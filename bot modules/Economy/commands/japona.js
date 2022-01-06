module.exports.help = {
  name: "japona",
  description: "_вроде как ИИ но на деле АИ_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('japona')
    .setDescription('японофикация сервера')
  );
  commandDataArray.push({
    name: "japona",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}