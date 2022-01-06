module.exports.help = {
  name: "administryjapona",
  description: "_OverAdmin Adminion — вроде как ИИ но на деле АИ_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('administryjapona')
    .setDescription('Jadministratiiiiiiiiiionn — японофикация сервера')
  );
  commandDataArray.push({
    name: "administryjapona",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}