module.exports.help = {
  name: "administrykanami",
  description: "_Head of Heads of Admins of Adminion — кто он такой не известно, может это она, некоторве говорят что это япон, но уж очень похож на батон_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('administrykanami')
    .setDescription('ADMINISTRATIUM — бототвинохлебоводитель сервера')
  );
  commandDataArray.push({
    name: "administrykanami",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}